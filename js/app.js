"use strict";

let canvas = document.querySelector('#canvas');
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;
let ctx = canvas.getContext('2d');

////////////////////////////// Setup
                            //
const LIMIT = 20;           // cant de figuras
const MIN_ZISE = 20;        // tamaño minimo de la fig
const MAX_ZISE = 100;       // tamaño maximo
const DELAY = 100;          // delay de aparicion de cada figura
let figuras = [];

//////////////////////////// Main

function main() {

    // Create Figures ///////////////////////////////////////////

    for (let index = 0; index < LIMIT; index++) {

        let posX = Math.floor(Math.random() * canvas.width);
        let posY = Math.floor(Math.random() * canvas.height);

        let ctrl = Math.round((Math.random() + 1));
        
        if(ctrl == 1){
            let l1 = Math.floor(Math.random() * (MAX_ZISE - MIN_ZISE + 1) + MIN_ZISE);
            let l2 = Math.floor(Math.random() * (MAX_ZISE - MIN_ZISE + 1) + MIN_ZISE);
            let rectangle = new Rectangulo(posX, posY, l1, l2, ctx, true);
            rectangle.fill();
            figuras.push(rectangle);
        }else{
            let r = Math.floor(Math.random() * (MAX_ZISE - MIN_ZISE + 1) + MIN_ZISE);
            let circle = new Cicrulo(posX, posY, r, ctx, true);
            circle.fill();
            figuras.push(circle);
        }
    }

    // Draw All images
    drawAllImages();


    // add drag&drop functionality ///////////////////////////////////////////

    // escucha clic down
    canvas.addEventListener('mousedown', function (e) {
        for (let index = 0; index < LIMIT; index++) {
            const figura = figuras[index];
            // verifica que el click se hizo dentro de la figura
            if (figura.estaElPunto((e).offsetY, (e).offsetX)){
                // agrega una escucha para el movimiento 
                canvas.addEventListener('mousemove', dragFigure(index, e));
            }
        } 
    });

    // escucha click up
    canvas.addEventListener('mouseup', function (e) {
        for (let index = 0; index < LIMIT; index++) {
            const figura = figuras[index];
                canvas.removeEventListener('mousemove', dragFigure(index, e));
            }
    });
    
}

function drawAllImages() {
    figuras.forEach(fig => {
        fig.draw();
 });
}

function dragFigure(index, e) {
    
    // limpiamos el lienzo
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // asignamos las nuvas coordenadas a la fiugra
    figuras[index].moveTo((e).offsetX, (e).offsetY);

    // redibujamos el lienzo
    drawAllImages();
    
}


