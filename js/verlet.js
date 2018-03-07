"use strict";
/**
 *  @name Verlet.js
 *  @version 1.0.1
 *  @type Javascript Physcis Library
 *  @author Anurag Hazra (hazru.anurag&commat;gmail.com)
 *  @copyright BasciHTMLPro © 2018
 *  @constructor new Verlet();
 *  @namespace window
 *  @license MIT
 */

function Verlet() {

	/** @name _PRIVATE_FUNCTIONS */
	/** 	
	 *  Compute Distance Between Two Object
	 *	@private @method _distance()
	 *	@param {object} p0
	 *	@param {object} p1
	 *	@return {number:distance} 
	 */
	this._distance = function _distance(p0,p1) {
		const dx = p0.x - p1.x;
		const dy = p0.y - p1.y;
		return Math.sqrt(dx*dx + dy*dy);
	};

	/* Variables */
	const imageSmoothing = false;
	const imageSmoothingQuality = 'low';
	
	/* Constructor */
	const self = this;
	this.gravity = 0.8;
	this.friction = 1;
	this.stiffness = 1;
	this.bounce = 0.90;
	this.canvas = undefined;
	this.ctx = undefined;
	this.handle = undefined;
	this.handleIndex = null;

	this.osCanvas = document.createElement('canvas');
	this.osCanvas.id = "osCanvas";
	/** 	
	 *	initialize canvas
	 *	@method Verlet.init()
	 *	@param {number} cw
	 *	@param {number} ch
	 *	@param {string} canvas
	 *	@param {float} gravity
	 *	@param {float} friction
	 *	@param {float} stiffness
	 *   @return {object}
	 */
	this.init = function(cw,ch,canvas,gravity,friction,stiffness) {
		this.canvas = document.querySelector(canvas);
		this.canvas.width = cw || 100;
		this.canvas.height = ch || 100;
		this.ctx = this.canvas.getContext('2d');
		this.gravity = gravity;
		this.friction = friction;
		this.stiffness = stiffness || 1;
		//obj.canvas.style.border = '1px solid gray';
		this.osCanvas.width = this.canvas.width;
		this.osCanvas.height = this.canvas.height;

		this.ctx.imageSmoothingEnabled = imageSmoothing;
		this.ctx.imageSmoothingQuality = imageSmoothingQuality;
		this.osCanvas.getContext('2d').imageSmoothingEnabled = false;
		this.osCanvas.getContext('2d').imageSmoothingQuality = imageSmoothingQuality;

		const dataToReturn = {
			canvas : this.canvas,
			ctx : this.ctx,
			osCanvas : this.osCanvas,
			gravity : this.gravity,
			friction : this.friction,
			stiffness : this.stiffness
		}
		return dataToReturn;
	};

	
	this.tearArray = [];
	/**
	 *  predifined methods for creating models
	 *  @method Verlet.Poly;
	 *  @type {object}
	 *  @function bind(),box(),triangle(),hexagon(),map(),beam(),rope(),advanceCloth(),cloth
	 */
	this.Poly = {
		dots : undefined,
		cons : undefined,
		/** 	
		 *	Binds Points And Constrains Array To This Object
		 *	@method Verlet.Poly.bind()
		 *	@param {array} dots
		 *	@param {array} cons
		 */
		bind : function(dots,cons) {
			this.dots = dots;
			this.cons = cons;
		},
		/** 	
		 *	Create A Box
		 *	@method Verlet.Poly.box()
		 *	@param {object} opt
		 *	@param {array} dots
		 *	@param {array} cons
		*/
		box : function createBox(opt,dot,con) {
				let dots = dot || this.dots;
				let cons = con || this.cons;
				// (dots.length < 1) ? pls = 0 : pls = dots.length;
				let clone = opt.clone || 1;
				if(clone !== undefined) {
					for(let i = 0; i < clone; i++) {
						let vx = opt.vx || 0;
						let vy = opt.vy || 0;
						let pls = dots.length;
						let width = opt.x + (opt.width);
						let height = opt.y + (opt.height);
						let twoWidth = opt.x + (opt.width*2);
						let twoHeight = opt.y + (opt.height*2);
						self.create([
							[width,height,width + vx,height + vy],
							[twoWidth,height,twoWidth,height],
							[twoWidth,twoHeight,twoWidth,twoHeight],
							[width,twoHeight,width,twoHeight]
						],dots);
						self.clamp([
							[0+pls,1+pls],
							[1+pls,2+pls],
							[2+pls,3+pls],
							[3+pls,0+pls],
							[0+pls,2+pls,true],
							[1+pls,3+pls,true],
						],cons,dots);
					}
				}
			},
		/** 	
		 *	Create A Triangle
		 *	@method Verlet.Poly.box()
		 *	@param {object} opt
		 *	@param {array} dots
		 *	@param {array} cons
		*/
		triangle : function(opt,dot,con) {
			let dots = dot || this.dots;
			let cons = con || this.cons;
			let pls = dots.length;
			let clone = opt.clone || 1;
			if(clone !== undefined) {
				for(let i = 0; i < clone; i++) {
					let tri_x = opt.x; //x
					let tri_y = opt.y; //y
					let tri_height = opt.height; //height
					let tri_width = opt.width; //width
					let tri_center = (tri_x + tri_y + tri_width) / 2; //center
					(dots.length < 1) ? pls = 0 : pls = dots.length;
					self.create([
						[tri_x,tri_y,tri_x + (opt.vx || 0),tri_y + (opt.vy || 0)],
						[(tri_x + tri_width),tri_y,(tri_x + tri_width),tri_y],
						[tri_center,tri_height,tri_center,tri_height]
					],dots);
					self.clamp([
						[0+pls,1+pls],
						[1+pls,2+pls],
						[0+pls,2+pls]
					],cons,dots)
				}
			}
		},
		/** 	
		 *	Create A Hexagon
		 *	@method Verlet.Poly.hexagon()
		 *	@param {object} opt
		 *	@param {array} dots
		 *	@param {array} cons
		*/
		hexagon : function(opt,dot,con) {
			let dots = dot || this.dots;
			let cons = con || this.cons;
			let clone = opt.clone || 1;
			if(clone !== undefined) {
				for(let i = 0; i < clone; i++) {
					let pls = dots.length;
					let tmpDots = [],
						tmpCons = [],
						splice = 0,
						angle = 0;
					let n = opt.sides,
						x = opt.x,
						y = opt.y,
						radius = opt.radius,
						slice1 = opt.slice1,
						slice2 = opt.slice2;
					
					for(let i = 0; i < n; i++) {
						splice += Math.PI*2 / n;
						angle += Math.PI*2 / n;
						let outer = (Math.cos((angle)) * radius);
						let inner = (Math.sin((angle)) * radius);
						tmpDots.push([
							outer+x,inner+y,outer+x,inner+y
						])
						tmpCons.push([
							(i + dots.length),((i + slice1) % n) + dots.length,
						])
						tmpCons.push([
							(i + dots.length),((i + slice2) % n) + dots.length
						])
					}
					if(opt.center) {
						tmpDots.push([
							x,y,x,y
						])
						for(let j = 0; j < tmpDots.length-1; j++) {
							tmpCons.push([
								(tmpDots.length-1)+dots.length,
								((j+1)%tmpDots.length-1) + dots.length
							])
						}
					}
					self.create(tmpDots,dots);
					self.clamp(tmpCons,cons,dots);
					tmpDots = [];
					tmpCons = [];
				}
			}
		},
		/** 	
		 *	Create A Charecter Map
		 *	@method Verlet.Poly.map()
		 *	@param {object} opt
		 *	@param {array} dots
		 *	@param {array} cons
		*/
		map : function map(opt,dot) {
			let dots = dot || this.dots;
			let tmpDots = [];
			let w = self.canvas.width / opt.sizeX;
			let h = self.canvas.height / opt.sizeY;
	
			for (let i = 0; i < opt.data.length; i++) {
				const info = opt.data[i];
				for (let j = 0; j < info.length; j++) {
					if(info.charAt(j) !== " ") {
						tmpDots.push([
							opt.x + w * j,
							opt.y + h * i,
							opt.x + w * j,
							opt.y + h * i
						]);
					}
				}
			}
			self.create(tmpDots,dots);
		},
		/** 	
		 *	Create A Bridge Beam
		 *	@method Verlet.Poly.beam()
		 *	@param {object} opt
		 *	@param {array} dots
		 *	@param {array} cons
		*/
		beam : function Beam(opt,dot,con) {
			let dots = dot || this.dots;
			let cons = con || this.cons;
			let clone = opt.clone || 1;
			if(clone !== undefined) {
				for(let i = 0; i < clone; i++) {
					let pls = dots.length;
					let beamDots = [];
					let beamCons = [];
					let oldx = opt.x;
					let cols = 2;
					let rows = opt.segs;
					let x = opt.x;
					let y = opt.y;
					let width = opt.width;
					let height = opt.height;
					for (let i = 0; i < cols; i++) {
						for (let j = 0; j < rows; j++) {
							beamDots.push([
								x,y,x,y
							])
							x += width;
						}
						x = oldx;
						y += height;
					}
					for (let j = 0; j < cols*rows-1; j++) {
						if( (j+1)%rows > 0 ) {
							beamCons.push([
								(j)+pls,(j+1)%rows+pls
							])
						}
					}
					for (let j = 0; j < rows; j++) {
						beamCons.push([
							(j)+pls,(j+rows)+pls
						]);
					}
					for (let k = 0; k < rows-1; k++) {
						beamCons.push([(rows+k)+pls,(rows+k+1)+pls]);
					}
			
					self.create(beamDots,dots);
					self.clamp(beamCons,cons,dots);
				}
			}
		},
		/**
		 *  Create A Rope
		 *	@method Verlet.Poly.rope()
		 *  @param {object} opt
		 *	@param {number} opt_x
		 *	@param {number} opt_y
		 *	@param {number} opt_parts
		 *	@param {number} opt_len
		 *  @param {array} dot
		 *  @param {array} con
		 *	@return {object} 
		 */	
		rope : function createRope(opt,dot,con) {
				let dots = dot || this.dots;
				let cons = con || this.cons;
				let clone = opt.clone || 1;
				if(clone !== undefined) {
					for(let i = 0; i < clone; i++) {	
						let rope = [];
						let ropeClamp = [];
						let cIndex = 0;
						let attr;
						let y = opt.y,
							x = opt.x,
							vy = opt.vy || opt.y,
							vx = opt.vx || opt.x;
						for (let i = 0; i < opt.parts; i++) {
							attr = (i === 0) ? [true,'crimson'] : [false,null] 
							x += opt.gap;
							vx += opt.gap;
							rope.push([
								x,y,vx,vy,attr[0],attr[1]
							]);
							cIndex = (cIndex + 1) % opt.parts;
							ropeClamp.push([
								(i + dots.length), (cIndex + dots.length),
								false,
								[(i + dots.length),(cIndex + dots.length)]
							]);
						}
						ropeClamp.pop();
						self.create(rope,dots);
						self.clamp(ropeClamp,cons,dots);
						rope = [];
						ropeClamp = [];
					}
				}
			},
			
		/**
		 *  Create A Rope
		 *	@method Verlet.Poly.advanceCloth()
		 *  @param {object} opt
		 *	@param {number} opt_x
		 *	@param {number} opt_y
		 *	@param {number} opt_gridX
		 *	@param {number} opt_gridY
		 *	@param {number} opt_gap
		 *	@param {number} opt_segs
		 *  @param {array} dot
		 *  @param {array} con
		 */			
		advanceCloth : function advanceCloth(opt,dot,con) {
				let dots = dot || this.dots;
				let cons = con || this.cons;
				let delta = 1;
				let pls = dots.length;
				for (let i = 0; i < opt.segs; i++) {
					let p = {
						x : (opt.x - opt.gridX/opt.gap * delta + (i%opt.gridX) * delta * opt.gap),
						y : (opt.y - opt.gridY/opt.gap * delta + (i/opt.gridY) * delta * opt.gap),
						oldx : (opt.x - opt.gridX/opt.gap * delta + (i%opt.gridX) * delta * opt.gap),
						oldy : (opt.y - opt.gridY/opt.gap * delta + (i/opt.gridY) * delta * opt.gap) + Math.random() * opt.gap
					};
					dots.push(p);
				}
				for (let i = 0; i < (dots.length-1); i++) {
					if(((i+1)%opt.gridX) > 0){
				      	let link = {
				        	p0: dots[(i+pls)], 
				        	p1: dots[(i+1)+pls],
				        	len : self._distance(dots[i+pls],dots[(i+1)+pls]),
				        	id : [i+pls,(i+1)+pls]
				      	};
				      	cons.push(link);
				    }
				}
				for (let i = 0; i < (dots.length-opt.gridX); i++) {
					 let link = {
				      p0: dots[i+pls], 
				      p1: dots[(i+opt.gridX)+pls],
				      len : self._distance(dots[i+pls],dots[(i+opt.gridX)+pls]),
				      id : [i+pls,(i+opt.gridX)+pls],
				    };
				    cons.push(link);
				  }
			},
			
		/**
		 *  Create A Rope
		 *	@method Verlet.Poly.cloth()
		 *  @param {object} opt
		 *	@param {number} opt_x
		 *	@param {number} opt_y
		 *	@param {number} opt_gap
		 *	@param {number} opt_segs
		 *	@param {number} opt_pinRatio
 		 *	@param {number} opt_clone
		 *  @param {array} dot
		 *  @param {array} con
		 */	
		cloth : function cloth(opt,dot,con) {
				let dots = dot || this.dots;
				let cons = con || this.cons;
				let clone = opt.clone || 1;
				if(clone !== undefined) {
					for(let i = 0; i < clone; i++) {
						let x = opt.x,
							y = opt.y,
							gap = opt.gap,
							segs = opt.segs;
						let pls = dots.length;
				
						let oldx = x;
						let tmpDots = [];
						let tmpCons = [];
						for (let i = 0; i < segs; i++) {
							for (let j = 0; j < segs; j++) {
								tmpDots.push([
									x,y,x,y
								])
								x += gap;
							}
							x = oldx;
							y += gap;
						}
						for (let j = 0; j < tmpDots.length-1; j++) {
							if( (j+1)%segs > 0 ) {
								tmpCons.push([
									(j)+pls,(j+1)+pls
								])
							}
						}
						for (let j = 0; j < tmpDots.length-segs; j++) {
							tmpCons.push([
								(j)+pls,(j+segs)+pls
							]);
						}
						let pinRatio = opt.pinRatio || 1;
						for (let l = 0; l < segs; l+=pinRatio) {
							tmpDots[l][4] = true;
						}
						if(opt.tearable) {
							self.tearArray.push([tmpCons[0],tmpCons[tmpCons.length-1]]);
						}
						self.create(tmpDots,dots);
						self.clamp(tmpCons,cons,dots);
						tmpDots = [];
						tmpCons = [];
						// return self.tearArray;
					}
				}
		},
		/**
		 * @method Verlet.tearCloth();
		 * @description Work In Progress
		 */
		tearCloth : function(con) {
			let cons = con || this.cons;
			for (let i = 0; i < self.tearArray.length; i++) {
				const t = self.tearArray[i];
				let start = t[0][0];
				let end = t[1][1];
				for (let i = start; i < end; i++) {
						if( ( cons[i].p1.y -  cons[i].p0.y) > 40 ||
						    ( cons[i].p1.x -  cons[i].p0.x) > 20) {
							cons.splice(i,1);
						}
					}
				}
			}
	};

	/** 	
	 *	Interact With Points In Real-Time
	 *	@method Verlet.Interact()
	 *	@param {array} dots
	 *	@param {array} cons
	 *	@param {number} detect
	*/
	this.Interact = {
		hoverPoint : undefined,
		listenerIndex : 0,
		/** Draw The Active Hovered Point */
		draw : function(color) {
			if(this.hoverPoint) {
				self.ctx.beginPath();
				self.ctx.strokeStyle = color || 'white';
				self.ctx.arc(this.hoverPoint.x,this.hoverPoint.y,8,0,Math.PI*2);
				self.ctx.stroke();
				self.ctx.closePath();
			}
		},
		/** Interact with hovered point */
		move : function(dots,color) {
			const parent = this;
			let theDot;
			let ox,oy;
			let index;
			let region = 30;
			let isMouseDown = false;
			/** Add event listners for the first time only */ 
			parent.listenerIndex++;
			let addOnce = true;
			if(parent.listenerIndex > 1) {
				addOnce = false;
			}

			/** Detect Nearby Points */
			function moveListner(e){
				if(isMouseDown === false) {
					parent.hoverPoint = undefined;
					index = null;
					ox = e.offsetX,
					oy = e.offsetY;
					for(let i = 0; i < dots.length; i++) {
						if(colDetect(ox,oy,dots[i]) < region) {
							parent.hoverPoint = dots[i];
							index = i;
						}
					}
					self.handle = parent.hoverPoint;
					self.handleIndex = index;	
				}
			}
			self.canvas.onmousemove = function(e) {
				moveListner(e);
			};
			/**  MOVE  */
			let pointOffsetX = null, 
				pointOffsetY = null,
				isDetected = false;
				self.canvas.onmousedown = function(e){
					if(self.handle) {
						self.canvas.addEventListener('mousemove',mouseMove);
						self.canvas.addEventListener('mouseup',mouseUp);
						pointOffsetX = ox - self.handle.x;
						pointOffsetY = oy - self.handle.y;
						if(!self.handle.pinned) {
							self.handle.pinned = true;
						}
						isMouseDown = true;
					}
				};
				document.body.onkeydown = function(e) {
					if(parent.hoverPoint) {
						if(e.which === 32) { //Space
							parent.hoverPoint.pinned = true;
							parent.hoverPoint.color = 'crimson';
						}
						if(e.which === 18) { //ALT
							e.preventDefault();
							parent.hoverPoint.pinned = false;
							parent.hoverPoint.color = color || 'black';
						}
					}
				};
			function mouseMove(e) {
				if(self.handle) {
					self.handle.x = e.offsetX - pointOffsetX;
					self.handle.y =	e.offsetY - pointOffsetY;
					self.handle.oldx = self.handle.x;
					self.handle.oldy = self.handle.y;
				}
			}
			function mouseUp() {
				if(self.handle) {
					if(self.handle.color !== 'crimson') {
						self.handle.pinned = false;
					}
					self.canvas.removeEventListener('mousemove',mouseMove);
					self.canvas.removeEventListener('mouseup', mouseUp);
					isMouseDown = false;
				}
			}
			function colDetect(x,y,circle) {
				const dx = x - circle.x;
				const dy = y - circle.y;
				return Math.sqrt(dx*dx + dy*dy);
			}
		}
	};
	
	
	/** 	
	 *	Functions For Drawing In Canvas
	 *	@method Verlet.Draw
	*/
	this.Draw = {
		/** 	
		 *	Create A Circle Or Arc
		 *	@method Verlet.Draw.arc
		 *	@param {number} x
		 *	@param {number} y
		 *	@param {number} radius,
		 *	@param if {string} color,
		 *	@param if {Boolean} bool,
		*/
		arc : function(x,y,radius,color,line,bool) {
			let col = color || 'deepskyblue';
			self.ctx.save();
			self.ctx.beginPath();
			self.ctx.lineWidth = line || 1;
			(bool === false) ? (self.ctx.fillStyle = col) : (self.ctx.strokeStyle = col);
			self.ctx.arc(x,y,radius,0,Math.PI*2);
			(bool === false) ? self.ctx.fill() : self.ctx.stroke();
			self.ctx.closePath();
			self.ctx.restore();
		}
	};

	
	/** 	
	 *	Setup a studio with basic settings
	 *	@method Verlet.Studio
	*/
	this.Studio = {
		/**
		 * initialize studio markups and visuals
		 * @method Verlet.Studio.init();
		 * @param {string} id
		 */
		init : function(id) {
			const div = document.querySelector(id);
			const newdiv = document.createElement('div');
			newdiv.id = 'Verlet-Studio';
			newdiv.innerHTML = `<div class="vls-div" style="width : ` + (self.canvas.width+2) + `px">
							<p>Verlet Settings</p>
								<hr noshade color="white">
								<p>Physic Accuracy , Gravity , Friction</p>
								<input type="number" id="vls-Iterrations" value="20">
								<input type="number" id="vls-gravity" value="1">
								<input type="number" id="vls-friction" value="1">
								<p>Render Options</p>
								<hr noshade color="white">
								<div class="vls-check-container">
									<div class="vls-check"><input type="checkbox" id="vls-dots" checked="true">Dots</div>
									<div class="vls-check"><input type="checkbox" id="vls-lines" checked="true">Lines</div>
									<div class="vls-check"><input type="checkbox" id="vls-hidden-lines" checked="true">Hidden</div>
									<div class="vls-check"><input type="checkbox" id="vls-pointIndex">Index</div>
									<div class="vls-check"><input type="checkbox" id="vls-shapes" checked>Shapes</div>
								</div>
							</div>`;

			let style = `.vls-div {
							font-family : 'Century Gothic';
							box-sizing : border-box;
							padding : 10px;
							color : white;
							background-color: rgba(60,60,60,1);
							padding: 10px;
							border-bottom: 4px solid lightskyblue;
						}
						.vls-div p {
							margin-top: 12px;
							margin-bottom: 12px;
						}
						.vls-check-container {
							width : 100%;
							overflow:auto;
						}
						.vls-check {
							text-align:center;
							margin-right: 10px;
							float: left;
						}
						input {
							padding : 2px;
							width : 31%;
						}`
			
			let studioStyle,studioElt;
			if(document.createStyleSheet) {
				studioStyle = document.createStyleSheet();
			} else {
				let head = document.getElementsByTagName('head')[0];
				studioElt = document.createElement('style');
				head.appendChild(studioElt);
				studioStyle = document.styleSheets[document.styleSheets.length - 1];
			} 
			if(studioElt) {
				studioElt.innerHTML = style;
			} else {
				studioStyle.cssText = style;
			}
			div.appendChild(newdiv);		
		},

		/**
		 * updates studio settings
		 * @method Verlet.Studio.update();
		 * @param {object} opt {}
		 * @param {object} opt_points
		 * @param {object} opt_cons
		 * @param {object} opt_forms
		 * @param {object} option {options : {}}
		 * @param {number} option_pointRadius
		 * @param {string} option_pointColor
		 * @param {number} option_lineWidth
		 * @param {string} option_lineColor
		 * @param {string} option_fontColor
		 * @param {string} option_font
		 * @param {number} option_hiddenLineWidth
		 * @param {string} option_hiddenLineColor
		 */
		update : function(opt) {
			let option;
			if(opt.option === undefined) {
				option = {};
			} else {
				option = opt.option;
			}
			const PhysicsAccuracy = document.getElementById('vls-Iterrations'),
				dotOpt = document.getElementById('vls-dots'),
				LineOpt = document.getElementById('vls-lines'),
				hiddenLineOpt = document.getElementById('vls-hidden-lines'),
				IndexOpt = document.getElementById('vls-pointIndex'),
				shapeOpt = document.getElementById('vls-shapes'),
				gravity = document.getElementById('vls-gravity'),
				friction = document.getElementById('vls-friction');
			
			let color = option.hoverColor || 'black';
			let dotsRadius = option.pointRadius || 5,
				dotsColor = option.pointColor || 'black',
				lineWidth = option.lineWidth || 1,
				lineColor = option.lineColor || 'black',
				fontColor = option.fontColor || 'black',
				hiddenLineWidth = option.hiddenLineWidth || 0.5,
				hiddenLineColor = option.hiddenLineColor || 'red',
				font = option.font || '10px Arial';;
						
			let isRenderLines;
			let isRenderDots;
			let isRenderIndex;
			let isRenderHiddenLines;

			self.gravity = option.gravity || parseFloat(gravity.value) || 0;
			self.friction = parseFloat(friction.value) || 1;

			isRenderDots = (dotOpt.checked === true) ? true : false;
			isRenderLines = (LineOpt.checked === true) ? true : false;
			isRenderHiddenLines = (hiddenLineOpt.checked === true) ? true : false;
			isRenderIndex = (IndexOpt.checked === true) ? true : false;
			
			if(opt.forms) {
				(shapeOpt.checked === true) ? self.renderShapes(opt.forms) : false;
			}

			self.superRender(opt.points,opt.cons,{
				renderDots : isRenderDots,
				renderLines : isRenderLines,
				renderPointIndex : option.renderPointIndex || isRenderIndex,
				renderHiddenLines : isRenderHiddenLines,
				pointRadius : dotsRadius,
				pointColor : dotsColor,
				lineWidth : lineWidth,
				lineColor : lineColor,
				hiddenLineColor : hiddenLineColor,
				hiddenLineWidth : hiddenLineWidth,
				font : font,
			})
			self.superUpdate(opt.points,opt.cons,PhysicsAccuracy.value,{hoverColor : color});
		}
	};


	/** 	
	 *	Simulate Some Basic Motions With Trigonometry
	 *	@method Verlet.Motion
	*/
	this.Motion = {
		/** 	
		 *	Back And Forword In X Axis
		 *	@method Verlet.Motion.occilateX()
		 *	@param {number} o
		 *	@param {number} size
		 *	@param {array} dot
		*/
		occilateX : function(o,size,dot) {
			dot.x = dot.x + Math.cos(o) * size;
		},
		occilateY : function(o,size,dot) {
			dot.y = dot.y + Math.sin(o) * size;
		},

		/** 	
		 *	Create A Circular In X Axis
		 *	@method Verlet.Motion.occilateX()
		 *	@param {number} o
		 *	@param {number} size
		 *	@param {array} dot
		*/
		circular : function(o,size,dot) {
			dot.x = dot.x + Math.cos(o) * size;
			dot.y = dot.y + Math.sin(o) * size;
			dot.oldx = dot.x;
			dot.oldy = dot.y;
		},
		Wave : function(o,size,dot) {
			dot.x = dot.x + (o * Math.sin(Math.cos(o) / Math.PI*180)) * size;
		}
	};


	/** 	
	 *	Simple Collision Detection
	 *	@method Verlet.Collision.Collision
	*/
	this.Collision = {
		/** 	
		 *	Prevent The Verlet Points From Going Inside A Circle
		 *	@method Verlet.Collision.pointToCircle()
		 *	@param {array} dot
		 *	@param {object} c
		*/
		pointToCircle : function(dots,c) {
			for (let i = 0; i < dots.length; i++) {
				let p = dots[i];
				let cdx = p.x - c.x,
					cdy = p.y - c.y;
				let Diff = cdx*cdx + cdy*cdy;
				if(Diff < c.radius*c.radius) {
					let depth = Math.sqrt(c.radius*c.radius / Diff);
					cdx *= depth;
					cdy *= depth;
					p.x = cdx + c.x;
					p.y = cdy + c.y;
				}
			}
		}
	};


	/** 	
	 *	Update Simulations
	 *	@method Verlet.Engine
	*/
	this.Engine = {
		/** 	
		 *	Update Verlet Points And Compute SPEED And OLDSPEED
		 *	@method Verlet.Engine.update()
		 *	@param {array} dots
		*/
		update : function updatePoints(dots) {
			for(let i = 0; i < dots.length; i++) {
					let p = dots[i];
				if(!p.pinned) {	
					let vx = (p.x - p.oldx) * self.friction;
					let vy = (p.y - p.oldy) * self.friction;
					
					p.oldx = p.x;
					p.oldy = p.y;
					p.x += vx;
					p.y += vy;
					p.y += self.gravity;
				}
			}
		},

		/** 	
		 *	Separetly Compute Collision Bounds For Asyn Update
		 *	@method Verlet.Engine.constrain()
		 *	@param {array} dots
		*/
		constrain : function constrainPoints(dots) {
			for (let i = 0; i < dots.length; i++) {
				let p = dots[i];
				if(!p.pinned) {
					let vx = (p.x - p.oldx) * 0.98,
						vy = (p.y - p.oldy) * 0.98;
					//Boundry
					let width = self.canvas.width,
						height = self.canvas.height;
					if(p.x > width) {
						p.x = width;
						p.oldx = p.x + vx * self.bounce;
					} else if(p.x < 0) {
						p.x = 0;
						p.oldx = p.x + vx * self.bounce;
					}
					if(p.y > height) {
						p.y = height;
						p.oldy = p.y + vy * self.bounce;
					} else if(p.y < 0) {
						p.y = 0;
						p.oldy = p.y + vy * self.bounce;
					}
					//BoundryEnd
				}
			}
		},

		/** 	
		 *	====== Verlet Integration ======
		 *  	<<<<<< Algorithm >>>>>>
		 * 
		 * 	Step1 : Compute distance between two points (Pythogoream Theorm)
		 * 			>>>>>>>>>>>>>>>>>>>>>
		 *			Step1 :	|| dx = p1.x - p2.x;
		 *					|| dy = p1.y - p2.y;
		 *					|| distance = Math.sqrt(dx*dx + dy*dy);
		 *			>>>>>>>>>>>>>>>>>>>>>
		 *
		 *	Step2 : Compute the difference between precomputed Length of the points
		 *			and distance of two points (p.len - dist)
		 *			and devide it by distance.
		 *			>>>>>>>>>>>>>>>>>>>>>
		 *			Step2 :	|| difference = (p1.x - p2.x) OR Length - distance / distance;
		 *			>>>>>>>>>>>>>>>>>>>>>
		 *
		 *	Step3 : And To Calculate correctionX and correctionY
		 *			devide the distanceX by 2 and distanceY by 2
		 *			and multiply it by diffrence
		 *			>>>>>>>>>>>>>>>>>>>>>
		 *			Step3 :	|| correctionX = dx / 2 * difference 
		 *					|| correctionY = dy / 2 * difference
		 *			>>>>>>>>>>>>>>>>>>>>>
		 *
		 *	@method Verlet.Engine.bakePhysics()
		 *	@param {array} cons
		*/
		bakePhysics : function VerletPoints(cons) {
			for(let i = 0; i < cons.length; i++) {
				const p = cons[i];
				const dx = (p.p1.x - p.p0.x),
					  dy = (p.p1.y - p.p0.y),
					  dist = Math.sqrt(dx*dx + dy*dy);
				const diffrence = (dist - p.len) / dist;
				const adjustX =  (dx * 0.5 * diffrence) * self.stiffness;
				const adjustY =  (dy * 0.5 * diffrence) * self.stiffness;

				if(!p.p0.pinned) {
					p.p0.x += adjustX;
					p.p0.y += adjustY;
				}
				if(!p.p1.pinned) {
					p.p1.x -= adjustX;
					p.p1.y -= adjustY;
				}
			}
		}
	}
};//Verlet


