function myPromise (executor) {
  
  this.PENDING = 'pending'
  this.FULFILLED = 'fulfilled'
  this.REJECTED = 'rejected'

  this.status = 'pending'
  this.value = null // 成功结果
  this.reason = null // 失败原因
  this.cbs = [] // 收集未执行的回调


  const resolve = (value) => {
    // 状态恒定，不可更改
    if(this.status !== this.PENDING) return
    // 首次状态改变
    this.status = this.FULFILLED
    // 将res传递给then的回调
    this.value = value
    this.cbs.forEach((item) => {
      item.onFulfilled && item.onFulfilled(value)
    })
  }

  const reject = (reason) => {  
    if(this.status !== this.PENDING) return
    this.status = this.REJECTED
    this.reason = reason
    this.cbs.forEach((item) => {
      item.onRejected && item.onRejected(reason)
    })
  }

  try {
    executor(resolve,reject)
  } catch (error) {
    reject(error)          
  }
    
}

// http://www.promisesaplus.com  A+规范

function resolvePromise (p2, x, resolve, reject) {
  // 防止等待自己完成

  if (p2 === x) { 
    return reject(new TypeError('Promise循环'))
  }
  // A+2.3.3.3.3 如果同时调用了resolvePromise 和 rejectPromise，或者对同一个参数进行多次调用，执行第一个调用，并忽略后面所有调用
  let called;
  if ((typeof x === 'object' && x != null) || typeof x === 'function') { 
    try {
      // A+2.3.3.1 使用变量保存x.then，防止重复获取Promise实例结果
      let then = x.then; // A+2.3.3.2 x.then可能是通过Obje.defineProperty-getter定义的，可能会发生异常
      if (typeof then === 'function') { 
        console.log(then);
        // A+2.3.3.3 如果then是一个函数，将x的this绑给then，第一个参数是resolvePromise，第二个参数是rejectPromise,调用then
        then.call(x, y => {
          if (called) return;
          called = true;
          resolvePromise(p2, y, resolve, reject); 
        }, r => {
          if (called) return;
          called = true;
          reject(r);
        });
      } else {
        // 如果 x.then 是个普通值就直接返回 resolve 作为结果
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e)
    }
  } else {  
    resolve(x)
  }
}


myPromise.prototype.then = function(onFulfilled,onRejected) {
  // A+规范，then方法返回一个promise
  let p2 = new myPromise((resolve,reject) => {
    // 由于onFulfilled/onRejected是可选参数，所以需要判断是否为函数,不是函数将创建一个函数，将其赋给参数并返回
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
    onRejected = typeof onRejected === 'function' ? onRejected : r => {throw r}
    if(this.status === this.FULFILLED) {
    setTimeout(() => {
      try {
        let x = onFulfilled(this.value)
        console.log('x',x)
        resolvePromise(p2,x,resolve,reject)
      } catch (error) {
        reject(error)
      }
    }, 0);
  // 处理链式调用
  // if(x instanceof myPromise) {
  //   // 如果返回值是promise实例，那么将返回值的resolve传递给下一个then
  //   x.then((res) => {
  //     resolve(res)
  //   },(err) => {
  //     reject(err)
  //   })
  // } else {
  //   setTimeout(() => {
  //     try {
  //       resolve(x)
  //     } catch (error) {
  //       reject(error)
  //     }
  //   }, 0);
  // }
  }

  if(this.status === this.REJECTED) {
    setTimeout(() => {
      try {
        let x = onRejected(this.reason)
        resolvePromise(p2,x,resolve,reject)
      } catch (error) {
        reject(error)      
      }
    }, 0);
  }
    
  if(this.status === this.PENDING) {
    // 实例中异步操作没执行完,resolve/reject就开始执行了，针对此种情况，先将回调收集起来，等实例中异步操作执行完后再执行
    // this.cbs.push({onFulfilled,onRejected})
    this.cbs.push(
      {
        onFulfilled: (value) => {
          setTimeout(() => {
            try {
              let x = onFulfilled(value)
              resolvePromise(p2,x,resolve,reject)
            } catch (error) {
              reject(error)
            } 
          },0);
        },
        onRejected: (reason) => {
          setTimeout(() => {
            try {
              let x = onRejected(reason)
              resolvePromise(p2,x,resolve,reject)
            } catch (error) {
              reject(error)
            }
          },0);
        }
      }
    )
  }
 })

 return p2

}


const p = new myPromise((resolve,reject) => {
 
  // setTimeout(() => {
    // resolve('success')
    // reject('fail')    
  // }, 1000);
  resolve('successpromise')
  // reject('fail')
})

const p1 = p.then((res) => {
  console.log(res,'thenres')
  // return res
  // return p1
  return new myPromise((resolve,reject) => {
    resolve(new myPromise((resolve,reject) => {
      resolve(new myPromise((resolve,reject) => {
        setTimeout(() => {
          resolve('successpromise2222222') 
        });
      }))
    }))
  })
},(err) => {
  console.log(err,'thenerr')
  return 'hhhh'
}).then((res) => {
  console.log(res,'res2');
},(err) => {
  console.log(err);
})
// p1.then((res) => {  
//   console.log(res,'thenres22');
// },(err) => {
//   console.log(err);
// })



// p.then((res) => {
//   console.log(res,'thenres')
// },(err) => {
//   console.log(err,'thenerr')
// })
// p.then((res) => {
//   console.log(res,'thenres')
// },(err) => {
//   console.log(err,'thenerr')
// })


// 测试用例
myPromise.defer = myPromise.deferred = function () {
  let dfd = {};
  dfd.promise = new myPromise((resolve,reject)=>{
      dfd.resolve = resolve;
      dfd.reject = reject;
  })
  return dfd;
}

module.exports = myPromise

