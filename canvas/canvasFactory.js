function randomColor(){
  let color = '#';
  for(let i=0;i<6;i++){
    color += parseInt(16*Math.random() + 1).toString(16);
  }
  return color;
}


var canvasFactory = function(canvas){
  this.canvas = canvas;
  this.context = context;
  this.width = canvas.width || 0;
  this.height = canvas.height || 0;
  this.imgData = '';
  this.activeShap = '';       //活跃的图形 【选中 或者hover 】
  this.selectRect = rect ? new rect() : '';  //画图用的选择矩形
  this.rectList = [];
  this.polygonList = [];
  this.circleList = [];
  this.circleGuideList = [];
  this.rectInfo = {
    x1:0,
    x2:0,
    y1:0,
    y2:0,
  }
}

canvasFactory.prototype = {
  getBoundingClientRect: function(){
    return this.canvas.getBoundingClientRect();
  },

  getLocation: function(x,y){
    let loc = this.canvas.getBoundingClientRect();
    return {
      x:x - loc.left,
      y:y - loc.top
    }
  },

  setRectStartPoint: function(x,y,notWindow){
    var temp = '';
    if(! notWindow){
      temp = this.getLocation(x,y);
      this.rectInfo.x1 = temp.x;
      this.rectInfo.y1 = temp.y;
    }else{
      this.rectInfo.x1 = x;
      this.rectInfo.y1 = y;
    }
  },

  setRectEndPoint: function(x,y,notWindow){
    var temp = '';
    if(! notWindow){
      temp = this.getLocation(x,y);
      this.rectInfo.x2 = temp.x;
      this.rectInfo.y2 = temp.y;
    }else{
      this.rectInfo.x2 = x;
      this.rectInfo.y2 = y;
    }
  },

  getBoundingRect: function(){
    let rectInfo = this.rectInfo,
      left = rectInfo.x2 > rectInfo.x1 ? rectInfo.x1 :rectInfo.x2,
      top = rectInfo.y2 > rectInfo.y1 ? rectInfo.y1 :rectInfo.y2,
      width = Math.abs(rectInfo.x2 - rectInfo.x1),
      height = Math.abs(rectInfo.y2 - rectInfo.y1);

    return {
      width:width,
      height :height,
      left :left,
      top :top,
      right: left + width,
      bottom: top + height,
      centerX: left + width /2,
      centerY: top + height /2,
      radius: width > height ?  height / 2 : width /2
    }
  },

  //save
  save: function(){
    this.context.save();
  },
  restore: function(){
    this.context.restore();
  },


  //保存当前图像
  saveImg: function(){
    this.imgData = this.context.getImageData(0,0,this.width,this.height);
  },
  //还原当前图像
  restoreImg: function(){
    this.context.putImageData(this.imgData,0,0);
  },

  clearInfo: function(){
    var r = this.rectInfo;
    for(var k in r){
      r[k] = '';
    }
  },
  //清空画布
  clear: function () {
    this.context.clearRect(0,0,this.width,this.height);
  },

  //绘制图形  ----------------------
  //绘制矩形方框
  drawAll: function(){
    this.circleList.forEach(function(shap){
      shap.fill(this.context);
    })
  },
  drawSelectRect: function(){
    let b = this.getBoundingRect();
    this.selectRect.reSet({
      x:b.left,
      y:b.top,
      width:b.width,
      height:b.height,
    })
    this.selectRect.stroke(this.context,'dash');
  },

  drawPolygon: function(notSave){
    let b = this.getBoundingRect(),
      r = b.radius,
      p = new polygon(b.centerX,b.centerY, b.radius , 6 , Math.PI / 2);

    if(!notSave) this.polygonList.push(p);
    p.stroke(this.context,'dash');
    this.clearInfo();
  },

  //绘制圆形
  drawCircle: function(notSave){
    let b = this.getBoundingRect(),
      x = b.centerX,
      y = b.centerY,
      r = b.radius,
      c = new circle(x,y,r);


    if(!notSave) this.circleList.push(c);
    this.context.beginPath();
    c.fillStyle(randomColor());
    c.fill(this.context);
    console.log(c);
    this.clearInfo();
  },

  //绘制准绳
  drawCircleGuideWire: function(count,length){
    var b = this.getBoundingRect(),
      x = b.centerX,
      y = b.centerY,
      r = b.radius,
      _count = count || 10,
      _length = length || 10,
      _step = 2 * Math.PI / _count,
      _arc = 0,
      _startX = 0,    //圆边的X,Y
      _startY = 0,
      _endX = 0,      //圆的刻度 X,y
      _endY = 0;

    this.context.beginPath();
    while(_arc <= 2 * Math.PI){
      _startX = x + Math.sin(_arc) * r;
      _startY = y + Math.cos(_arc) * r;
      _endX = x + Math.sin(_arc) * (r - _length);
      _endY = y + Math.cos(_arc) * (r - _length);

      _arc += _step;
      this.context.moveTo(_startX,_startY);
      this.context.lineTo(_endX,_endY);
    }
    this.context.stroke();
  },

  //操作图形 ----------------------------------
  //查找那个图形被鼠标 hover
  findHover(x,y){
    var loc = this.getLocation(x,y),
      shap = '';

    this.activeShap = '';
    for(var i=0,len = this.circleList.length; i < len;i++){
      shap = this.circleList[i]
      shap.createPath(this.context);
      if(this.context.isPointInPath(loc.x,loc.y)){
        //如果point 在图形上，则将其置尾
        this.circleList.toTail(i);
        this.activeShap = shap ;
        return ;
      }
    }
  },

  moveShap(){
    var r = this.rectInfo,
      x1 = r.x1,
      x2 = r.x2,
      y1 = r.y1,
      y2 = r.y2,
      offx = x2 - x1,
      offy = y2 - y1;

    if(this.activeShap){
      this.setRectStartPoint(x2,y2,true);
      // console.log('active shap: ',this.activeShap);
      this.activeShap.move(offx , offy);
      this.clear();
      this.drawAll();
    }

  }
}



