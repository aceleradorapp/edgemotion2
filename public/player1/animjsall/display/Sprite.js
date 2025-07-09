/**
    A classe Sprite é uma subclasse de DisplayObjectContainer que adiciona a 
    capacidade de desenhar gráficos vetoriais.
    Ela possui métodos para desenhar linhas, curvas e formas, para preencher 
    áreas com cores e para aplicar gradientes e texturas.
*/
import DisplayObjectContainer from "./DisplayObjectContainer.js";

class Sprite extends DisplayObjectContainer{
    constructor(){
        super();
    }    
}

export default Sprite;