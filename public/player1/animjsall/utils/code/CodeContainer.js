class CodeContainer {
  /**
   * Classe que executa um arquivo contendo codigo em javascript dentro o objeto.
   */
    constructor() {
      this._code = [];
    }
  
    /**
     * Adiciona um código
     * @param {string} name 
     * @param {code} code 
     */
    add(name, code) {
      var object = {
        name: name,
        code: code
      };
  
      this._code.push(object);
    }
  
    /**
     * Remove um código pelo nome
     * @param {string} name 
     */
    remove(name) {
      for (let i = 0; i < this._code.length; i++) {
        if (this._code[i].name === name) {
          this._code.splice(i, 1);
          break;
        }
      }
    }
  
    /**
     * Remove todos os códigos
     */
    removeAll() {
      this._code = [];
    }
  
    /**
     * Executa os códigos
     */
    execute(object) {
      if (object) return;
  
      for (let i = 0; i < this._code.length; i++) {
        this._code.execute(object);
      }
    }
  
    /**
     * Retorna a quantidade de códigos que o objeto possui
     * @returns number
     */
    count() {
      return this._code.length;
    }
  
    /**
     * Retorna uma lista com todos os nomes dos códigos do objeto.
     * @returns Array
     */
    listCodesName() {
      let names = [];
  
      for (let i = 0; i < this._code.length; i++) {
        names.push(this._code[i].name);
      }
  
      return names;
    }
  
    /**
     * Retorna uma lista com todos os códigos do objeto
     * @returns Array
     */
    listCodes() {
      let codes = [];
  
      for (let i = 0; i < this._code.length; i++) {
        codes.push(this._code[i].code);
      }
  
      return codes;
    }
  
    /**
     * Cria uma cópia dos códigos do objeto
     * @returns Array
     */
    copyCodes() {
      return this._code.slice();
    }
  }
  
  export default CodeContainer;
  