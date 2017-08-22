let OP = Object.prototype

const inspect = data => {
  return OP.toString.call(data).slice(8, -1)
}

// array method which need proxy
const AMP = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']


/*
 * class 转换对象为可监听对象
 * @param obj 要转换的对象
 * @param callback 监听到变化后的回调函数
 **/
class Observer {
  constructor (obj, callback) {
    if (inspect(obj) !== 'Object') {
      console.error('当前参数必须是对象:', obj)
    }
    this.$callback = callback
    this.observe(obj)
  }
  /*
   * func 用于讲对象转换为可检测对象
   * @param obj 传入的对象
   * @param path 对象的路径，用来定位究竟是谁发生了变化
   * @return
   **/
  observe (obj, path) {
    Object.keys(obj).forEach(key => {
      let oldVal = obj[key]
      // 检测到是数组，调用代理方法以触发检测
      if (inspect(oldVal) === 'Array') {
        return this.arrayMethodsProxy(oldVal, path)
      }

      // 遍历设置 getter setter
      Object.defineProperty(obj, key, {
        get () {
          return oldVal
        },
        set: (newVal => {
          if (oldVal !== newVal) {
            this.observe(newVal)
          }
          this.$callback(newVal, oldVal)
          oldVal = newVal
        }).bind(this)
      })
      // 递归遍历子对象
      if (inspect(oldVal) === 'Object') {
        this.observe(oldVal)
      }
    }, this)
  }

  arrayMethodsProxy (array) {
    let _origin = Array.prototype,
        _proxy = Object.create(_origin),
        that = this
    AMP.forEach(method => {
      let oldArr = []
      console.log('define!')
      Object.defineProperty(_proxy, method, {
        value () {
          oldArr = this.slice(0)
          let args = [].slice.apply(arguments)
          let result = _origin[method].apply(this, args)
          that.observe(this)
          that.$callback(this, oldArr)
          return result
        },
        writable: true,
        enumerable: false,
        configurable: true
      })
    })
    array.__proto__ = _proxy
  }
}

export default Observer