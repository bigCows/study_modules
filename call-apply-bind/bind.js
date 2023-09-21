/**
 * 
 * @context function
 * @returns function
 * @description bind方法不会立即执行方法
 */

Function.prototype.myBind = function (context,...args) {
    const fn = this
    context = context || window

    const symBolKey = Symbol()

    context[symBolKey] = fn
    return function(...params) {
        return context[symBolKey](...args,...params)
    }
}

function greet(...message) {
    console.log(...message, this.name,22);
  }
  
  const person = {
    name: 'John'
  };
  
  const boundGreet = greet.myBind(person, 'Hello','hi');
  boundGreet();
  boundGreet();
  boundGreet(); 