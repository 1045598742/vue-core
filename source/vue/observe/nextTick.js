let callbacks = [];

function flushCallbacks() { 
    callbacks.forEach(cb=>cb())
 }
export function nextTick(cb) {
    callbacks.push(cb);

    // 要异步刷新这个callback, 获取一个异步方法
    //先采用微任务 会先执行（ 微任务 promise  mutationObserver）  setImmediate setTimeout
    let timeFunc = ()=>{
        flushCallbacks()
    }
    if(Promise){
        return Promise.resolve().then(timeFunc)
    }

    if(MutationObserver){
        let observe = new MutationObserver(timeFunc);
        let textNode  = document.createTextNode(1);
        observe.observe(textNode,{characterData:true})
        textNode.textContent = 2;
        // return Promise.resolve().then(timeFunc)
    }

    if(setImmediate){//ie和高版本支持
       return setImmediate(timeFunc);
    }

    setTimeout(()=>{
        timeFunc()
    },0)

}