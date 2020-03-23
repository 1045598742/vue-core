import Observer from "./Observer";
import Watcher from "./watcher";
import Dep from "./dep";

export function initState(vm) { 
    
    //做不同的初始化功能
    let opts = vm.$options;
    if(opts.data){
        initData(vm);//初始化数据
    }
    if(opts.computed){
      
        initComptued(vm,opts.computed);//初始化计算属性
    }
    if(opts.watch){
        initWatch(vm);//初始化watch
    }
}

export function observe(data) { 
    if(typeof data != 'object' || data == null){
       
        return; //不是对象或者是null 不用继续执行了
    }

    if(data.__ob__){//已经被监测过了
        return data.__ob__;
    }
    return new Observer(data)
 }

function proxy(vm,source,key){//代理数据的函数
    Object.defineProperty(vm,key,{
        get(){
            return vm[source][key]
        },
        set(newValue){
            vm[source][key] = newValue;
        }
    })
}


function initData(vm){//将用户插入的数据  通过Object。def重新定义
    let data = vm.$options.data;
    data =vm._data = typeof data === 'function' ? data.call(vm) : data || {};

    for(let key in data){ //会将对vm的取值操作 和赋值操作代理给vm._data属性
        proxy(vm,'_data',key)
    }

    observe(data);//观察数据

}


function createComputedGetter(vm,key){
    let watcher = vm._watchersComputed[key];
    return function () { //用户取值时会执行此方法
        if(watcher){
            if(watcher.dirty){ //如果页面取值 ，而且 dirty是true 就会去调用watcher的get方法
                watcher.evaluate()
            }
            if(Dep.target){
                console.log(Dep.target,'-----');
                watcher.depend()
            }
            return watcher.value;
        }
     }
}

function initComptued(vm,computed){
    //将计算属性的配置放到 vm上
    let watchers = vm._watchersComputed= Object.create(null);//创建存储计算属性的watcher的对象
    for(let key in computed){
        let userDef = computed[key];
        //new Watcher此时什么都不会做  配置了lazy dirty
        watchers[key] = new Watcher(vm,userDef,()=>{},{lazy:true});//计算属性watcher  默认刚开始这个方法不会执行
        console.log(watchers[key]);
        Object.defineProperty(vm,key,{
            get: createComputedGetter(vm,key)
        })
    }
}

function createWatcher(vm,key,handler,opts) { 
    //内部最终也会使用$watch方法
    return vm.$watch(key,handler,opts);
 }

function initWatch(vm){
    let watch = vm.$options.watch;//获取用户传入的watch属性
    for(let key in watch){//

        let userDef = watch[key];
        let handler = userDef;
        if(userDef.handler){
            handler = userDef.handler
        }
        createWatcher(vm,key,handler,{immediate:userDef.immediate})
    }
}