/* prototypes starts here */

/**
 * @method CORE_PROTOTYPES
**/

/** 	
 *	Clear The Canvas And Set A BackgroundColor
 *	@method Verlet.clear()
 *	@param { if : string} color
 */
Verlet.prototype.clear = function(color) {
	this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
	if(color) {
		this.ctx.fillStyle = color;
		this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
	}
};

/** 	
 *	Push Values In VERLET POINTS
 *	@method Verlet.clear()
 *	@param {array} dots
 *	@param {array} newD
 */
Verlet.prototype.create = function (newD,dots) {
	for(let j = 0; j < newD.length; j++) {
		dots.push({
			x : newD[j][0],
			y : newD[j][1],
			oldx : newD[j][2] || newD[j][0],
			oldy : newD[j][3] || newD[j][1],
			pinned : newD[j][4] ? newD[j][4] : false,
			color : newD[j][5] ? newD[j][5] : null
		});
	}
};

/** 	
 *	Push Values In VERLET CONSTRAINS
 *	@method Verlet.clamp()
 *	@param {array} newJ
 *	@param {array} joints
 *	@param {array} dots
 */
Verlet.prototype.clamp = function(newJ,joints,dots) {
	for(let j = 0; j < newJ.length; j++) {
		joints.push({
			p0 : dots[newJ[j][0]],
			p1 : dots[newJ[j][1]],
			len : this._distance(dots[newJ[j][0]],dots[newJ[j][1]]),
			hidden : newJ[j][2] || false,
			id : [newJ[j][0],newJ[j][1]]
		});
	}
};

