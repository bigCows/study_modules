/**
 * 
 * @param {object} context 
 * @param {array} args  
 * @returns 
 * @description 手动实现一个apply，和call的区别是，call接收单个参数，而apply接收数组参数
 */

Function.prototype.myApply = function (context, args) {
    // 将当前函数保存在变量中
    const fn = this;
    console.log(this);
    console.log(...args);

    // 确保传递的上下文是对象，如果未传递上下文，则默认为全局对象（在浏览器中是 `window`）
    context = context || window;

    // 在传递的上下文中定义一个临时的唯一属性，以确保不会覆盖原有属性
    const uniqueKey = Symbol();
    context[uniqueKey] = fn;

    // 使用临时属性调用函数
    const result = context[uniqueKey](...args);

    // 删除临时属性
    delete context[uniqueKey];

    // 返回函数执行结果
    return result;
  };

  function greet(...message) {
    console.log(...message,this.name);
  }

  const person = {
    name: "John"
  };

  greet.myApply(person, ["Hello",'hi','xx']);
