console.log('Loaded!');


var button = document.getElementById('counter');
if (button == undefined) {
	alert("button is not indentified");
}

// for Click me Button whose Id is 'counter' in index.html
//adding the data in index.html by hitting the webserver to get data
button.onclick = function(){
	
	var request = new XMLHttpRequest();
	request.open('GET','http://sudheergandla.imad.hasura-app.io/counter',true);
	request.send(null);
	
	request.onreadystatechange = function(){
		if (request.readyState == XMLHttpRequest.DONE) {
			if (request.status == 200){
				var counterValue = request.responseText;
				var span = document.getElementById('count');
				span.innerHTML = counterValue.toString();
			}
		}
	}
	
}

// for Submit Button whose id is submit in index.html
// adding the html content in index.html by hitting the webserver


var submitbtn = document.getElementById('submit');
submitbtn.onclick = function(){
	
	var inputbox = document.getElementById('name');
	var name = inputbox.value;
	
	var request = new XMLHttpRequest();
	request.open('GET','http://sudheergandla.imad.hasura-app.io/submit-name?name=' + name,true); //you are maing a  request to end-point 'submit-name' using string parameter
	request.send(null);
	
	request.onreadystatechange = function(){
		if (request.readyState == XMLHttpRequest.DONE) {
			if (request.status == 200){
				var names = request.responseText;
				names = JSON.parse(names);
				
				var list = '';
				for (var i=0;i<names.length;i++){
					list = list + '<li>' + names[i] + '</li>';
				}
	
				var ul = document.getElementById('name_list');
				if (ul == undefined) {
					alert('unordered list is not identified');
				}
				console.log(list);
				ul.innerHTML = list;
			}
		}
	}
}

// for Submit Button whose id is submit in index.html
// adding the html content in index.html by hitting the webserver


var loginsubmitbtn = document.getElementById('login_submit_btn');
loginsubmitbtn.onclick = function(){
	
	var username = document.getElementById('username').value;
	var password = document.getElementById('password').value;
	console.log(username);
	console.log(password);
	var request = new XMLHttpRequest();
	request.open('POST','http://sudheergandla.imad.hasura-app.io/LoginAuth',true); //you are maing a  request to end-point 'LoginAuth' 
	request.setRequestHeader('Content-Type','application/json');  // Request Header 
	// request.send(null); // we used this for GET Request
	request.send(JSON.stringify({username:username,password:password})); //Request Input data in the body of the request
	
	request.onreadystatechange = function(){
		if (request.readyState == XMLHttpRequest.DONE) {
			if (request.status == 200){
				alert("logged in successfully");
			}
			else if (request.status == 403) {
				alert("login is not successfull");
			}
			else if (request.status == 500) {
				alert("something wrong in the server");
			}
		}
	}
}

