'use strict';import{Button}from"./button.js";export class ToggleButton extends Button{constructor(a,b,c,d,e,f){super(a,b,c,d,null,null,e);this.image1=e;this.image2=f;this.toggled=false}toggle(a){this.toggled=!this.toggled;if(this.toggled){this.image=this.image2}else{this.image=this.image1}a.fillRect(this.x,this.y,this.width,this.height);this.draw(a)}onClick(a,b,c){let d=super.onClick(a,b,c);if(d){this.toggle(a)}return d}}