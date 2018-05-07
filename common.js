Object.prototype.method = function(name,fn){
  if(!(fn instanceof Function)){
    console.warn('注意 ！ 与' + name + ' 对应的值不是函数。');
  }
  if(this[name] || this.prototype[name]){
    console.warn(name + ' 已经存在，请勿覆盖该属性/方法');
  }else{
    this.prototype[name] = fn;
  }
}

Object.prototype.addMethods = function(obj){
  for(var k in obj){
    this.method(k, obj[k]);
  }
}
console.log(Array)
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