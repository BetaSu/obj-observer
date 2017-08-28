export let OP = Object.prototype

// 类型监测
export  const typeInspect = data => {
  return OP.toString.call(data).slice(8, -1)
}

export const isObject = data => {
  return typeInspect(data) === 'Object'
}
