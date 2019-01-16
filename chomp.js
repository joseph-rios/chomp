var xLength = 0;
var yLength = 0;
var ai = "perfect";
var grid;
var pastGrid;
var eatFlag = true;

window.onload = function() {
  document.getElementById("ai").onchange = chooseAI;
  document.getElementById("new").onclick = newGame;
  document.getElementById("undo").onclick = undo;
  document.getElementById("x").onchange = changeX;
  document.getElementById("y").onchange = changeY;
};

function chooseAI() {
  ai = this.value;
}

function newGame() {
  document.getElementById("undo").disabled = true;
  var squares = document.getElementById("squares");
  while(squares.firstChild) {
    squares.removeChild(squares.firstChild);
  }
  var x = xLength;
  var y = yLength;
  var temp = []
  for(var row=0;row<y;row++) {
    var divRow = document.createElement("DIV");
    temp.push(x);
    for(var col=0;col<x;col++) {
      var barImg = document.createElement("IMG");
      barImg.setAttribute("src","bar.png");
      var imgLink = document.createElement("A");
      imgLink.appendChild(barImg);
      imgLink.setAttribute("class","square");
      var coords = (col).toString()+","+(y-row-1).toString();
      barImg.setAttribute("id",coords);
      imgLink.setAttribute("onclick","eat("+coords+");");
      divRow.appendChild(imgLink);
    }
    squares.appendChild(divRow);
  }
  grid = new Conf(temp);
}

function undo() {
  grid = pastGrid;
  update();
  document.getElementById("undo").disabled = true;
}

function changeX() {
  xLength = parseInt(this.value);
}

function changeY() {
  yLength = parseInt(this.value);
}

function eat(x,y) {
  document.getElementById("undo").disabled = false;
  if(eatFlag && grid.contained(x,y)) {
    eatFlag = false;
    pastGrid = grid;
    grid = grid.transform(x,y);
    update();
    setTimeout(chooseMove,1000);
  }
}

function update() {
  for(var y=0;y<yLength;y++){
    for(var x=0;x<xLength;x++){
      if(!grid.contained(x,y)) {
        document.getElementById(x.toString()+","+y.toString()).setAttribute("src","x.png");
      }
      else {
        document.getElementById(x.toString()+","+y.toString()).setAttribute("src","bar.png");
      }
    }
  }
}

function chooseMove() {
  if(ai=="perfect") {
    var move = grid.winMove();
    if(move==-1) {
      //choose a random move on the edge
      move = Math.floor(grid.data.length*Math.random());
      grid = grid.transform(grid.data[move]-1,move);
    }
    else {
      move = move.split(",");
      grid = grid.transform(move[0],move[1]);
    }
  }
  else if(ai=="weak") {
    var move = grid.obvious();
    if(move==-1) {
      grid = grid.transform(grid.data[grid.data.length-1]-1,grid.data.length-1);
    }
    else {
      console.log(move);
      move = move.split(",");
      grid = grid.transform(move[0],move[1]);
    }
  }
  update();
  eatFlag = true;
}

function Conf(array) {
  this.data = array;

  this.contained = function(x,y) {
    return (y<this.data.length && x<this.data[y]);
  };

  this.transform = function(x,y) {
    var temp = [];
    for(var i=0;i<this.data.length;i++) {
      if(i>=y && this.data[i]>x) {
        temp.push(x);
      }
      else {
        temp.push(this.data[i]);
      }
    }
    while(temp.indexOf(0)!=-1) {
      temp.splice(temp.indexOf(0),1);
    }
    var result = new Conf(temp);
    return result;
  };

  this.winMove = function() {
    var datastring = this.data.join();
    if(Conf.loss.indexOf(datastring)!=-1) {
      return -1;
    }
    else if(datastring in Conf.win) {
      return Conf.win[datastring];
    }
    else {
      var temp;
      for(var y=0;y<this.data.length;y++) {
        for(var x=0;x<this.data[y];x++) {
          if(x!=0 || y!=0) {
            temp = this.transform(x,y);
            if(temp.winMove()==-1) {
              Conf.win[datastring] = x.toString()+","+y.toString();
              return x.toString()+","+y.toString();
            }
          }
        }
      }
      Conf.loss.push(datastring);
      return -1;
    };
  };
  this.obvious = function() {
    if(this.data.length == 2) {
      console.log("horizontal 2 by n case entered");
      //horizontal 2 by n case
      if(this.data[0] == this.data[1]+1) {
        return -1;
      }
      else if(this.data[0] == this.data[1]){
        return this.data[1].toString()+",1";
      }
      else {
        return (this.data[1]+2).toString()+",0";
      }
    }
    else if(this.data[0] == 2 && this.data.length>1) {
      console.log("vertical 2 by n entered");
      //vertical 2 by n case
      var count = 0;
      for(var i = 1;i<this.data.length;i++){
        if(this.data[i]==1) {
          count++;
        }
      }
      if(count==1){
        return -1;
      }
      else if(count==0){
        return "1,"+(this.data.length-1).toString();
      }
      else {
        return "0,"+(this.data.length+1-count).toString();
      }
    }
    else if(this.data.length==this.data[0]+1) {
      //square case
      console.log("square case entered");
      if(this.data[1]>=2) {
      return "1,1";
      }
      else {
        return -1;
      }
    }
    else if(this.data.length>1 && this.data[1]==1 && this.data[0]>1){
      console.log("L case entered");
      //L case
      //impossible L case should have been taken care of in square case
      if(this.data.length-1>this.data[0]) {
        return "0,"+(this.data[0]+1).toString();
      }
      else {
        return "1,"+(this.data.length).toString();
      }
    }
    else {
      console.log("No case entered");
      return -1;
    }
  };
}
Conf.loss = ["1"];
Conf.win = {};
Conf.win["2"] = "1,0";
