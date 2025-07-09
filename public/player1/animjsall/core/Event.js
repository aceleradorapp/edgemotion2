/**
    A classe Event representa um evento que pode ser enviado e recebido entre objetos.
    Ela contém propriedades para identificar o tipo de evento, para acessar o 
    objeto de destino e para acessar os dados do evento.
*/
const Event = {
    INITIALISE: 'initialize',
    ENDED: 'ended',
    STARTED: 'started',
    ENTER_FRAME: 'enter_frame',
    ADDED_TO_STAGE: 'added_to_stage',
    LOAD_COMPLETE:'load_complete',
    CLICK: 'click',
    MOUSE_STATE:'mouse_state',
    MOUSE_OVER: 'mouseover',
    MOUSE_OUT: 'mouseout',
    MOUSE_MOVE:'mousemove',
    MOUSE_UP:'mouseup',
    ENABLE_MOUSE_EVENT: 'enabledMouseEvent',
    Mouse_DOWN:'mousedown',
    KEY_UP:'keyup',
    KEY_DOWN:'keydown',
    COLLISION:'collision',
    BUTTON_COMPLETE:'button_compolete',
    BUTTON_OVER:'button_over',
    BUTTON_UP:'button_up',
    BUTTON_DOWN:'button_down',
    UPDATE_SCENE:'update_scene',
    IMAGE_COMPLETE:'image_complete',
    COMPLETE:'complete',    
  };
  
  Object.freeze(Event); // Congele o objeto para torná-lo imutável
  
  export default Event;