let id = 0; //每次产生一个watcher 都要有一个唯一的标识
import {pushTarget,popTarget} from './dep'
import {nextTick} from './nextTick'
import { util } from '../util';


class Watcher {

      /**  
        * @param {*} vm 当前组件的实例 new Vue 
        * @param {*} exprOrFn 用户可能传入一个表达式 也可能传入一个函数
        * @param {*} cb 用户传入的回到函数 vm.$watch('msg',cb)
        * @param {*} opts  一些其他参数
        */

    constructor(vm , exprOrFn , cb=()=>{} ,opts={}){
        this.vm = vm;
        this.exprOrFn = exprOrFn;
        if(typeof exprOrFn == 'function'){
            this.getter = exprOrFn;//getter就是new watcher传入的第二个参数
        }else{
            this.getter = function () { 
                return util.getVal(vm,exprOrFn)
             }
        }
        if(opts.user){//标记是用户自己写的watcher
            this.user = true;
        }
        this.lazy = opts.lazy;//如果这个值为true 说明他是计算属性
        this.dirty = this.lazy;
        this.cb = cb;
        this.opts = opts;
        this.deps = [];
        this.id = id++;
        this.immediate = opts.immediate;
        this.depsId = new Set();

        //默认创建一个watcher  会调用自身的get方法
        //如果当前我们是计算属性的话 不会默认调用get方法
        this.value = this.lazy ? undefined :this.get();//默认创建一个watcher 会调用自身的get方法
        if(this.immediate){
            this.cb(this.value)
        }
    }
    get(){
        pushTarget(this);//渲染watch Dep.target = watcher  msg变化了 需要让这个watcher重新执行
        let value =this.getter.call(this.vm);//让这个当前传入的函数执行
        popTarget();
        return value;
    }
    
    evaluate(){
       this.value = this.get();
        this.dirty = false;
    }

    addDep(dep){//同一个watcher 不应该重复记录dep
        let id = dep.id;//msg的id
        if(!this.depsId.has(id)){
            this.depsId.add(id)
            this.deps.push(dep);//就让watcher 记住了当前的dep
            dep.addSub(this);
        }

    }

    depend(){
        let i =this.deps.length;
        while(i--){
            this.deps[i].depend()
        }
    }

    update () {//如果立即调用get 会导致页面刷新，应该使用异步来更新
        if(this.lazy){//如果是计算属性
            this.dirty = true;
        }else{
            // this.get()
            queueWatcher(this)
        }
    }

    run(){
        let value = this.get();//新值
        if(this.value !== value){
            this.cb(value,this.value)
        }
    }

}

let has = {};
let queue = [];
function flushQueue() { 
    //等待当前这一轮全部更新后 再去让watcher 依次执行
    queue.forEach(watcher=>{
        watcher.run();
        has = {};//恢复正常  下一轮更新时继续使用
        queue = [];
    })
 }

function queueWatcher(watcher) {//对重复的watcher进行过滤操作
    let id = watcher.id;
    if(has[id]==null){
        has[id] = true;
        queue.push(watcher);//相同的watcher只会存到一个queue中
   
        //延迟清空队列
        // setTimeout(flushQueue,0)
        nextTick(flushQueue)

    }
}


//vue2.0是组件级别更新, 一个组件定义了一个watcher

//vue的特点就是批量更新 防止重复渲染

//渲染使用它  计算属性使用它 vm.watcher使用它
export default Watcher;