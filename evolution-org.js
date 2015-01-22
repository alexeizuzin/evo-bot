var dWidth = 100;
var dHeight = 100;
var field = [];

var randomCoords = function(max){
	return Math.floor(Math.random() * max);
}
var showElem = function(obj){
	var newElem = document.createElement('div');
	newElem.className = obj.cssClass;
	newElem.style.top = obj.y + '%';
	newElem.style.left = obj.x + '%';
	document.getElementById('display').appendChild(newElem);
	obj.domLink = newElem;
	field.push(obj);
}
var addFood = function(){
	newFood = {};
	newFood.cssClass = 'b-food';
	newFood.y = randomCoords(100);
	newFood.x = randomCoords(100);
	showElem(newFood);
}
var addPoison = function(){
	newPoison = {};
	newPoison.cssClass = 'b-poison';
	newPoison.y = randomCoords(90);
	newPoison.x = randomCoords(90);
	showElem(newPoison);
}
var initGame = function(){
	for (var i = 0; i <= 900; i++) {
		addFood();
	};
	for (var i = 0; i <= 90; i++) {
		addPoison();
	};
	step = setInterval(playerObj.todo, 100);
}
var fieldCheck = function(y, x){
	var res = []
	for (var iter = field.length - 1; iter >= 0; iter--) {
		if(field[iter].y == y && field[iter].x == x){
			res.push(iter);
		}
	}
	return res;
}

function Ameba(id, top, left){
	this.id = id;
	this.score = 0;
	this.position = {
		top: top || 50,
		left: left || 50
	};
	this.onEat = function(){

	}
	this.todo = function(){
		this.move();
		this.collision();
	}
}



Ameba.prototype.show = function(){
	document.getElementById(this.id).style.top = this.position.top + '%';
	document.getElementById(this.id).style.left = this.position.left + '%';
}

Ameba.prototype.sensePoison = function(y, x){ 
	var foundFoodArr = fieldCheck(y, x); //////////
	if(foundFoodArr.length){
		for (var foodNum = foundFoodArr.length - 1; foodNum >= 0; foodNum--) {
			var i = foundFoodArr[foodNum];
			if(field[i].cssClass == 'b-poison'){ /////////
				return true;
			}
		}
	}
	return false;
}
Ameba.prototype.collision = function(){
	var foundFoodArr = fieldCheck(this.position.top, this.position.left); ///////
	if(foundFoodArr.length){
		for (var foodNum = foundFoodArr.length - 1; foodNum >= 0; foodNum--) {
			var i = foundFoodArr[foodNum];
			if(field[i].cssClass == 'b-food'){//////
				this.eat(i);
			}
			if(field[i].cssClass == 'b-poison'){///////
				this.die();
			}
		}
	}
}
Ameba.prototype.eat = function(fieldItemNumber){
	//document.getElementById('display').removeChild(field[fieldItemNumber].domLink);
	field[fieldItemNumber].domLink.style.background = 'yellow';  ////////
	//field.splice(fieldItemNumber, 1);
	this.onEat();
	this.score++;
}
Ameba.prototype.die = function(){
	clearInterval(step); //////////
}



var playerObj = {};
playerObj.score = 0;
playerObj.position = {};
playerObj.position.top = 50;
playerObj.position.left = 50;
playerObj.todo = function(){
	playerObj.move();
	playerObj.collision();
}
playerObj.onEat = function(){
	
}
playerObj.sensePoison = function(y, x){
	var foundFoodArr = fieldCheck(y, x);
	if(foundFoodArr.length){
		for (var ii = foundFoodArr.length - 1; ii >= 0; ii--) {
			var i = foundFoodArr[ii];
			if(field[i].cssClass == 'b-poison'){
				return true;
			}
		}
	}
	return false;
}
playerObj.show = function(){
	document.getElementById('player').style.top = playerObj.position.top + '%';
	document.getElementById('player').style.left = playerObj.position.left + '%';
}
playerObj.collision = function(){
	var foundFoodArr = fieldCheck(playerObj.position.top, playerObj.position.left);
	if(foundFoodArr.length){
		for (var ii = foundFoodArr.length - 1; ii >= 0; ii--) {
			var i = foundFoodArr[ii];
			if(field[i].cssClass == 'b-food'){
				playerObj.eat(i);
			}
			if(field[i].cssClass == 'b-poison'){
				playerObj.die();
			}
		}
	}
}
playerObj.eat = function(fieldItemNumber){
	//document.getElementById('display').removeChild(field[fieldItemNumber].domLink);
	field[fieldItemNumber].domLink.style.background = 'yellow';
	//field.splice(fieldItemNumber, 1);
	playerObj.onEat();
	playerObj.score++;
}
playerObj.die = function(){
	clearInterval(step);
}
playerObj.moveWrong = null;
playerObj.move = function(direction){
	abilities = [];
	var getDirection = function(){
		if (direction == undefined){
			direction = Math.floor(Math.random()*abilities.length);
			// if (direction == playerObj.moveWrong){
			// 	direction++;
			// 	if(direction == abilities.length ){
			// 		direction = 0;
			// 	}
			// }
		}
		return direction;
	}
	abilities.push(
		function(){
			var y = playerObj.position.top;
			if(y < 99 && !playerObj.sensePoison(y + 1, playerObj.position.left)){
				playerObj.position.top++;
				playerObj.moveWrong = null;
			} else {
				playerObj.moveWrong = 0;
			}
		}
	);
	abilities.push(
		function(){
			var x = playerObj.position.left;
			if(x > 0 && !playerObj.sensePoison(playerObj.position.top, x - 1)){
				playerObj.position.left--;
				playerObj.moveWrong = null;
			} else {
				playerObj.moveWrong = 1;
			}
		}
	);
	abilities.push(
		function(){
			var y = playerObj.position.top;
			if(y > 0 && !playerObj.sensePoison(y - 1, playerObj.position.left)){
				playerObj.position.top--;
				playerObj.moveWrong = null;
			} else {
				playerObj.moveWrong = 2;
			}
		}
	);
	abilities.push(
		function(){
			var x = playerObj.position.left;
			if(x < 99 && !playerObj.sensePoison(playerObj.position.top, x + 1)){
				playerObj.position.left++;
				playerObj.moveWrong = null;
			} else {
				playerObj.moveWrong = 3;
			}
		}
	);

	abilities[getDirection()]();
	playerObj.show();
}

initGame();