console.log('Loaded!');


var button = document.getElementById('counter');
if (button == undefined) {
	alert("button is not indentified");
}
var counter = 0 ;
button.onclick = function(){
	counter = counter + 1;
	var span = document.getElementById('count');
	span.innerHTML = counter.toString();
}