//
// Figura.js
//

class Figura 
{
    constructor(posX, posY, ctx, selected)
    {
        this.posX = posX;
        this.posY = posY;
        this.ctx = ctx;
        this.slctd = selected;
        this.fill();
    }

    draw()
    {
        // nothing to do - abstract method
    }

    moveTo(posX, posY)
    {
        this.posX = posX;
        this.posY = posY;
    }

    selected(selected)
    {
        this.slctd = selected;
    }

    estaElPunto(mX, mY){
        
        // nothing to do - abstract method

        return null; 
    }

    fill()
    {
        ctx.fillStyle = this.randomRGBA(50, 150);
        ctx.fill();
    }

    randomRGBA() {
        let r = Math.round(Math.random() * 255);
        let g = Math.round(Math.random() * 255);
        let b = Math.round(Math.random() * 255);
        let a = 255;
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
    
}