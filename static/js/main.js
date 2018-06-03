// JavaScript Document

/*以下是函数*/
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


/
//对目标标签进行隐藏
function hide_ele(div) {
    div.style.display = "none";
}


// Add a "checked" symbol when clicking on a list item
var list = document.querySelector('ul');
list.addEventListener('click', function(ev) {
    if (ev.target.Tagname=== 'LI') {
    ev.target.classList.toggle('checked');
  }
}, false);


// 当点击”新增“按钮时，增加新的元素，并保存在数据库中
function newElement() {
  var li = document.createElement("li");
  var inputValue = document.getElementById("myInput").value;
  console.log(inputValue)
  var t = document.createTextNode(inputValue);
  li.appendChild(t);
  if (inputValue === '') {
    alert("你还木有添加To Do...");
  } else {
    document.getElementById("myUL").appendChild(li);//将新添加的list加入到后续的队列中
    save_todo();  //调用数据库保存函数
  }
  document.getElementById("myInput").value = ""; //将input框置空，以便下次输入
  document.getElementById("myUL");
  var span = document.createElement("SPAN"); //创建新的span标签
  var txt = document.createTextNode("\u00D7");//创建X号
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);

  for (i = 0; i < close.length; i++) {
    close[i].onclick = function(i) {
      var div = this.parentElement;
      div.style.display = "none";
    }
  }
}


/ Click on a close button to hide the current list item
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

/* 点击按钮，下拉菜单在 显示/隐藏 之间切换 */
function choose_important() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// 点击下拉菜单 以外区域隐藏
window.onclick = function(event) {
  if (!event.target.matches('.addBtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

//将数据添加到数据库中
function save_todo(){
  $.ajax({
      type:"post",
      url:"/save_info/",
      cache:false,
      data:{
        'todo':$("#myInput").val(),
      },
      dataType: "text",
      success: function(data) {
        //console.log("over..");
        //alert(data);  //就将返回的数据显示出来
        //window.location.href="跳转页面"
      },
      error: function(data) {
        //console.log(data);
       alert("Connection error");
        }
        });
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