// JavaScript Document

function register(){
	var password1 = document.getElementById("password1");
	var password2 = document.getElementById("password2");
	if (password1.value.length <6){
		alert("密码长度至少为6个字符");

	}else if (password1.value!==password2.value){
		alert("两次输入的密码长度不一致，请重新输入");

	}

}