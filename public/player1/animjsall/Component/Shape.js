import Sprite from "../display/Sprite.js";

export default class Shape{
    constructor(){

    }

    rectangle(x,y,width,height,color){
        var object = new Rectangle();
        object.type = 'rectangle';
        object.x = x;
        object.y = y;
        object.width = width;
        object.height = height;
        object.color = color;

        return object;
    }

    circle(x,y,radius,color){
        var object = new Circle();
        object.type = 'circle';
        object.shape = 'circle';
        object.x = x;
        object.y = y;
        object.radius = radius;
        object.color = color;

        return object;
    }

    triangle(x,y,width, height){
        var object = new Circle();
        object.type = 'circle';
        object.x = x;
        object.y = y;
        object.radius = radius;
        object.color = color;

        return object;
    }

    balloon(x,y, width, height, color){
        var object = new Balloon();
        object.type = 'balloon';
        object.x = x;
        object.y = y;
        object.width = width;
        object.height = height;
        object.color = color;
        
        
        return object;
    }
}

class Rectangle extends Sprite{
    constructor(){
        super()
    }

    draw(context2d){
        var calculatePosition = this._calculatePosition();
        const objectX = calculatePosition.x;
        const objectY = calculatePosition.y;
        
        context2d.globalAlpha = this._alpha;
        context2d.beginPath();        
        context2d.rect(this._parentContainerX, this._parentContainerY, this._width, this._height);
        context2d.fillStyle = this._color;
        context2d.fill(); 
        context2d.closePath();
    }
}

class Circle extends Sprite{
    constructor(){        
        super();         
    }        

    draw(context2d){           
        context2d.beginPath();
        context2d.arc(this._parentContainerX, this._parentContainerY, this._radius, 0, 2 * Math.PI, false);
        context2d.fillStyle = this._color;
        context2d.fill();
        context2d.closePath();        
    }

    resize(radius){
        this._radius = radius;
    }
}

class Triangle extends Sprite{
    constructor(){        
        super();         
    }        

    draw(context2d){        
        // criar codigo par desenhar
    }
}

class Balloon extends Sprite{
    constructor(){
        super();
    }

    draw(context2d){
       
    const x = this._parentContainerX + this._width / 2;
    const y = this._parentContainerY + this._height / 2;
    const radius = Math.min(this._width, this._height) / 2;
    const controlOffset = radius / 2;

    context2d.globalAlpha = this._alpha;
    context2d.beginPath();
    context2d.moveTo(x, y - radius);
    context2d.quadraticCurveTo(x - controlOffset, y - controlOffset, x - radius, y);
    context2d.quadraticCurveTo(x - controlOffset, y + controlOffset, x, y + radius);
    context2d.quadraticCurveTo(x + controlOffset, y + controlOffset, x + radius, y);
    context2d.quadraticCurveTo(x + controlOffset, y - controlOffset, x, y - radius);
    context2d.fillStyle = this._color;
    context2d.fill();
    context2d.closePath(); 
    }
}




