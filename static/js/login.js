// JavaScript Document

function login(){
	var username = document.getElementById("username");
	var password = document.getElementById("password");

	if (username.value ==""){
		alert("请输入用户名");
	}else if (password.value==""){
		alert("请输入密码");
	}else if (username.value =="adminbylht"&&password.value =="lht123456"){
		window.location.href="welcome.html";
	}else{
		alert("请输入正确的用户名和密码！")
	}
}