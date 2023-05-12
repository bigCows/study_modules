/**
 * @description: 生成器
 */

// 生成器函数特征 function* 生成器函数名() {}
// 生成器函数返回的是一个迭代器对象,内部可以使用yield关键字
// yield关键字后面可以跟任意表达式,可以暂停生成器函数的执行,可以向外部传递数据
// 生成器函数可以返回任意多个值
// generator是一个迭代器对象,也是一个可迭代对象

function* fn(num) {
  // const a = yield 'sss'
  console.log('111',num);
  const num1 = yield 1
  console.log('222',num1);
  const num2 = yield 2
  console.log('333',num2);
  yield 3
}

const generator = fn('next1')
console.log(generator.next('bbb')); // 第一次调用next方法时，传递的参数无效,因为没有上一个yield
console.log(generator.next('next2'));
console.log(generator.next('next3'));
console.log(generator.next('next4'));


// 提前结束生成器函数
function* fns() {
  console.log('--------------');
  try {
    const num1 = yield 1
    console.log('222',num1);
  } catch (error) {
    console.log(error);
  }
  const num2 = yield 2
  console.log('333',num2);
  yield 3
}

const generators = fns()
console.log(generators.next('bbb')); 
// console.log(generators.return('next2')); // 迭代器内部的return方法能够中断生成器函数的执行，只要done为true,就会中断
console.log(generators.throw('next2 throw error')); // 通过throw方法可以向生成器函数内部抛出一个错误  通过try catch可以捕获错误 通过throw方法抛出的错误，可以被外部捕获 通过throw方法抛出的错误，会导致生成器函数内部的代码终止执行，会导致done为true，会导致迭代器对象的value为undefined

console.log(generators.next('next3'));



console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');

// 使用生成器代替迭代器内部[Symbol.iterator]方法
function* fnss(arys) {
  for(let i = 0; i < arys.length; i++) {
    yield arys[i]
  }
}

const arrs = ['123','456','789']
const generatorss = fnss(arrs)
console.log(generatorss.next());
console.log(generatorss.next());
console.log(generatorss.next());
console.log(generatorss.next());

// 生成范围内的数字 
function* range(start, end) {

  for(let i = start; i < end; i++) {
    yield i
  }
}

const generatorsss = range(5, 9)
console.log(generatorsss.next());
console.log(generatorsss.next());
console.log(generatorsss.next());
console.log(generatorsss.next());
console.log(generatorsss.next());

console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');

// 使用yield*语法糖,yield*后面跟的是一个可迭代对象,调用next方法，返回的是可迭代对象的迭代器对象
function* fun() {
  yield* [1,2,3]
}

const sugar = fun()
console.log(sugar.next());
console.log(sugar.next());
console.log(sugar.next());