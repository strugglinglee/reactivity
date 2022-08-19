const {
    reactive,
    effect
} = require('./reactivity.js')


const state = reactive({
    a: 1,
    b: 2,
    e: {
        f: 1
    }
})

let c = 0
// debugger
// effect(() => {
//     c = state.a + state.b
//     console.log(c)
// })
// state.a = 2
// 多层响应
effect(() => {
    c = state.e.f
    console.log(c)
})
state.e.f = 2