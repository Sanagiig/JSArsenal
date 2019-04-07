function localSave(key,value){
  if(arguments.length == 1){
    return JSON.parse(localStorage.getItem(key));
  }else if(arguments.length == 2){
    localStorage.setItem(key,JSON.stringify(value));
  }
}

// 生成英文字母
function charFactor(isUplower) {
  var start = isUplower ? 65 : 97;
  return String.fromCharCode(parseInt(Math.random() * 26) + start);
}

// 生成单词（首字母大写）
function strFactor(min, max) {
  min = min || 5;
  max = max || 15;
  var num = min + parseInt(Math.random() * max);
  var result = "";
  for (var i = 0; i < num; i++) {
    if (i === 0) {
      result += charFactor(true);
    } else {
      result += charFactor();
    }
  }
  return result;
}

// 生成文章
function articleFactor(wordNum) {
  wordNum = wordNum || 100;
  var article = "";
  for (var i = 0; i < wordNum; i++) {
    article += strFactor() + "  ";
  }
  return {
    title: strFactor(),
    type: "system",
    article
  };
}

//时间戳转 201803032305 格式 或自定义年月的分隔符
function transCommDate(ts,s){
  var D , y,M,d,H,m,time;

  function format(n){
    if(n <10){
      return "0" + n;
    }
    return n;
  }
  s = s || "";
  D = new Date(ts);
  y = D.getFullYear();
  M = format(D.getMonth() + 1);
  d = format(D.getDate());
  H = format(D.getHours());
  m = format(D.getMinutes());
  time = y + s + M + s + d + s + H + s + m;
  return time;
}

//时间戳转中文时间
function transChineseDate(ts){
  var D,y,M,d,h,m,s,time;

  function format(n){
    if(n <10){
      return "0" + n;
    }
    return n;
  }

  D = new Date(ts);
  y = D.getFullYear() + "年";
  M = D.getMonth()  + 1 + "月";
  d = D.getDate() + "日 ";
  h = format(D.getHours()) + ":";
  m = format(D.getMinutes()) +":";
  s = format(D.getSeconds());
  time = y + M + d + h + m + s;
  return time;
}

//获取当前年月日
function getDateTime(){
  let d = new Date();

  function format(n){
    if(n <10){
      return "0" + n;
    }
    return n;
  }

  return d.getFullYear()  + '-' + format(d.getMonth() + 1) + '-' + d.getDate();
}
//剔除空值
function objFilter(obj){
  let newObj = {};
  for(let k in obj){
    let v = obj[k];
    if((typeof v === 'string' && v.trim() !=='') || (typeof v === 'number' && v >= 0) || (v instanceof Array && v.length >0)){
      newObj[k] = v;
    }
  }
  return newObj;
}

//随机颜色
function randomColor(){
  var colorStr="";
  //字符串的每一字符的范围
  var randomArr=['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
  //产生一个六位的字符串
  for(var i=0;i<6;i++){
    //15是范围上限，0是范围下限，两个函数保证产生出来的随机数是整数
    colorStr+=randomArr[Math.ceil(Math.random()*(15-0)+0)];
  }
  return "#"+colorStr;
}

//转换css key
function transCssKey(key){
  return key.replace(/_/g,"-")
}

//转换css value
function tranCssValue(v){
  if(typeof v == "string"){
    v = parseFloat(v.replace("/\%|px|em/g",""))
  }
  return v
}

//判断数组对象[{}] 的key 值是否存在
function checkObjValue(list,key,value){
  for(var i=0;i<list.length;i++){
    if(list[i][key] == value) return true;
  }
  return false;
}

//判断mac 是否合法
function checkMac(text){
  var pattern = /[0-9a-fA-F]{2}\:[0-9a-fA-F]{2}\:[0-9a-fA-F]{2}\:[0-9a-fA-F]{2}\:[0-9a-fA-F]{2}\:[0-9a-fA-F]{2}/
  return pattern.test(text)
}
//判断email是否合法
function checkEmail(text){
  var pattern = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
    res = pattern.test(text)
  return res
}

//判断手机号码是否合法
function checkPhoneNum(text){
  var pattern = /[^0-9]/;
  if(pattern.test(text))
    return "手机号码只能是数字哟~"

  if(!text || text.split("").length != 11)
    return "手机号码必须是11位的数字哟~"

  return 0;
}

//获取对象的值
//list 为数组，key 为需要去除的key ， type 为最终获取的值的类型
function getObjValue(list,key,type){

  var result = [];
  for(var i =0;i<list.length;i++){
    //如果key 是数组，则返回多个对象【数组形式】
    if(typeof key != "string"){
      var obj = {};
      //取出每个key 列表的值，并且付给 obj[key]
      for(var j=0;j<key.length;j++){
        obj[key[j]] = list[i][key[j]];
      }
      result.push(obj);
    }else{
      var v = list[i][key]
      if(type == "int")
        v = parseInt(v);

      result.push(v)
    }
  }
  return result;
}

export {
  localSave,
  getDateTime,
  transCommDate,
  objFilter,
  checkMac,
  transChineseDate
}