/** 	
 *	Push Paths In SHAPES ARRAY FOR CREATING FORMS
 *	@method Verlet.shape()
 *	@param {array} arr
 *	@param {array} forms
 *	@param {array} dots
 *	@param {string} color
 */
Verlet.prototype.shape = function(arr,forms,dots,color) {
	let tmpArr = [];
	let tmpId = [];
	for (let i = 0; i < arr.length; i++) {
		tmpArr.push(dots[arr[i]]);
		tmpId.push(arr[i]);
	}
	forms.push({
		id : tmpId,
		paths : tmpArr,
		color : color
	});
};

/** 	
 *	Simulates And Updates Given Objects
 *	@method Verlet.renderDots()
 *	@param {array} dots
 *	@param {array} cons
 *	@param {number} accu
 */
Verlet.prototype.superUpdate = function(dots,cons,accu,opt) {
	let option;
	if(opt === undefined) {
		option = {};
	} else {
		option = opt;
	}
	let hoverColor = option.hoverColor || 'black';
	this.Engine.update(dots);
	for (let i = 0; i < accu; i++) {
		this.Engine.constrain(dots);
		this.Engine.bakePhysics(cons);
	}
	this.Interact.draw(hoverColor);
};

/*=======================================
 *=========== RENDER PROTOTYPES =========  
/*======================================*/


