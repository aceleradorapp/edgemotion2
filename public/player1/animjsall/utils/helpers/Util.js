class Util{
    constructor(){

    }

    /**
     * Método que gera um guid baseado no timestamp autal.
     * O guid é um valor unico composnto por 15 caracteres por default
     * 
     * @param {Int} totalCharacter 
     * @returns 
     */
    generateGuid(totalCharacter = 15) {
        const timestamp = Date.now().toString(); 
        let guid = '';
      
        for (let i = 0; i < totalCharacter; i++) {
          const randomDigit = Math.floor(Math.random() * 10); 
          guid += randomDigit.toString();
        }
      
        return timestamp + guid; // Concatenamos o timestamp com os dígitos aleatórios
      }
}

export default Util;
