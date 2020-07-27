'use strict';import{Block,ColorBlock}from"./block.js";export const MapState={None:"none",Paint:"paint",Move:"move",Erase:"erase",EyeDropper:"EyeDropper"};export class Map{constructor(a,b,c,d){this.x=a;this.y=b;this.width=c;this.height=d;this.borderStrokeStyle="#888888";this.borderLineWidth=2;this.backgroundFillColor="#ffffff";this.gridStrokeStyle="#888888";this.gridLineWidth=1;this.blocks=[];this.activeBlock=null;this.cellSize=25;this.state=MapState.None;this.mouseDown=false}copy(){let a=Object.create(this);Object.assign(a,this);a.blocks=a.blocks.slice();return a}setState(a,b){if(a===MapState.Paint){this.activeBlock=b}else{this.activeBlock=null}if(a===MapState.EyeDropper){this.completion=b}else{this.completion=null}this.state=a}openContent(a,b,c){const d=b.map;c.width=d.width;c.height=d.height;c.blocks=[];c.draw(a);d.blocks.forEach(function(b){let d;if(b.type===Block.Type.Color){d=new ColorBlock(b.x,b.y,b.color);a.save();a.translate(c.x,c.y);d.draw(a);a.restore()}else{let e=new Image;d=new Block(b.x,b.y,e,b.type);e.onload=function(){a.save();a.translate(c.x,c.y);d.draw(a);a.restore()};e.src=b.img}c.blocks.push(d)})}open(a){var b=this;let c=document.createElement("input");c.type="file";c.onchange=function(c){const d=c.target.files;if(!d||d.length===0)return;let f=b;let g=new FileReader;g.onload=function(b){let c=b.target.result;const d=JSON.parse(c);f.openContent(a,d,f)};g.readAsText(d[0])};c.click()}download(b,c,d){if(d&&d.charAt(0)!=="."){d=`.${d}`}let e=prompt("Save as",`${c}${d}`);if(e==null){return}if(e===""){e=`${c}${d}`}if(!e.endsWith(d)){e=`${e}${d}`}let f=document.createElement("a");f.href=b;f.download=e;f.click()}save(){let a=[];this.blocks.forEach(function(b){let c={type:b.type,x:b.x,y:b.y,width:b.width,height:b.height};if(b.type===Block.Type.Color){c.color=b.fillStyle}else{c.img=new URL(b.image.src).pathname}a.push(c)});let b={version:"0.1",map:{width:this.width,height:this.height,blocks:a}};let c="data:application/octet-stream,"+encodeURIComponent(JSON.stringify(b));this.download(c,"BlockBreakerMap","json")}saveImage(){let a=this.width;let b=this.height;let c=0;let d=0;for(const e of this.blocks){if(e.x<a)a=e.x;if(e.y<b)b=e.y;if(e.x+e.width>c)c=e.x+e.width;if(e.y+e.height>d)d=e.y+e.height}let e=c-a;let f=d-b;let g=document.createElement("canvas");g.width=e;g.height=f;let h=g.getContext("2d");h.save();h.translate(-a,-b);this.drawBlocks(h);h.restore();let i=g.toDataURL("image/png");this.download(i,"BlockBreakerImage","png")}outOfBounds(a,b){a-=this.x;b-=this.y;return!(a>=0&&a<=this.width&&b>=0&&b<=this.height)}updateMouseCursor(a,b,c){if(this.outOfBounds(b,c)){return false}switch(this.state){case MapState.Paint:{a.style.cursor="default";return true}case MapState.Move:{a.style.cursor="move";return true}case MapState.EyeDropper:case MapState.Erase:{a.style.cursor="crosshair";return true}}return false}cellForXY(a,b){let c=Math.floor(a/this.cellSize)*this.cellSize;let d=Math.floor(b/this.cellSize)*this.cellSize;c=Math.min(c,this.width-this.activeBlock.width);d=Math.min(d,this.height-this.activeBlock.height);return{x:c,y:d}}onClick(a,b,c){if(this.outOfBounds(b,c)){return}switch(this.state){case MapState.Paint:{this.addBlock(a,b,c);break}case MapState.Move:{this.moveBlock(a,b,c);break}case MapState.Erase:{this.eraseBlock(a,b,c);break}case MapState.EyeDropper:{this.eyeDropper(a,b,c);break}}}onMouseDown(a,b,c){if(this.outOfBounds(b,c)){return}this.mouseDown=true}onMouseUp(a,b,c){this.mouseDown=false}drawActiveBlock(a,b,c){if(!this.activeBlock)return;this.draw(a);a.save();a.translate(this.x,this.y);b-=this.x;c-=this.y;if(b>=0&&b<=this.width&&c>=0&&c<=this.height){const d=this.cellForXY(b,c);this.activeBlock.move(d.x,d.y);this.activeBlock.draw(a)}a.restore()}addBlock(a,b,c){if(this.outOfBounds(b,c)){return}if(!this.activeBlock)return;b-=this.x;c-=this.y;const d=this.cellForXY(b,c);let e=false;for(let f=0;f<this.blocks.length;f++){let a=this.blocks[f];if(a.x===d.x&&a.y===d.y){if(a.id()!==this.activeBlock.id()){this.blocks.splice(f,1,this.activeBlock.copy())}e=true;break}}if(!e){this.blocks.push(this.activeBlock.copy())}}eraseBlock(a,b,c){b-=this.x;c-=this.y;for(let d=0;d<this.blocks.length;d++){let e=this.blocks[d];if(e.hitTest(b,c)){this.blocks.splice(d,1);this.draw(a);break}}}eyeDropper(a,b,c){b-=this.x;c-=this.y;for(let d=0;d<this.blocks.length;d++){let a=this.blocks[d];if(a.hitTest(b,c)){if(this.completion&&a.type===Block.Type.Color)this.completion(a.fillStyle);this.setState(MapState.Paint,a.copy());break}}}moveBlock(a,b,c){if(this.activeBlock){this.addBlock(a,b,c);this.activeBlock=null}else{b-=this.x;c-=this.y;for(let a=0;a<this.blocks.length;a++){let d=this.blocks[a];if(d.hitTest(b,c)){this.activeBlock=this.blocks.splice(a,1)[0];break}}}}onMouseMove(a,b,c){switch(this.state){case MapState.Paint:{this.drawActiveBlock(a,b,c);if(this.mouseDown){this.addBlock(a,b,c)}break}case MapState.Move:{this.drawActiveBlock(a,b,c);break}case MapState.Erase:{if(this.mouseDown){this.eraseBlock(a,b,c)}break}}}drawGrid(a){a.beginPath();a.strokeStyle=this.gridStrokeStyle;a.lineWidth=this.gridLineWidth;for(let b=0;b<this.width;b+=this.cellSize){a.moveTo(b,0);a.lineTo(b,this.height)}for(let b=0;b<this.height;b+=this.cellSize){a.moveTo(0,b);a.lineTo(this.width,b)}a.stroke()}drawGuideLines(a){a.beginPath();a.lineWidth=2;a.moveTo(this.width/2,0);a.lineTo(this.width/2,this.height);a.moveTo(0,this.height/2);a.lineTo(this.width,this.height/2);let b=this.width-this.height;if(b>0){a.moveTo(b/2,0);a.lineTo(b/2,this.height);a.moveTo(this.width-b/2,0);a.lineTo(this.width-b/2,this.height)}else if(b<0){}let c=Math.min(this.height,this.width);a.moveTo(b/2+c/4,0);a.lineTo(b/2+c/4,this.height);a.moveTo(0,c/4);a.lineTo(this.width,c/4);a.stroke()}drawBlocks(a){this.blocks.forEach(function(b){b.draw(a)})}draw(a){a.save();a.translate(this.x,this.y);a.fillStyle=this.backgroundFillColor;a.strokeStyle=this.borderStrokeStyle;a.lineWidth=this.borderLineWidth;a.beginPath();a.rect(0,0,this.width,this.height);a.fill();a.stroke();this.drawGrid(a);this.drawGuideLines(a);this.drawBlocks(a);a.restore()}}