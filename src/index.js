const {
    reactive,
    effect
} = require('./reactivity.js')


const state = reactive({
    a: 1,
    b: 2
})

let c = 0
effect(() => {
    c = state.a + state.b
    console.log(c)
})


state.a = 2