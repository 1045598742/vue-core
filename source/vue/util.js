 const defaultRe = /\{\{((?:.|\r?\n)+?)\}\}/g;
 export const util = {
      getVal(vm,expr){
          let keys  = expr.split('.');
       return   keys.reduce((memo,current)=>{
            memo = memo[current];
            return memo;
          },vm)
      },
      compilerText(node,vm){
        if(!node.expr){
          node.expr = node.textContent;//给节点增加一个自定义属性 为了方便后续的更新
        }
        node.textContent = node.expr.replace(defaultRe,function (...args) { 
          return util.getVal(vm,args[1])
         })
      },
  }

  export function compiler(node,vm) { 
      let childNodes = node.childNodes;
      [...childNodes].forEach(child=>{
          if(child.nodeType == 1){//1.元素  3.文本
            compiler(child,vm)
          }else if(child.nodeType == 3){
            util.compilerText(child,vm)
          }
      })
   }