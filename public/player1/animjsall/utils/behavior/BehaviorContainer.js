class BehaviorContainer{
    /**
     * Classe que armazena e executa todos os 
     * comportamentos adicionado ao objeto
     */
    constructor(){
        this._behavior = [];
    }
    /**
     * Adiciona um comportamento
     * @param {string} name 
     * @param {behavior} behavior 
     */
    add(name, behavior){
        var object = {
            name: name,
            behavior: behavior
        }

        this._behavior.push(object);
    }

    /**
     * Remove um comportamento pelo nome
     * @param {string} name 
     */
    remove(name){
        for (let i = 0; i < this._behavior.length; i++) {
            if (this._behavior[i].name === name) {
                this._behavior.splice(i, 1);
                break;
            }
        }
    }

    /**
     * Remove todos os comportamentos
     */
    removeAll(){
        this._behavior = [];
    }
    /**
     * Executa os comportamentos
     */
    execute(object){
        if(!object)return;        

        for (let i = 0; i < this._behavior.length; i++) {
            this._behavior[i].behavior.execute(object);            
        }
    }
    /**
     * Retorna a quantidade de comportamento que o objeto possui
     * @returns number
     */
    count() {
        return this._behavior.length;
    }

    /**
     * Retorna uma lista com todos os nomes dos comportamentos do objeto.
     * @returns Array
     */
    listBehaviorsName() {
        let names = [];
    
        for (let i = 0; i < this._behavior.length; i++) {
            names.push(this._behavior[i].name);
        }
    
        return names;
    }
    /**
     * Retorna uma lista com todos os comportamentos do objeto
     * @returns Array
     */
    listBehaviors() {
        let behaviors = [];
    
        for (let i = 0; i < this._behavior.length; i++) {
            behaviors.push(this._behavior[i].behavior);
        }
    
        return behaviors;
    }

    /**
     * Cria uma cópia dos comportamentos do objeto
     * @returns Array
     */
    copyBehaviors() {
        return this._behavior.slice();
    }
    
}

export default BehaviorContainer;