/** 	
 *	Render Circles At Points
 *	@method Verlet.renderDots()
 *	@param {array} dots
 *	@param {number} radius
 *	@param {string} color
 */
Verlet.prototype.renderDots = function(dots,radius,color) {
	let PI2 = Math.PI*2;
	let rad = radius || 5;
	for (let i = 0; i < dots.length; i++) {
		let p = dots[i];
		if(!p.hidden) {
			this.ctx.beginPath();
			this.ctx.fillStyle = p.color || color || 'black';
			this.ctx.arc(p.x,p.y,rad,0,PI2);
			this.ctx.fill();
			this.ctx.closePath();
		}
	}
};

/**	Render Box At Points Insted Of Circles
 *	@method Verlet.renderDotsAsBox()
 *	@param {array} dots
 *	@param {number} radius
 *	@param {string} color
 */
Verlet.prototype.renderDotsAsBox = function(dots,radius,color) {
	for (let i = 0; i < dots.length; i++) {
		let p = dots[i];
		if(!p.hidden) {
			this.ctx.fillStyle = p.color || color || 'black';
			this.ctx.fillRect(p.x-(radius/2),p.y-(radius/2),radius,radius);
		}
	}
};

/** 	
 *	Render Point Indexes (Debug Pourposes)
 *	@method Verlet.renderPointIndex()
 *	@param {array} dots
 *	@param {string} fonts
 *	@param {string} color
*/
Verlet.prototype.renderPointIndex = function(dots,font,color) {
	let osctx = this.osCanvas.getContext('2d');
	osctx.clearRect(0,0,this.canvas.width,this.canvas.height);
	osctx.font = font || '10px Arial';
	osctx.fillStyle = color || 'black';
	for (let i = 0; i < dots.length; i++) {
		let p = dots[i];
		osctx.fillText(i,p.x-10,p.y-10);
	}
	osctx.fill();
	this.ctx.drawImage(this.osCanvas,0,0);
};

