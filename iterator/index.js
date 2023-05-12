// JS迭代器协议
    // 1、必须有next方法,next可以有一个参数或无参数的函数,返回一个对象，对象有两个属性，value和done
    // 2、必须有iterator方法

    const arr = ['123','456','789']

    let i = 0
    const arrIterator = {
      // 当可迭代对象迭代完成时，done为true，否则为false
      // done: Boolean,
      // value: undefined/具体的值
      next: () => {
        if(i < arr.length) {
          return {
            value: arr[i++],
            done: false
          }
        } else {
          return {
            done: true
          }
        }
      }
    }
console.log(arrIterator.next());
console.log(arrIterator.next());
console.log(arrIterator.next());

    // 可迭代对象内部必须有一个[Symbol.iterator]方法，该方法返回一个迭代器对象
    const infos = {
      names: ['张三','李四','王五'],
        // name1: '张三',
        // name2: '李四',
        // name3: '王五',
      
      [Symbol.iterator]: function () {
        // const keys = Object.keys(this)
        // const values = Object.values(this)
        // const entries = Object.entries(this)
        let i = 0
        const arrIterator = {
          next: () => {
            if(i < this.names.length) {
              return {
                value: this.names[i++],
                done: false
              }
            } else {
              return {
                done: true
              }
            }
          },
          // return方法能够监听迭代器中断
          return:() => {
            console.log('中断');
            return {done: true}


          }

        }
        return arrIterator
      }
    }
    // console.log(infos[Symbol.iterator]().next());
    // console.log(infos[Symbol.iterator]().next());
    // console.log(infos[Symbol.iterator]().next());
    // console.log(infos[Symbol.iterator]().next());

    for (const iterator of infos) {
      if(iterator === '李四') {
        break 
      }
        console.log(iterator);
    }


    // 可迭代对象 String Array Set Map  arguments NodeList
    const isArys = ['x','d','c','w']
    const iteratorFn = isArys[Symbol.iterator]()
    console.log(isArys[Symbol.iterator]());
    console.log(iteratorFn.next());
    console.log(iteratorFn.next());
    console.log(iteratorFn.next());
    console.log(iteratorFn.next());


    console.log('------------------------');


    // 使用生成器函数替代迭代器
    const info = {
      names: ['张三','李四','王五'],
      nameObj:{
        name1: '张三123',
        name2: '李四123',
        name3: '王五123',
      },
      
      [Symbol.iterator]: function* () {
        yield* this.names
        yield* Object.values(this.nameObj)
        yield* Object.keys(this.nameObj)
        yield* Object.entries(this.nameObj)
      }
    }

    for (const iterator of info) {
      console.log(iterator);
    }
