"use strict";

let canvas = document.querySelector('#canvas');
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;
let ctx = canvas.getContext('2d');

////////////////////////////// Setup
                            //
const LIMIT = 6;            // cant de figuras
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
function drawAllImages() {
    figuras.forEach(fig => {
        fig.draw();
 });
}

//////////////////////////// add drag & drop functionality
function selectFigure(){
    canvas.addEventListener('mousedown', function (e) { // escucha clic down
        let index = LIMIT-1;
        let selected = false;
        while(index >= 0 && !selected){ // check si el click se hizo sobre una figura
            const figura = figuras[index];
            // verifica que el click se hizo dentro de la figura
            let clic = {x: (e).offsetX, y: (e).offsetY}
            if (figura.estaElPunto(clic["x"], clic["y"])){
                let actPos = figura.getPos();
                deltaPos = {x:(clic['x']-actPos['x']), y:(clic['y']-actPos['y'])};
                figura.selected(true); 
                // agrega una escucha para el movimiento
                canvas.addEventListener('mousemove', dragFigure);
                selected = true;
                break;
            }
            index--;
        }
    });
}

function dropFigure() {
    canvas.addEventListener('mouseup', function (e) {
        for (let index = 0; index < LIMIT; index++) {
            const figura = figuras[index];
            if(figura.isSelected()){
                canvas.removeEventListener('mousemove', dragFigure);
                figura.selected(false);
                // console.log(figuras);
            }
        }
    });
}

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


// get position relative on canvas
function getMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}