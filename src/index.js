import Vue from 'Vue';//默认先查找source下的目录

let vm = new Vue({
    el:'#app',
    data () {
        return {
            // msg:"hello",
            school:{obj:{a:1}},
            // arr:[1,2,3,[1,2]],
            firstName:'feng',
            lastName:'zhu'
        }
    },
    computed: {
        fullName(){
            return this.firstName + this.lastName;
        }
    },
    watch: {
    //  msg:{
    //     handler(newValue,oldValue){
    //         console.log(newValue,oldValue);
    //     },
    //     immediate:true
    // }
    }
})
// vm.arr.push(9)
// console.log(vm);
//如果新增的属性也是对象类型 我们需要这个对象 也进行代理
// setTimeout(()=>{
//     vm.msg = '777';
//     vm.msg = '778';
//     vm.msg = '779';
// },2000)