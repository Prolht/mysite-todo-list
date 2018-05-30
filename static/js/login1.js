function login_auth(){
  $.ajax({
      type:"post",
      url:"/login_auth/",
      data:{
        'email':$("#inputEmail").val(),
        'password':$("#inputPassword").val()
      },
      dataType: "text",
      success: function(data) {
        //console.log("over..");
        //alert(data);  //就将返回的数据显示出来
        //window.location.href="跳转页面"
      },
      error: function(data) {
        console.log(data);
       // alert("Connection error");
        }
        });
}