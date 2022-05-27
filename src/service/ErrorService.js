class Exception extends Error { // parent error
    constructor(message) {
        super();
        this.message = message;

        if (this instanceof BadRequestException){
            this.status = 400
        }
          
        else if (this instanceof InternalException){
            this.status = 500
        }
    }
  }

  // extending to child error classes
class BadRequestException extends Exception { }
class InternalException extends Exception { }

module.exports = {
    Exception,
    BadRequestException,
    InternalException
}
