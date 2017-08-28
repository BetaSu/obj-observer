/*
 * 更类似VUE源码结构的数据监测机制
 **/

import { isObject } from './util'

export const observer = data => {
  if (isObject(data)) {
    new Observer(data)
  }
}

class Observer {
  constructor (data) {
    this.walk(data)
  }

  walk (data) {
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }

  defineReactive (data, key, val) {
    let dep = new Dep()
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get () {
        dep.depend()
        return val
      },
      set (newVal) {
        if (val === newVal) {
          return
        }
        dep.notify()
        observer(newVal)
      }
    })
  }
}

class Dep {
  constructor () {
    this.subs = []
  }

  addSub () {
    this.subs.push(Dep.target)
  }

  depend () {
    this.addSub()
  }

  notify () {
    this.subs.forEach(sub => {
      sub.fn()
    })
  }
}
Dep.target = null
Dep.pushTarget = watch => {
  Dep.target = watch
}

class Watch {
  constructor (exp, fn) {
    this.exp = exp
    this.fn = fn
    Dep.pushTarget(this)
    data[exp]
  }
}

export let data = {
  a: 1,
  b: 2,
  c: {
    c1: 3,
    c2: ['a', 'b', 'c']
  }
}

observer(data)

new Watch('a', n => {
  console.log('a is change', n)
})