'use strict';import{Map,MapState}from"./map.js";import{Block,ColorBlock}from"./block.js";import{Button}from"./button.js";import{ToggleButton}from"./togglebutton.js";import{Game}from"./game.js";const canvas=document.getElementById("canvas");const context=canvas.getContext("2d");context.fillStyle="#eeeeee";context.fillRect(0,0,canvas.width,canvas.height);let map=new Map(60,60,800,600);map.draw(context);let buttons=[];const images=[{type:Block.Type.Soft,src:"images/Brick.png"},{type:Block.Type.Hard,src:"images/hardBrick.png"}];let y=60;let x=1;images.forEach(function(a){let b=new Image;let c=new Button(x,y,Block.size,Block.size,null,null,b);buttons.push(c);c.onClickAction=function(){map.setState(MapState.Paint,new Block(0,0,b,a.type))};y+=Block.size+10;b.onload=function(){c.draw(context)};b.src=a.src});const colors=["#ff0000","#008000","#000080","#000000","#888888","#eeeeee","#eeee00","#ee8000","#8B4513"];let col=0;const colMax=1;for(let a of colors){x=col===0?1:1+ColorBlock.size+2;let b=new Button(x,y,ColorBlock.size,ColorBlock.size,a);buttons.push(b);b.onClickAction=function(){map.setState(MapState.Paint,new ColorBlock(0,0,a,Block.Type.Color))};b.draw(context);if(col===0){col=1}else{y+=ColorBlock.size+1;col=0}}x=1;if(col===1){y+=ColorBlock.size+1}y+=5;let colorPickerButton=new Button(x,y,ColorBlock.size*2,ColorBlock.size,"#FFFFFF","#00000");buttons.push(colorPickerButton);colorPickerButton.draw(context);colorPickerButton.onClickAction=function(){let a=document.createElement("input");a.type="color";a.value=colorPickerButton.fillStyle;map.setState(MapState.Paint,new ColorBlock(0,0,colorPickerButton.fillStyle,Block.Type.Color));a.addEventListener("input",function(a){let b=a.target.value;colorPickerButton.fillStyle=b;colorPickerButton.draw(context);map.setState(MapState.Paint,new ColorBlock(0,0,b,Block.Type.Color))});a.click()};function addButton(a,b,c,d,e,f,g){let h=new Image;let i;if(f){let e=new Image;e.src=f;i=new ToggleButton(a,b,c,d,h,e)}else{i=new Button(a,b,c,d,null,null,h)}i.onClickAction=g;buttons.push(i);h.onload=function(){i.draw(context)};h.src=e;return i}y=1;x=60;addButton(x,y,Block.size,Block.size,"images/save.png",null,function(){map.save()});x+=Block.size+10;addButton(x,y,Block.size,Block.size,"images/upload.png",null,function(){map.open(context)});x+=Block.size+10;addButton(x,y,Block.size,Block.size,"images/landscape.png",null,function(){map.saveImage()});x+=Block.size+10;let moveButton=addButton(x,y,Block.size,Block.size,"images/move.png",null,function(){map.setState(MapState.Move)});x+=Block.size+10;let eraseButton=addButton(x,y,Block.size,Block.size,"images/eraser.png",null,function(){map.setState(MapState.Erase)});x+=Block.size+10;let eyeDropper=addButton(x,y,Block.size,Block.size,"images/color-picker.png",null,function(){map.setState(MapState.EyeDropper,function(a){colorPickerButton.fillStyle=a;colorPickerButton.draw(context)})});x+=Block.size+10;let game=null;function toggleGame(){if(game===null){game=new Game(map.copy());game.demo(context)}else{game.stop(function(){game=null;map.setState(MapState.None);map.draw(context)})}}let playButton=addButton(x,y,Block.size,Block.size,"images/play.png","images/stop.png",toggleGame);function handleButtonsOnClick(a,b){for(let c of buttons){if(game&&c!==playButton){continue}if(c.onClick(context,a,b)){return true}}return false}function updateButtonsMouseCursor(a,b){for(let c of buttons){if(c.hitTest(a,b)){if(game&&c!==playButton){canvas.style.cursor="not-allowed"}else{canvas.style.cursor="pointer"}return true}}return false}function updateMouseCursor(a,b){if(updateButtonsMouseCursor(a,b)){return}if(map.updateMouseCursor(canvas,a,b)){return}canvas.style.cursor="default"}function handleShortcut(a){switch(a.key){case"Escape":{if(game){toggleGame();playButton.toggle(context)}else{map.setState(MapState.None);map.draw(context)}return true}case"M":case"m":{if(game)break;moveButton.onClickAction();map.draw(context);return true}case"E":case"e":{if(game)break;eraseButton.onClickAction();map.draw(context);return true}case"D":case"d":{if(game)break;eyeDropper.onClickAction();map.draw(context);return true}case"P":case"p":{toggleGame();playButton.toggle(context);return true}}return false}canvas.onclick=function(a){let b=a.pageX-canvas.offsetLeft;let c=a.pageY-canvas.offsetTop;if(handleButtonsOnClick(b,c)){return}map.onClick(context,b,c)};window.onmousedown=function(a){let b=a.pageX-canvas.offsetLeft;let c=a.pageY-canvas.offsetTop;map.onMouseDown(context,b,c)};window.onmouseup=function(a){let b=a.pageX-canvas.offsetLeft;let c=a.pageY-canvas.offsetTop;map.onMouseUp(context,b,c)};window.onmousemove=function(a){let b=a.pageX-canvas.offsetLeft;let c=a.pageY-canvas.offsetTop;updateMouseCursor(b,c);if(!game){map.onMouseMove(context,b,c)}};window.onkeydown=function(a){if(!handleShortcut(a)){if(game){game.onKeyDown(a)}}};window.onkeyup=function(a){if(game){game.onKeyUp(a)}};