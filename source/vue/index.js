import { initState } from "./observe";
import Watcher from "./observe/watcher";
import { util,compiler } from "./util";

function Vue(options) {
    this._init(options)//初始化
 }

 Vue.prototype._init = function(options){
     //vue中的初始化  this.options 表示的是Vue中的参数
     let vm = this;
     vm.$options = options;

     //MVVM原理 需要数据重新初始化
     //拦截数组的方法 和对象的属性
     initState(vm);//data computed watch

     if(vm.$options.el){
         vm.$mount()
     }
 }


 function query(el) {
    
    if(typeof el ==='string'){
        return document.querySelector(el);
    }
    return el;
  }

// ？:匹配不捕获
// +匹配不捕获
// ？非贪婪匹配
  

  Vue.prototype._update = function () { 
    console.log('更新操作');
      //用用户传入的数据 去更新视图
      let vm  = this;
      let el = vm.$el;
      //要循环这个元素 将里面的内容  换成我们的数据
      let node = document.createDocumentFragment();
      let firstChild;
      while(firstChild = el.firstChild){//每次拿到第一个元素
        node.appendChild(firstChild);//具有移动功能
      }
      compiler(node,vm)
      el.appendChild(node)
      //需要匹配{{}}的方式来进行替换
      //依赖手机 属性变化了 需要重新渲染  watcher 和 dep
   }

 Vue.prototype.$mount = function () { 
     let vm = this;
     let el = vm.$options.el;
     el = vm.$el = query(el);//获取当前元素

     //渲染时通过watcher来渲染
     //渲染watcher 用于渲染的watcher
     //ve2.0 组件级更新


     let updateComponent = ()=>{//更新组件 渲染的逻辑
        vm._update();//更新组件
     }

     new Watcher(vm,updateComponent);//渲染watcher，默认会调用updateComponent这个方法
     //我需要让每个数据  它更改了  需要重新的渲染
  }

  Vue.prototype.$watch = function (expr,handler,opts) { 
      //创建一个watcher
      let vm = this;
      new Watcher(vm,expr,handler,{user:true,...opts});//用户自己定义的watch
   }

 export default Vue