/** 	
 *	Render Given Objects With renderDots(),renderLines(),
 *  renderHiddenLines(), renderPointIndex(); 
 *	@method Verlet.superDebugRender()
 *	@param {array} dots
 *	@param {array} cons
 */
Verlet.prototype.superDebugRender = function(dots,cons) {
	this.renderDots(dots);
	this.renderLines(cons);
	this.renderHiddenLines(cons,0.7,'red');
	this.renderPointIndex(dots);
}

/** 	
 *	Render Lines Between Constrains
 *	@method Verlet.renderLines()
 *	@param {array} cons
 *	@param {number} lineWidth
 *	@param {string} color
*/
Verlet.prototype.renderLines = function(cons,linewidth,color,showHidden) {
	this.ctx.beginPath();
	this.ctx.strokeStyle = (color || 'black')
	this.ctx.lineWidth = linewidth || 1;
	for(let i = 0; i < cons.length; i++) {
		let p = cons[i];
		if(!p.hidden) {
			this.ctx.moveTo(cons[i].p0.x,cons[i].p0.y);
			this.ctx.lineTo(cons[i].p1.x,cons[i].p1.y);
		}
		if(showHidden === true) {
			if(p.hidden) {
				this.ctx.moveTo(cons[i].p0.x,cons[i].p0.y);
				this.ctx.lineTo(cons[i].p1.x,cons[i].p1.y);
			}
		}
	}
	this.ctx.stroke();
	this.ctx.closePath();
}

