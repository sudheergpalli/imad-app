console.log('Loaded!');


var button = document.getElementById('counter');
if (button == undefined) {
	alert("button is not indentified");
}

// for Click me Button whose Id is 'counter' in index.html
//adding the data in index.html by hitting the webserver to get data
button.onclick = function(){
	
	var request = new XMLHttpRequest();
	request.open('GET','http://localhost/counter',true);
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
// adding the html content in index.html without hitting server

var submitbtn = document.getElementById('submit');
submitbtn.onclick = function(){
	var names = ['name1','name2','name3'];
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