
'use strict'; 

var  score = 0;
var  scoreElement;

var EMPTY_CELL = 0;
var FULL_CELL  = 1;
var SHARP_CELL = 2;

var arreyDivs;

var keyDown;

function getEmtyMatrix(wigth,height, defaultValue)
{
	let maxrix = new Array();
		
	for(let i = 0 ;i < wigth;i++)
	{
		maxrix[i] = new Array();
		
		for(let j=0; j < height;j++)
		{
			maxrix[i][j] = defaultValue;
		}
	}
	
	return maxrix;
}

class Point
{
	constructor(x,y)
	{
		this.x = x;
		this.y = y;
	}
}

class Sharp
{
	constructor(matrix)
	{
		this.matrix = matrix;
		this.width = matrix.length;
		this.height = matrix[0].length;
	}
	
	
	toLeft()
	{
	
		let rotatedMaxrix = getEmtyMatrix(this.height,this.wigth, EMPTY_CELL);
				
		for(let i = 0 ;i < this.height;i++)
			for(let j=0; j < this.width;j++)
			{
				rotatedMaxrix[i][j] = this.matrix[j][this.height - i - 1];
			}
		
		let temp = this.height;
		this.height = this.wigth;
		this.wigth = temp;
		
		return new Sharp(rotatedMaxrix);
	}
	
	toRight()
	{
		let rotatedMaxrix = getEmtyMatrix(this.height,this.wigth, EMPTY_CELL);
		
		for(let i = 0 ;i < this.height;i++)
			for(let j=0; j < this.width;j++)
			{
				rotatedMaxrix[i][j] = this.matrix[this.width - j - 1][i];
			}
		
		let temp = this.height;
		this.height = this.wigth;
		this.wigth = temp;
		
		return new Sharp(rotatedMaxrix);
	}
}

var normalIntrval = 300;
var fastInterval = 20;
var interval = normalIntrval;

var gameWidth = 10;
var gameHeight = 20;

var tileWidth = 20;
var tileHeight = 20;

var isFastMod = false;

var isGameOver = false;
var isNewTurn = true;

var point;
var sharp;

initializationViem();

var gameMap = getEmtyMatrix(gameWidth,gameHeight, EMPTY_CELL);

nextStep();	
setInterval(shiftSharp,100);



function initializationViem()
{
	var mainDiv = document.createElement('div');

	mainDiv.style.position = "absolute";

	mainDiv.style.left = "40px";
	mainDiv.style.top =  "60px";


	mainDiv.style.width = tileWidth * gameWidth  + "px";
	mainDiv.style.height = tileHeight * gameHeight  + "px";
	
	//mainDiv.style.border = "2px solid black";
	
	document.body.onkeydown = function(event)
	{
		keyDown = event.key;
	}

	document.body.appendChild(mainDiv);

	arreyDivs = new Array(); 
	for(let i = 0 ;i < gameWidth;i++)
	{
		arreyDivs[i] = new Array();
		for(let j=0; j < gameHeight;j++)
		{
			let div = document.createElement('div');

			div.style.position = "absolute";
			div.className =  "empti";

			div.style.left = i * tileWidth  + "px";
			div.style.top =  j * tileHeight + "px";


			div.style.width = tileWidth - 1 + "px";
			div.style.height = tileHeight - 1 + "px";

			mainDiv.appendChild(div);
			
			arreyDivs[i][j] = div;
		}
	}
	
	scoreElement = document.createElement('h1');
	document.body.appendChild(scoreElement);
}


function refershView(gameMap, sharp, point)
{
	let matrix = getViewMatrix(gameMap, sharp, point);
	
	for(let i = 0 ;i < gameWidth;i++)
		for(let j=0; j < gameHeight;j++)
		{

			if(matrix[i][j] == EMPTY_CELL)
			{
				arreyDivs[i][j].className =  "empti";
			}
		
			if(matrix[i][j] == FULL_CELL)
			{
				arreyDivs[i][j].className =  "cell";
			}
			
			if(matrix[i][j] == SHARP_CELL)
			{
				arreyDivs[i][j].className =  "cell";
			}
			
			
			if(isAdroad(i,j - 1) || matrix[i][j - 1] != matrix[i][j])
				arreyDivs[i][j].style.borderTop = "1px solid black";
			else
				arreyDivs[i][j].style.borderTop = "1px solid white";
		
			if(isAdroad(i + 1,j) || matrix[i + 1][j] != matrix[i][j])
				arreyDivs[i][j].style.borderRight = "1px solid black";
			else
				arreyDivs[i][j].style.borderRight = "1px solid white";
			
			if(isAdroad(i,j + 1) || matrix[i][j + 1] != matrix[i][j])
				arreyDivs[i][j].style.borderBottom = "1px solid black";
			else
				arreyDivs[i][j].style.borderBottom = "1px solid white";
			
			if(isAdroad(i - 1,j) || matrix[i - 1][j] != matrix[i][j])
				arreyDivs[i][j].style.borderLeft = "1px solid black";
			else
				arreyDivs[i][j].style.borderLeft = "1px solid white";
			
		}
		
	
	scoreElement.innerHTML  = score;
}

	function isAdroad(x,y)
	{
		if(x < 0 || x >= gameWidth)
			return true;
		if(y <0 || y >= gameHeight)
			return true;
		
		return false;
	}