/** 	
 *	Render Hidden Lines Between Constrains
 *	@method Verlet.renderLines()
 *	@param {array} cons
 *	@param {number} lineWidth
 *	@param {string} color
 */
Verlet.prototype.renderHiddenLines = function(cons,linewidth,color) {
	this.ctx.beginPath();
	this.ctx.strokeStyle = (color || 'red');
	this.ctx.lineWidth = linewidth || 1;
	for(let i = 0; i < cons.length; i++) {
		let p = cons[i];
		if(p.hidden) {
			this.ctx.moveTo(cons[i].p0.x,cons[i].p0.y);
			this.ctx.lineTo(cons[i].p1.x,cons[i].p1.y);
		}
	}
	this.ctx.stroke();
	this.ctx.closePath();
};

/** 	
 *	Render Shapes
 *	@method Verlet.renderShapes()
 *	@param {array} shape
 */
Verlet.prototype.renderShapes = function(shape) {
	for (let i = 0; i < shape.length; i++) {
		this.ctx.beginPath();
		this.ctx.fillStyle = shape[i].color;
		this.ctx.moveTo(shape[i].paths[0].x,shape[i].paths[0].y);
		for(let j = 1; j < shape[i].paths.length; j++) {
			this.ctx.lineTo(shape[i].paths[j].x,shape[i].paths[j].y);
		}
		this.ctx.fill();
		this.ctx.closePath();
	}
};

