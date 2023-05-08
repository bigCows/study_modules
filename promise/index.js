

function myPromise (cb) {

  this.status = 'pending'
  this.value = null // 成功结果
  this.reason = null // 失败原因
  this.cbs = [] // 收集未执行的回调


  const resolve = (value) => {
    // 状态恒定，不可更改
    if(this.status !== 'pending') return
    // 首次状态改变
    this.status = 'fulfilled'
    // 将res传递给then的回调
    this.value = value
    this.cbs.forEach((item) => {
      item.onFulfilled && item.onFulfilled(value)
    })
  }

  const reject = (reason) => {  
    if(this.status !== 'pending') return
    this.status = 'rejected'
    this.reason = reason
    this.cbs.forEach((cb) => {
      cb.onRejected && cb.onRejected(reason)
    })
  }

  try {
    cb(resolve,reject)
  } catch (error) {
    reject(error)          
  }
    
}

myPromise.prototype.then = function(onFulfilled,onRejected) {

  // 处理链式调用
return new myPromise((resolve,reject) => {
  if(this.status === 'fulfilled') {
    let otherPromise = typeof onFulfilled === 'function' && onFulfilled(this.value)
  // 处理链式调用
  if(otherPromise instanceof myPromise) {
    // 如果返回值是promise实例，那么将返回值的resolve传递给下一个then
    otherPromise.then((res) => {
      resolve(res)
    },(err) => {
      reject(err)
    })
  } else {
    resolve(otherPromise)
  }
  }

  if(this.status === 'rejected') {
    typeof onRejected === 'function' && onRejected(this.reason)
  }

  if(this.status === 'pending') {
    // 实例中异步操作没执行完，此时status还是pending状态，resolve/reject就开始执行了，针对此种情况，先将回调收集起来，等实例中异步操作执行完后再执行
    this.cbs.push({onFulfilled,onRejected})
  }
  


 })

}

myPromise.prototype.catch = (reject) => {

}

const p = new myPromise((resolve,reject) => {
 
  // setTimeout(() => {
  //   resolve('success')
    // reject('fail')    
  // }, 1000);
  // resolve('successpromise')
  reject('fail')
})

p.then((res) => {
  console.log(res,'thenres')
  return res
  // return new myPromise((resolve,reject) => {
  //   reject('successpromise2222222')
  // })
},(err) => {
  console.log(err,'thenerr')
}).then(res => {
  console.log(res,'res2');
})



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


 

