import CustomException from "./CustomException.js"

function ErrorMessage(message) {
    throw new CustomException(message);
}

export default ErrorMessage

/*

class CustomException extends Error {
  constructor(message) {
    super(message);
    this.name = 'CustomException';
  }
}

class LowClass {
  throwError() {
    throw new CustomException('Erro na classe baixa');
  }
}

class HighClass {
  constructor() {
    this.low = new LowClass();
  }

  catchException() {
    try {
      this.low.throwError();
    } catch (error) {
      console.error(error);
    }
  }
}

// Exemplo de uso:
const high = new HighClass();
high.catchException(); // output: CustomException: Erro na classe baixa

*/