/**
 * updates studio settings
 * @method Verlet.superRender();
 * @param {object} dots []
 * @param {object} cons []
 * @param {object} opt {}
 * @hr ===============
 * @param {number} opt_pointRadius
 * @param {string} opt_pointColor
 * @param {number} opt_lineWidth
 * @param {string} opt_lineColor
 * @param {string} opt_fontColor
 * @param {string} opt_font
 * @param {number} opt_hiddenLineWidth
 * @param {string} opt_hiddenLineColor
 * @hr ===============
 * @param {boolean} opt_renderDots = true
 * @param {boolean} opt_renderDotsAsBox = false
 * @param {boolean} opt_renderPointHiddelLInes = false
 * @param {boolean} opt_renderLines = true
 * @param {boolean} opt_renderPointIndex = false
 */
Verlet.prototype.superRender = function (dots,cons,opt) {
	// optional settings if undefined set to {}
	let option;
	option = (!opt) ? {} : opt; 

	//variables
	let dotsRadius,dotsColor,
		font,fontColor,
		lineWidth,lineColor,
		hiddenLineWidth,hiddenLineColor,
		preset = option.preset;

	// conditional variables
	let renderDots = option.renderDots;
	let renderDotsAsBox = option.renderDotsAsBox || false;
	let renderLines = option.renderLines;
	let renderPointIndex = option.renderPointIndex || false;
	let renderHiddenLines = option.renderHiddenLines || false;

	if(renderDots === undefined) {renderDots = true};
	if(renderLines === undefined) {renderLines = true};

	function setPreset(pr,pcol,lw,lc,f,fc,hlw,hlc) {
		dotsRadius = option.pointRadius || pr;
		dotsColor = option.pointColor || pcol;
		lineWidth = option.lineWidth || lw;
		lineColor = option.lineColor || lc;
		font = option.font || f;
		fontColor = option.fontColor || fc;
		hiddenLineWidth = option.hiddenLineWidth || hlw;
		hiddenLineColor = option.hiddenLineColor || hlc;
	}
	//Setup and load presets
	const load = {
		default : [5,'black',0.5,'black','10px Arial','black',0.5,'red'],
		shadowBlue : [5,'white',0.5,'deepskyblue','10px Century Gothic','limegreen',0.5,'oragered'],
		shadowRed : [5,'#ff5b5b',0.5,'#ff2e2e','10px Century Gothic','slategray', 0.5,'green'],
		shadowPink : [5,'hotpink',0.5,'mediumpurple','10px Century Gothic','slategray',0.5,'green']
	}
	setPreset.apply(null,load[preset]);
	if(!preset) {
		setPreset.apply(null,load['default']);
	}

	// is {debug : true}
	if(option.debug) {
		renderPointIndex = option.renderPointIndex || true;
		renderHiddenLines = option.renderHiddenLines || true;
	}

	//render main
	if(renderDots) {
		//if point length is greater than 2000 then render boxes
		if(renderDotsAsBox) {
			this.renderDotsAsBox(dots,dotsRadius,dotsColor);
		} else {
			if(dots.length > 2000) {
				this.renderDotsAsBox(dots,dotsRadius,dotsColor);
			} else {
				this.renderDots(dots,dotsRadius,dotsColor);
			}
		}
	}
	if(renderHiddenLines) {
		this.renderHiddenLines(cons,hiddenLineWidth,hiddenLineColor);
	}
	if(renderLines){
		this.renderLines(cons,lineWidth,lineColor);
	}
	if(renderPointIndex) {
		this.renderPointIndex(dots,font,fontColor);
	}
};