import { observe } from "./index";

//主要是要做的事就是拦截用户调用的push shift unshift pop reversr sort splice
//重写改变原数组的那些方法


///先获取老的数组方法  只改写这些7个方法
let oldArrayProtoMethods = Array.prototype;

//拷贝的一个新对象 可以查找到老的方法
export let arrayMethods = Object.create(oldArrayProtoMethods);


let methods = [
    'push', 'shift', 'unshift', 'pop', 'reserve', 'sort', 'splice',
]

export function observerArray(inserted) {

    for(let i =0;i<inserted.length;i++){
        observe(inserted[i])
    }
}

export function dependArray(inserted) { 
    for(let i =0;i<inserted.length;i++){
        let currentItem = inserted[i];//有可能也是一个数组
        currentItem.__ob__ && currentItem.__ob__.dep.depend();
        if(Array.isArray(currentItem)){
            dependArray(currentItem) ;//递归收集数组依赖关系
        }
    }
 }

methods.forEach(method=>{
    arrayMethods[method] = function (...args) {//函数劫持 
       let result = oldArrayProtoMethods[method].apply(this,args);
        let inserted;
       switch(method){
           case 'push' :
           case 'unshift' : 
            inserted = args;
           break;
           case 'splice':
               inserted = args.slice(2)
           default: break;

       }
       if(inserted) observerArray(inserted);
       this.__ob__.dep.notify()
       return result;
     }
})

