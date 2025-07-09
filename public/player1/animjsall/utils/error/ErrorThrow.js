/**
 * Classe responsável em emviar mensagens ao compilador de erros
 */
class ErrorThrow {
  /**
   * A classe contém um método chamado "error" que é responsável por enviar uma mensagem de erro para o compilador 
   * de qualquer nível da classe. Para utilizá-lo, é necessário passar o contexto da classe (this) como parâmetro, 
   * bem como a mensagem de erro propriamente dita.
   * O método funciona lançando um erro através do comando "throw", utilizando como mensagem a concatenação da string 
   * contendo o contexto da classe e a mensagem de erro.
   * O código da classe pode ser utilizado como base, sendo necessário apenas chamar o método "error" 
   * e passar os parâmetros necessários.
   *
   */
  constructor() {
    // construtor padrão
  }

  /**
   * Método responsável em enviar um erro para o compilador de qualquer nível da classe.
   * classObject, normalmente passado o contexto da classe (this).
   * errorMenssage, a mensagem propriamente dita.
   * 
   * @param {Class} classObject 
   * @param {String} errorMessage 
   */
  error(classObject, errorMessage) {
    throw new Error(`${classObject.constructor.name} - ${errorMessage}`);
  }
}

export default ErrorThrow;

/*

exemplo de uso

class MinhaClasse {
constructor() {
  this.error = new Error();
}

meuMetodo() {
  // Faça algo aqui
  if (algumaCondicao) {
    this.error.message('MinhaClasse', 'Algum erro ocorreu');
  }
}
}

*/