function getViewMatrix(gameMap, sharp, point)
{
	let maxrix = getEmtyMatrix(gameWidth, gameHeight ,EMPTY_CELL);
	
	for(let i = 0 ;i < gameWidth;i++)
		for(let j=0; j < gameHeight;j++)
		{
			maxrix[i][j] = gameMap[i][j];
		}
	
	if(sharp != undefined && sharp != null)
	{
		for(let i = 0 ;i < sharp.width;i++)
			for(let j=0; j < sharp.height;j++)
			{
				if(sharp.matrix[i][j] == SHARP_CELL)
					maxrix[point.x + i][point.y + j] = SHARP_CELL;
			}
	}
	
	return maxrix;
}



function getRandomSharp()
{
	let X = SHARP_CELL;
	let _ = EMPTY_CELL;
	
	var sharps = new Array();
	sharps[0] = new Sharp(
	[
		[X,_],
		[X,_],
		[X,_],
		[X,_]
	]
	);
	sharps[1] = new Sharp(
	[
		[X,X,_],
		[X,_,_],
		[X,_,_]
	]
	);
	sharps[2] = new Sharp(
	[
		[_,X,X],
		[_,_,X],
		[_,_,X]
	]
	);
	sharps[3] = new Sharp(
	[
		[X,_],
		[X,X],
		[_,X]
	]
	);
	sharps[4] = new Sharp(
	[
		[_,X],
		[X,X],
		[X,_]
	]
	);
	sharps[5] = new Sharp(
	[
		[_,X,_],
		[_,X,X],
		[_,X,_]
	]
	);
	sharps[6] = new Sharp(
	[
		[X,X],
		[X,X]
	]
	);
	
	
	var randomNamber = Math.round(Math.random() * (sharps.length - 1));
	
	return sharps[randomNamber];
}

function isBlock( gameMap,sharp,point)
{	
	for(let i = 0 ;i < sharp.width;i++)
		for(let j = 0; j < sharp.height;j++)
		{
			if(sharp.matrix[i][j] == SHARP_CELL )
			{
				if(point.x + i < 0 || point.x + i >= gameWidth)
					return true;
				if(point.y + j >= gameHeight)
					return true;
				if(gameMap[point.x + i ][point.y + j] == FULL_CELL)
					return true;
			}
		}
	
	return false;
}

function downSharp(gameMap,sharp,point)
{
	for(let i = 0 ;i < sharp.width;i++)
		for(let j=0; j < sharp.height;j++)
		{
			if(sharp.matrix[i][j] == SHARP_CELL)
			{
				if(gameMap[point.x + i][point.y + j] == FULL_CELL || sharp.matrix[i][j] == SHARP_CELL)
					gameMap[point.x + i][point.y + j] = FULL_CELL;
			}
		}
	
}
	
function nextStep()
{
	if(!isGameOver)
	{
		if(isNewTurn == true)
		{
			isNewTurn = false;
			
			sharp = getRandomSharp();	
			
			point = new Point(Math.round(gameWidth/2 - sharp.width/2),0);
			
			
			
			if(isBlock(gameMap,sharp,point) == true)
			{	
				isGameOver = true;
				sharp = null;
			}
		}
		else
		{
			var nextPoint = new Point(point.x,point.y + 1);
			
			
			if(isBlock(gameMap,sharp,nextPoint) == true)
			{
				isFastMod = false;
				
				downSharp(gameMap,sharp,point);
				isNewTurn = true;
			}
			else
				point = nextPoint;
			
			let lines = getFullLines(gameMap);
			
			if(lines.length > 0)
			{
				for(let n = 0;n < lines.length;n++)
				{
					let line = lines[n];
					
					for(let j = line - 1 ; j >= 0; j--)
					{
						shiftLine(j,gameMap);
					}
					
					score += gameWidth;
				}
			sharp = null;
			}
		}
		refershView(gameMap,sharp,point);
		
		if(isFastMod)
		{
			setTimeout(nextStep,fastInterval);
		}
		else
		{
			setTimeout(nextStep,normalIntrval);
		}
	}
	else
	{
		alert("Game over");
	}
}

function shiftSharp()
{
	var nextPoint = new Point(point.x,point.y);
	
	if(keyDown == "ArrowLeft")
	{
		nextPoint.x--;
		if(isBlock(gameMap,sharp,nextPoint) == false)
			point = nextPoint; 
	}
	
	if(keyDown == "ArrowRight")
	{
		nextPoint.x++;
		if(isBlock(gameMap,sharp,nextPoint) == false)
			point = nextPoint; 
	}
	
	if(keyDown == "ArrowUp")
	{
		var rotatedSharp = sharp.toLeft();
		
		if(isBlock(gameMap,rotatedSharp,nextPoint) == false)
			sharp = rotatedSharp;	
	}
	
	if(keyDown == "ArrowDown")
	{
		var rotatedSharp = sharp.toRight();
		
		if(isBlock(gameMap,rotatedSharp,nextPoint) == false)
			sharp = rotatedSharp;	
	}
	
	if(keyDown == " ")
	{
		isFastMod = true;
	}

	
	//if(keyDown != null) alert('X' + keyDown + 'X');
	
	keyDown = null;
	
	refershView(gameMap,sharp,point);
}

function getFullLines(gameMap)
{
	let rezult = new Array();
	
	for(let j = 0; j < gameHeight;j++)
	{
		let full = true;
		for(let i = 0;i< gameWidth;i++)
		{
			full &= (gameMap[i][j] == FULL_CELL)
		}
		if(full == true)
			rezult[rezult.length] = j;
	}
	
	return rezult;
}

function shiftLine(line,gameMap)
{
	for(let i = 0; i < gameWidth; i++)
	{
		gameMap[i][line + 1] = gameMap[i][line];
		gameMap[i][line] = EMPTY_CELL;
	}
}








