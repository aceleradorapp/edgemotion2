/**
  A classe EventDispatcher adiciona a capacidade de enviar e receber eventos entre objetos.
  Ela possui métodos para adicionar e remover ouvintes de eventos, 
  para enviar eventos e para controlar a propagação dos eventos.
*/

class EventDispatcher {
  constructor() {
    this._listeners = {};
  }

  addEventListener(type, listener, useCapture = false, priority = 0, useWeakReference = false) {
    if (!this._listeners[type]) {
      this._listeners[type] = [];
    }
    this._listeners[type].push({ listener: listener, useCapture: useCapture, priority: priority, useWeakReference: useWeakReference });
    this._listeners[type].sort((a, b) => b.priority - a.priority);
  }

  removeEventListener(type, listener, useCapture = false) {
    if (this._listeners[type]) {
      const listeners = this._listeners[type];
      for (let i = 0; i < listeners.length; i++) {
        if (listeners[i].listener === listener && listeners[i].useCapture === useCapture) {
          listeners.splice(i, 1);
          break;
        }
      }
      if (listeners.length === 0) {
        delete this._listeners[type];
      }
    }
  }

  dispatchEvent(event) {
    const type = event.type;
    const listeners = this._listeners[type];
    if (listeners) {
      // Copia a lista de ouvintes para evitar problemas ao remover ou adicionar ouvintes durante a execução.
      const copyListeners = listeners.slice();
      for (let i = 0; i < copyListeners.length; i++) {
        const listenerObj = copyListeners[i];
        const listener = listenerObj.listener;
        const useCapture = listenerObj.useCapture;
        if (useCapture && event.eventPhase !== EventPhase.CAPTURING_PHASE) {
          continue;
        }
        listener.call(null, event);
        // if (event.isImmediatePropagationStopped()) {
        //   return false;
        // }
      }
    }
    return true;
  }

  hasEventListener(type) {
    return this._listeners[type] != null;
  }

  willTrigger(type) {
    let obj = this;
    while (obj) {
      if (obj.hasEventListener(type)) {
        return true;
      }
      obj = obj.parent;
    }
    return false;
  }
}

export default EventDispatcher;
