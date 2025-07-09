/**
    A classe Event representa um evento que pode ser enviado e recebido entre objetos.
    Ela contém propriedades para identificar o tipo de evento, para acessar o 
    objeto de destino e para acessar os dados do evento.
*/
const Event = {
    ACTION: 'action',
   
  };
  
  Object.freeze(Event); // Congele o objeto para torná-lo imutável
  
  export default Event;