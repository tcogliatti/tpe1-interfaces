"use strict";

let canvas = document.querySelector('#canvas');
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;
let ctx = canvas.getContext('2d');

////////////////////////////// Setup
                            //
const LIMIT = 10;           // cant de figuras
const MIN_ZISE = 100;       // tamaño minimo de la fig
const MAX_ZISE = 150;       // tamaño maximo
let deltaPos;               // variable global de distancia entre puntos
let figuras = [];           // array de figuras

//////////////////////////// Main

function main() {

    // Create all figures
    createFigures()

    // Draw All images
    drawAllImages();

    // select figure & move functionality
    selectFigure();

    // escucha click up
    dropFigure();
}

//////////////////////////// Create Figures
/* 
    este procedimiento instancia las figuras y las almacena en un array
    los indices pares crearan Rectangulo
    los impares instanciarán Circulos
*/ 
function createFigures() {
    
    for (let index = 0; index < LIMIT; index++) {

        if((index % 2) == 0){
            let l1 = Math.floor(Math.random() * (MAX_ZISE - MIN_ZISE + 1) + MIN_ZISE);
            let l2 = Math.floor(Math.random() * (MAX_ZISE - MIN_ZISE + 1) + MIN_ZISE);

            let posX = Math.floor(Math.random() * (canvas.width  - l1 + 1)); // evita que parte de la figura este por fuera del canvas
            let posY = Math.floor(Math.random() * (canvas.height - l2 + 1));

            let rectangle = new Rectangulo(posX, posY, l1, l2, ctx);
            figuras.push(rectangle);

        }else{
            let r = Math.ceil((Math.floor(Math.random() * (MAX_ZISE - MIN_ZISE + 1) + MIN_ZISE))/2);

            let posX = Math.floor(Math.random() * (canvas.width  - 2 * r + 1) + r ); // evita que parte de la figura este por fuera del canvas
            let posY = Math.floor(Math.random() * (canvas.height - 2 * r + 1) + r );

            let circle = new Cicrulo(posX, posY, r, ctx);
            figuras.push(circle);
        }
    }
}

//////////////////////////// Dibujar figuras
/*
    procedimiento que itera el arrray de figuras e
    invoca el método draw() en cada una para que se
    pinten en el canvas
*/
function drawAllImages() {
    figuras.forEach(fig => {
        fig.draw();
 });
}

//////////////////////////// Select Figuras
/*
    este procedimiento es el encargado de añadir un evento de tipo 
    "mousedown" al canvas. Cada vez que sea clic este evento va a:

        1. Verificar si el clic fue hecho sobre una figura invocando el método estaElPunto()
        2. El array se itera con un while, de atras hacia adelante para que tome como prioridad del click
           la figura que esta más arriba
        3. obtiene el diferencial entre el punto de ubicacion de la figura y las coordenadas
           del cursos al hacer clic para corregir el salto en el movimiento inicial
        4. se pasa la figurasleccionada  al final del array para que cuando se dibuje el 
           canvas la figura seleccionada quede arriba de las demás
        5. se agrega el evento "mousemove" para mover la figura seleccionada
*/ 
function selectFigure(){
    canvas.addEventListener('mousedown', function (e) { // escucha clic down
        
        let index = LIMIT-1;
        let selected = false;
        while(index >= 0 && !selected){ // check si el click se hizo sobre una figura
           
            const figura = figuras[index];
            // verifica que el click se hizo dentro de la figura
            let clic = {x: (e).offsetX, y: (e).offsetY}
            if (figura.estaElPunto(clic["x"], clic["y"])){
              
                // la figura seleccionada pasa al frente (desde el punto de vista del array, al final)
                const aux = figuras[index];
                let actPos = aux.getPos();
                deltaPos = {x:(clic['x']-actPos['x']), y:(clic['y']-actPos['y'])}; // obtenemos el diferencial entre el pto de ubicacion de la figura y el clock del mouse
                aux.selected(true); 
                figuras.splice(index, 1);
                figuras.push(aux);
                // agrega una escucha para el movimiento
                canvas.addEventListener('mousemove', dragFigure);
                selected = true;
                break;
            }
            index--;
        }
    });
}
//////////////////////////// Drop Figure
/*
    Este procedimiento es para cuando se deja de arrastrar una figura
    haciendo un "mouseup".
        1. quita el evento "mousemove" 
        2. desselecciona la figura seleccionada
*/
function dropFigure() {
    canvas.addEventListener('mouseup', function (e) {
        for (let index = 0; index < LIMIT; index++) {
            const figura = figuras[index];
            if(figura.isSelected()){
                canvas.removeEventListener('mousemove', dragFigure);
                figura.selected(false);
            }
        }
    });
}
//////////////////////////// Drag Figure
/*
    Este procedimiento es para cuando arrastra una figura, con el click presionado,
    haciendo un "mousemove". 
    Recibe un parametro de tipo evento mousedown
        1. limpia el canvas
        2. aplica nueva coordenada a la figura seleccionada:
            a. toma como referencia la coordenada del mouse al momento de moverse
            b. a la coordenada del punta (a) se le aplica la correccion obtenida en 
               el procedimiento selectFigure(), para evitar un salto decoordenada
            c. se aplica nueva coordenada a figura seleccionada
        3. se redibuja el canvas
*/
function dragFigure(e) {
    // limpiamos el lienzo
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    // asignamos las nuvas coordenadas a la fiugra seleccionada
    figuras.forEach(fig => {
        if(fig.isSelected()){
            fig.moveTo(e.offsetX-deltaPos['x'], e.offsetY-deltaPos['y']);
        }
    });
    // redibujamos el lienzo
    drawAllImages();

}