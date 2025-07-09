import EventDispatcher from "../../core/EventDispatcher.js";

class Behavior extends EventDispatcher{
    /**
     * Classe Behavior ela é usada como base de herança para 
     * criação de comportamentos personalizados;
     */
    constructor(){
        super()
    }
    /**
     * Método para ser sobrescrito que executa os comportamentos.
     */
    execute(){

    }
}

export default Behavior;