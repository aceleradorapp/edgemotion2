/**
  A classe DisplayObjectContainer estende a classe InteractiveObject e 
  adiciona a capacidade de agrupar objetos DisplayObject.
  Ela possui métodos para adicionar e remover objetos filhos, para controlar a ordem de 
  exibição dos objetos filhos e para manipular a transformação em grupo dos objetos filhos.
*/

import InteractiveObject from "./InteractiveObject.js";
import Event from "../core/Event.js";

class DisplayObjectContainer extends InteractiveObject {
    constructor() {
      super();
      this._children = [];
    }
  
    // Retorna o número de objetos de exibição neste contêiner
    get numChildren() {
      return this._children.length;
    }
  
    // Adiciona um objeto de exibição como filho deste contêiner
    addChild(child) {
      if (child.parent) {
        child.parent.removeChild(child);
      }
      this._children.push(child);

      child.parent = this;
      child._context = this._context;
      child.enableMouseEvents();
      child._recalculateParameters();

      child.dispatchEvent(Object.assign({},{type:Event.ADDED_TO_STAGE}, child));      

      return child;
    }

    /**
     * Adiciona uma lista de children
     * @param {Array} children 
     */
    addChildren(children) {
      if (Array.isArray(children)) {
        for (let i = 0; i < children.length; i++) {
          this.addChild(children[i]);
        }
      }
    }
  
    // Adiciona um objeto de exibição como filho deste contêiner em uma determinada posição
    addChildAt(child, index) {
      if (child.parent) {
        child.parent.removeChild(child);
      }
      this._children.splice(index, 0, child);
      
      child.parent = this;
      child._context = this._context;
      child.enableMouseEvents();
      child._recalculateParameters();

      child.dispatchEvent(Object.assign({},{type:Event.ADDED_TO_STAGE}, child));

      return child;
    }
  
    // Remove um objeto de exibição filho deste contêiner
    removeChild(child) {
      const index = this._children.indexOf(child);
      if (index !== -1) {
        this._children.splice(index, 1);
        child.disableMouseEvents();
        child.parent = null;
      }
      return child;
    }
  
    // Remove todos os filhos deste contêiner
    removeChildren() {
      while (this.numChildren > 0) {
        this.removeChildAt(0);
      }
    }
  
    // Remove um objeto de exibição filho deste contêiner em uma determinada posição
    removeChildAt(index) {
      const child = this._children[index];
      if (child) {
        this._children.splice(index, 1);
        child.disableMouseEvents();
        child.parent = null;
        return child;
      }
    }
  
    // Retorna o objeto de exibição filho deste contêiner em uma determinada posição
    getChildAt(index) {
      return this._children[index];
    }
  
    // Retorna o objeto de exibição filho deste contêiner com o nome especificado
    getChildByName(name) {
      for (let i = 0; i < this.numChildren; i++) {
        const child = this.getChildAt(i);
        if (child.name === name) {
          return child;
        }
      }
    }

    /**
     * Retorna o objeto de exibição filho deste contêniner com o nome da instância especificado
     * 
     * @param {String} nameInstance 
     * @returns InteractiveObject
     */
    getChildByInstance(nameInstance) {
      for (let i = 0; i < this.numChildren; i++) {
        const child = this.getChildAt(i);
        if (child.instance === nameInstance) {
          return child;
        }
      }
    }

    /**
     * Retorna o objeto de exibição filho deste contêniner com o guid do especificado
     * 
     * @param {String} nameInstance 
     * @returns InteractiveObject
     */
    getChildByGUID(GUID) {
      for (let i = 0; i < this.numChildren; i++) {
        const child = this.getChildAt(i);
        if (child.guid === GUID) {
          return child;
        }
      }
    }

    /**
     * Retorna o objeto de exibição filho deste contêniner com o type especificado
     * 
     * @param {String} nameInstance 
     * @returns InteractiveObject
     */
    getChildrenByType(type) {
      var listChildren = [];
      for (let i = 0; i < this.numChildren; i++) {
        const child = this.getChildAt(i);
        if (child.type === type) {
          listChildren.push(child);
        }
      }

      if(listChildren.length == 0) listChildren = null;

      return listChildren;
    }

    /**
     * Desabilita todos os eventos do mouse nos objetos de um tipo
     * @param {string} type 
     */
    disableMouseChildrenByType(type){
      for (let i = 0; i < this.numChildren; i++) {
        const child = this.getChildAt(i);
        if (child.type === type) {
          child.mouseEnabled = false;
        }
      }
    }

    /**
     * Habilita todos os eventos do mouse nos objetos de um tipo
     * @param {string} type 
     */
    enableMouseChildrenByType(type){
      for (let i = 0; i < this.numChildren; i++) {
        const child = this.getChildAt(i);
        if (child.type === type) {
          child.mouseEnabled = true;
        }
      }
    }
  
    // Retorna true se este contêiner contém o objeto de exibição filho especificado
    contains(child) {
      return this._children.indexOf(child) !== -1;
    }
  
    // Atualiza o estado deste contêiner e de todos os seus filhos
    render(context2d) {  
              
      context2d.save();
                           
      this.beginUpdate(context2d); 
      this.draw(context2d);
      this.endUpdate(context2d);                        

      for (let i = 0; i < this.numChildren; i++) {
        const child = this.getChildAt(i);
        child._recalculateParameters();
        child.render(context2d);
      }

      context2d.restore();

      this.dispatchEvent(Object.assign({}, {type:'enter_frame', }, this)); // colocar o evento da classe Event
    }
}

export default DisplayObjectContainer;
  