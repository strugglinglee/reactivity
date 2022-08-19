const targetMap = new WeakMap();

// 存储正在执行的副作用
let activeEffect = null; // 引入 activeEffect 变量

const effect = eff => {
    // 1. 将副作用赋值给 activeEffect
    activeEffect = eff;
    // 2. 执行 activeEffect
    activeEffect();
    // 3. 重置 activeEffect
    activeEffect = null;
}

const track = (target, key) => {
    if (!activeEffect) return
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()));
    }
    let dep = depsMap.get(key);
    if (!dep) {
        depsMap.set(key, (dep = new Set()));
    }
    // 添加 activeEffect 依赖
    dep.add(activeEffect);
}

const trigger = (target, key) => {
    const depsMap = targetMap.get(target);
    if (!depsMap) return;
    let dep = depsMap.get(key);
    if (dep) {
        dep.forEach(effect => effect());
    }
};

const isObject = (val) => {
    return val !== null && typeof val === "object";
};

const reactive = (target) => {
    const handler = {
        get(target, key, receiver) {
            const result = Reflect.get(target, key, receiver);
            // 收集依赖对应的副作用
            track(target, key);
            /**
             * 因为proxy只能代理一层，所以
             * 如果属性值对应的依旧是一个对象，那需要把这个对象也包装为一个响应式对象
             */
            if (isObject(result)) return reactive(result);
            return result;
        },
        set(target, key, value, receiver) {
            const oldValue = target[key];
            const result = Reflect.set(target, key, value, receiver);
            if (oldValue != result) {
                // 触发依赖对应副作用
                trigger(target, key);
            }
            return result;
        }
    }

    return new Proxy(target, handler);
}

module.exports = {
    reactive,
    effect
}