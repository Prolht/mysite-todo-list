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

//将数据添加到数据库中
function save_todo(){
  $.ajax({
      type:"post",
      url:"/save_info/",
      cache:false,
      data:{
        'todo':$("#myInput").val(),
        'datetime':$("#ECalendar_case2").val()
      },
      dataType: "text",
      success: function() {
        //console.log("over..");
        //alert(data);  //就将返回的数据显示出来
        //window.location.href="跳转页面"
      },
      error: function() {
        }
        });
}