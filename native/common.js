/**
	改写原生js 底层
*/

Object.prototype.method = function(name,fn){
  if(!(fn instanceof Function)){
    console.warn('注意 ！ 与' + name + ' 对应的值不是函数。');
  }

  if(this[name] || this.prototype[name]){
    console.warn(name + ' 已经存在，请勿覆盖该属性或方法');
  }else{
    this.prototype[name] = fn;
  }
}

Object.prototype.addMethods = function(o){
  console.log(o);
  for(var k in o){
    console.log(k)
    this.method(k, o[k]);
  }
}

Object.defineProperty(Object.prototype,'method',{
  enumerable:false
})
Object.defineProperty(Object.prototype,'addMethods',{
  enumerable:false
})

Array.addMethods({
  //将某个数组成员置顶，并且其他成员后退一位
  toHead:function(index){
    if(index<this.length){
      var top = this[index];
      for(var i=index - 1;i>=0;i--){
        this[i+1] = this[i];
      }
      this[0] = top;
    }
  },

  toTail:function(index){
    if(index<this.length){
      var tail = this[index];
      for(var i=index,len=this.length-1; i<len; i++){
        this[i] = this[i+1];
      }
      this[len-1] = tail;
    }
  }

})