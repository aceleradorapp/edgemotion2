import ErrorThrow from "../utils/error/ErrorThrow.js";


/**
  A classe Object define um objeto base genérico que é usado como a base para todas as classes neste sistema.
  Ela inclui métodos para definir, recuperar e remover propriedades, 
  além de métodos para verificação de igualdade, clonagem e descrição do objeto.
*/
class Object extends ErrorThrow {
    constructor() {
      super()
    }
  
    toString() {
      return "[object Object]";
    }
  
    hasOwnProperty(name) {
      return Object.prototype.hasOwnProperty.call(this, name);
    }
  
    isPrototypeOf(object) {
      if (object === null) {
        return false;
      }
      let proto = Object.getPrototypeOf(object);
      while (proto !== null) {
        if (proto === this) {
          return true;
        }
        proto = Object.getPrototypeOf(proto);
      }
      return false;
    }
  
    propertyIsEnumerable(name) {
      const desc = Object.getOwnPropertyDescriptor(this, name);
      if (desc === undefined) {
        return false;
      }
      return desc.enumerable;
    }
  
    static getPrototypeOf(object) {
      return Object.getPrototypeOf(object);
    }
  
    static setPrototypeOf(object, proto) {
      Object.setPrototypeOf(object, proto);
    }
  
    static equals(object1, object2) {
      if (object1 === object2) {
        return true;
      }
      if (object1 === null || object2 === null) {
        return false;
      }
      if (Object.getPrototypeOf(object1) !== Object.getPrototypeOf(object2)) {
        return false;
      }
      const keys1 = Object.getOwnPropertyNames(object1);
      const keys2 = Object.getOwnPropertyNames(object2);
      if (keys1.length !== keys2.length) {
        return false;
      }
      for (let i = 0; i < keys1.length; i++) {
        const key = keys1[i];
        if (!Object.prototype.hasOwnProperty.call(object2, key) || object1[key] !== object2[key]) {
          return false;
        }
      }
      return true;
    }
  
    static isExtensible(object) {
      try {
        let prop = "____";
        while (Object.prototype.hasOwnProperty.call(object, prop)) {
          prop += "_";
        }
        object[prop] = 0;
        delete object[prop];
        return true;
      } catch (e) {
        return false;
      }
    }
  
    static preventExtensions(object) {
      return Object.preventExtensions(object);
    }
  
    static seal(object) {
      const props = Object.getOwnPropertyNames(object);
      for (let i = 0; i < props.length; i++) {
        const key = props[i];
        const desc = Object.getOwnPropertyDescriptor(object, key);
        if (desc !== undefined && desc.configurable) {
          Object.defineProperty(object, key, { configurable: false });
        }
      }
      return object;
    }
  
    static freeze(object) {
      const props = Object.getOwnPropertyNames(object);
      for (let i = 0; i < props.length; i++) {
        const key = props[i];
        const desc = Object.getOwnPropertyDescriptor(object, key);
        if (desc !== undefined && desc.configurable) {
          desc.configurable = false;
          desc.writable = false;
          Object.defineProperty(object, key, desc);
        }
      }
      return object;
    }
  }
  

export default Object;