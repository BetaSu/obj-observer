import Observer from './observer'

window.abc = {
  aa: 123,
  l1: {
    bb: 'i am bb',
    l2: {
      cc: 'i am cc'
    },
    ee: []
  },
  dd () {
    return 'i am dd'
  }
}

let abc_o = new Observer(abc, function (n, o) {
  console.log('new', n)
  console.log('old', o)
})
