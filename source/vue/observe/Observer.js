import { observe } from "./index";
import {arrayMethods,observerArray,dependArray} from "./array";
import Dep from "./dep";

export function defineReactive( data,key,value ){
   let childOb =  observe(value);// 递归
   
    let dep = new Dep();//dep 里可以收集依赖  收集的是watcher
    Object.defineProperty(data,key,{
       
        get(){
            if(Dep.target){//这次有值用的是渲染 watcher
                dep.depend();//它想让dep 中可以存放watcher 还希望这个watcher中存放dep 实现1个对多个的关系
                // dep.addSub(Dep.target)
                if(childOb){
                    // debugger
                    childOb.dep.depend();//数组也收集了当前渲染的watcher
                    dependArray(value);//收集儿子的依赖
                }
            }
            return value
        },
        set(newValue){
            if(newValue != value){

                observe(newValue);//如果设置了一个对象，应该进行监控这个新增的对象
                value = newValue
                dep.notify()
            }   
        }
    })
}

class Observer {
    constructor(data){
        //data是我们刚才定义的vm._data
        //将用户的数据重新定义
       this.dep = new Dep();//此dep 专门为数组而设定

        //每个对象 包括数组都有一个__ob__属性 返回的是当前的Observer实例
        Object.defineProperty(data,'__ob__',{
            get:()=>this
        })

        if(Array.isArray(data)){//重写数组方法
            //只能拦截数组的方法，数组里的每一项 还需要去观测一下
            data.__proto__ = arrayMethods;
            // 当调用数组方法时 手动通知
            observerArray(data);
        }else{
            this.walk(data)
        } 
    }

    walk(data){
        // debugger;
        let keys = Object.keys(data);
        for(let i= 0 ;i<keys.length;i++){
            let key = keys[i];
            let value = data[ keys[i]];
            defineReactive(data,key,value)
        }
    }
}

export default Observer