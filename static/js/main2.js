function open_page() {
    startTime();
    add_close();
}

function openNav() {
    document.getElementById("mySidenav").style.width = "80px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}
function OpenOrClose() {
    state = document.getElementById("mySidenav").style.width;
    if (state === "80px"){
        closeNav()
    }
    else{
        openNav()
    }
}

//将todo数据添加到数据库中
function save_todo(){
  $.ajax({
      type:"post",
      url:"/save_todo/",
      cache:false ,
      data:{
        'todo':$("#myInput").val(),
      },
      dataType: "text",
      success: function() {
        //console.log("over..");
        //alert(data);  //就将返回的数据显示出来
        //window.location.href="跳转页面"
      },
        });
}


//将todo数据添加到数据库中
function save_memo(){
  $.ajax({
      type:"post",
      url:"/save_memo/",
      cache:false,
      data:{
        'memo':$("#memo").val(),
      },
      dataType: "text",
      success: function() {
        //console.log("over..");
        //alert(data);  //就将返回的数据显示出来
        //window.location.href="跳转页面"
      },
        });
}

// Create a "close" button and append it to each list item
var container = document.getElementById("myUL");
var myNodelist = container.getElementsByTagName("LI");
var i;
for (i = 0; i < myNodelist.length; i++) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  myNodelist[i].appendChild(span);
}

// Click on a close button to hide the current list item
function add_close() {
    var close = document.getElementsByClassName("close");
    var i;
    for (i = 0; i < close.length; i++) {
    (function(i){
      close[i].onclick = function()
      {
        this.parentElement.style.display = "none";
        console.log(i)
        save_hide_todo(i)
        };
    }(i));
}
}

// 当点击”新增“按钮时，增加新的元素，并保存在数据库中
function newElement() {
    var li = document.createElement("li");
    var inputValue = document.getElementById("myInput").value;
    var t = document.createTextNode(inputValue);
    li.appendChild(t);
    if (inputValue === '') {
        alert("你还木有添加To Do...");
    } else {
        document.getElementById("myUL").appendChild(li);//将新添加的list加入到后续的队列中
        save_todo();  //调用数据库保存函数
    }
    document.getElementById("myInput").value = ""; //将input框置空，以便下次输入
  var span = document.createElement("SPAN"); //创建新的span标签
  var txt = document.createTextNode("\u00D7");//创建X号
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);
  add_close()
}


//用户点击X号，设置完成状态
function save_hide_todo(id) {
    $.ajax({
      type:"post",
      url:"/save_hide_todo/",
      cache:false,
      data:{
          'id':id,
      },
      success: function(data) {
        //console.log("over..");
        //alert(data);  //就将返回的数据显示出来
        //window.location.href="跳转页面"
      },
      error: function(data) {
        //console.log(data);
       // alert("Connection error");
        }
        });
}


function startTime()
{
    var today=new Date();//定义日期对象
    var yyyy = today.getFullYear();//通过日期对象的getFullYear()方法返回年
    var MM = today.getMonth()+1;//通过日期对象的getMonth()方法返回年
    var dd = today.getDate();//通过日期对象的getDate()方法返回年
    var hh=today.getHours();//通过日期对象的getHours方法返回小时
    var mm=today.getMinutes();//通过日期对象的getMinutes方法返回分钟
    var ss=today.getSeconds();//通过日期对象的getSeconds方法返回秒
    // 如果分钟或小时的值小于10，则在其值前加0，比如如果时间是下午3点20分9秒的话，则显示15：20：09
    MM=checkTime(MM);
    dd=checkTime(dd);
    mm=checkTime(mm);
    ss=checkTime(ss);
    var day; //用于保存星期（getDay()方法得到星期编号）
    if(today.getDay()==0)   day   =   "星期日 "
    if(today.getDay()==1)   day   =   "星期一 "
    if(today.getDay()==2)   day   =   "星期二 "
    if(today.getDay()==3)   day   =   "星期三 "
    if(today.getDay()==4)   day   =   "星期四 "
    if(today.getDay()==5)   day   =   "星期五 "
    if(today.getDay()==6)   day   =   "星期六 "
    document.getElementById('clock_date').innerHTML=yyyy+"-"+MM +"-"+ dd +" ";
    document.getElementById('clock_time').innerHTML=hh+":"+mm+":"+ss+"   " + day;
    setTimeout('startTime()',1000);//每一秒重新加载startTime()方法
}

function checkTime(i)
{
    if (i<10){
        i="0" + i;
        }
        return i;
}