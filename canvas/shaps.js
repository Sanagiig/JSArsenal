'use strict'

var Point = function (x, y) {
  this.x = x;
  this.y = y;
};

var extend = function(parent,child){
  var  f = new Function();
  f.prototype = parent.prototype;
  child.prototype = new f();
}


//图形基本类
var shap = function (x, y,strokeStyle, fillStyle, filled,context){
  this.x = x;
  this.y = y;
  this.strokeSty = strokeStyle;
  this.fillSty = fillStyle;
  this.filled = filled;
  this.context = context;
}

shap.prototype = {
  move:function(offx,offy){
    this.x += offx;
    this.y += offy;
  },
  reSet:function(obj){
    for(var k in obj){
      if(! (this[k] instanceof Function)){
        this[k] = obj[k];
      }
    }
  },
  getLoc: function(){
    return {
      x:this.x,
      y:this.y,
    }
  },
  context:function(c){
    if(c){
      this.context = c;
    }else{
      return this.context;
    }
  },
  strokeStyle:function(s){
    if(s){
      this.strokeSty = s;
    }else{
      return this.strokeSty;
    }
  },
  createPath:function(){

  },
  fillStyle:function(s){
    if(s){
      this.fillSty = s;
    }else{
      return this.fillSty;
    }
  },
  fillStatus:function(s){
    if(s){
      this.filled = s;
    }else{
      return this.filled;
    }
  },
  stroke:function(context,type){
    context.save();
    if(type === 'dash'){
      context.setLineDash(this.lineDash || [20,5]);
    }
    this.createPath(context,type);
    context.strokeStyle = this.strokeStyle();
    context.stroke();
    context.restore();
  },
  fill:function(context,type){
    context.save();
    this.createPath(context,type);
    context.fillStyle = this.fillStyle();
    context.fill();
    context.restore();
  },

}


//矩形
window.rect = function(x, y,width,height,strokeStyle, fillStyle, filled){
  this.lineDash = [20,5];
  this.width = width;
  this.height = height;
  shap.call(this,x,y,strokeStyle, fillStyle, filled);
}

extend(shap,rect);
Object.assign(rect.prototype,{
  getBounding:function(){
    return {
      left:this.x,
      top:this.y,
      width:this.width,
      height:this.height,
      right:this.x + this.width,
      bottom:this.y + this.height,
    }
  },
  createPath: function (context,type) {
    var l = this.getBounding();

    context.beginPath();
    if(type === 'dash'){
      context.setLineDash(this.lineDash);
    }
    context.moveTo(l.left,l.top)
    context.lineTo(l.right,l.top);
    context.lineTo(l.right,l.bottom);
    context.lineTo(l.left,l.bottom);
    context.lineTo(l.left,l.top);
    context.closePath();

  },


})


//多边形
window.polygon = function (centerX, centerY, radius, sides, startAngle, strokeStyle, fillStyle, filled) {
  this.lineDash = [20,5];
  this.radius = radius;
  this.sides = sides;
  this.startAngle = startAngle;
  shap.call(this,centerX,centerY,strokeStyle, fillStyle, filled);
};
extend(shap,polygon)
Object.assign(polygon.prototype,{
  getPoints: function () {
    var points = [],
      angle = this.startAngle || 0;

    for (var i=0; i < this.sides; ++i) {
      points.push(new Point(this.x + this.radius * Math.cos(angle),
        this.y + this.radius * Math.sin(angle)));
      angle += 2*Math.PI/this.sides;
    }
    return points;
  },

  createPath: function (context,type) {
    var points = this.getPoints();


    context.beginPath();

    if(type === 'dash'){context.setLineDash(this.lineDash);}
    context.moveTo(points[0].x, points[0].y);

    for (var i=1; i < this.sides; ++i) {
      context.lineTo(points[i].x, points[i].y);
    }
    context.closePath();
  }
})

//圆形
window.circle = function(centerX, centerY, radius, strokeStyle, fillStyle, filled){
  this.dashLine = [20,5];
  this.radius = radius;
  shap.call(this,centerX, centerY,strokeStyle, fillStyle, filled)
}
extend(shap,circle)
Object.assign(circle.prototype,{
  getRadian: function(arcLen){
    var perimeter = 2 * this.radius * Math.PI,
      radian =  arcLen / perimeter * 2 * Math.PI;

    return  radian;
  },
  createPath(context,type){
    var x = this.x,
      y = this.y,
      r = this.radius;

    context.beginPath();
    if(type === 'dash'){
      var radian = 0,i=0,
        lineRadian = this.getRadian(this.dashLine[0]), //获取线条和空白的弧度
        sapceRadian = this.getRadian(this.dashLine[1]);

      while(radian < 2 * Math.PI){
        //双数为线条
        if(i % 2 === 0){
          context.arc(x,y,r,radian , radian + lineRadian );
          radian += lineRadian;
        }else{
          context.save();
          context.strokeStyle = 'rgba(0,0,0,0)';
          context.arc(x,y,r,radian , radian + sapceRadian );
          context.restore();
          radian += sapceRadian;
        }
      }

    }else{
      context.arc(x,y,r,0, 2 * Math.PI);
    }
  }
})
