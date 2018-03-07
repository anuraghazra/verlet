// Verlet-Drawing UI
"use strict";
initUI();
function initUI() {
	//uiu dropdown
	let isDown = false;
	uiu.dropdown({
		on : 'mousedown',
		off : 'mouseleave',
		parent : '.toolbar',
		childs : '.dd-button',
		content : '.dropdown-content',
		timer : 1200,
		dispatch : '#c',
		dispatchEvt : 'mousedown',
		effect : 'fadeSlide',
		effectStyles : {
			'top' : ['200%','32px']
		}
	},function(is) {
		isDown = is;
		let inputs = this.querySelectorAll('input, button');
		for (let i = 0; i < inputs.length; i++) {
			inputs[i].blur();
		}
	});
	
	//hide contextmenu when dropdown is clicked
	uiu.setOn('mousedown','.toolbar',function(){
		const childs = uiu.query('.radialMenu > i',true);
		uiu.addClass('.radialMenu','hideRadialMenu');
		uiu.addClass('.radialMenuCenter','noEvent');
		for (let i = 0; i < childs.length; i++) {
			uiu.addClass(childs[i],'noEvent');
		}
	})

	//wooSlider
	uiu.wooSlider({
		parent : '.toolbar',
		childs : '.dd-button',
		offset : {
			x : -1
		}
	});

	//peekPop
	function peekPop() {
		uiu.eventDelegate({
			on : 'mouseover',
			parent : '.titleinfo-hover',
			find : '.dd-button',
			all : true,
			noOverwrite : true
		},function(target,p){
			let pop = p.querySelector('.firstmenu');
			if(!isDown) {
				uiu.setStyle(pop,{'top' : '40px'});
			}
			uiu.on('mouseleave',p,function(){
				uiu.setStyle(pop,{'top' : '0px'});
			})
			uiu.on('click','.toolbar',function() {
				uiu.setStyle(pop,{'top' : '0px'});
			})
		});
	}
	peekPop()

	//statusbar info
	uiu.eventDelegate({
		parent : '.toolbar',
		find : 'div.dd-button',
		noOverwrite : true
	},function(target,p){
		let data = target.closest('[data-name], [data-tooltip]');
		let statusText = uiu.id('statusbar');
		statusText.innerText = data.getAttribute('data-name') ||
							   data.getAttribute('data-tooltip');
	});

	
	//tooltips
	uiu.tooltip({
		parent : '#pin-point',
		content : 'Create With Pinned Dots',
		contentClass : 'uiuTooltip',
		offset : {
			x : -80,
			y : 30
		}
	});
	uiu.tooltip({
		parent : '#line-hidden',
		content : 'Create With Hidden Lines',
		contentClass : 'uiuTooltip',
		offset : {
			x : -80,
			y : 30
		}
	});
	uiu.tooltip({
		parent : '#auto-join',
		content : 'Auto Join From Selected First And Last Point',
		contentClass : 'uiuTooltip',
		offset : {
			x : -80,
			y : 30
		}
	});


	//help modal
	uiu.modal({
		on : 'scroll',
		parent : '.toolbar',
		toggle : '.helpModal',
		in : ['top','0%','20%']
	})


	//file info
	let fileinfo = uiu.id('fileinfo');
	let file = uiu.id('loadPoints');
	file.onchange = function () {
		let filedata = this.files[0];
		fileinfo.innerHTML = '<p>File Name : ' + filedata.name + '</p>' +
							 '<p>File Size : ' + Math.ceil(filedata.size / 1024) + 'kb</p>'
	}

	//debug panle
	function debug(dots, cons, fps, verlet) {
		const debugEnb = uiu.id('debug-enable'),
			debugPanel = uiu.id('debugpanel'),
			debugOut = uiu.id('debug-out'),
			consOut = uiu.id('debug-out-cons');
		debugOut.innerText = ' Points : ' + dots.length
							+ ' | Constrains : ' + cons.length
							+ ' | Handle Index : ' + verlet.handleIndex
							+ ' | FPS : ' + fps;
	}

	function fullSrc() {
		const doc = document.body;
		if (doc.webkitRequestFullScreen) {
			doc.webkitRequestFullScreen();
		}
		if (doc.mozRequestFullScreen) {
			doc.mozRequestFullScreen();
		}
	}
	
	
	/*
		Return To Global namespace 
	*/
	initUI.debug = debug;
	initUI.fullSrc = fullSrc;
}
