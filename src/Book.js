var Book = {
	pages : [],
	canvas : null,
	holder : null,
	pageHolder : null,
	currentIndex : 0,
	CANVAS_WIDTH : 0,
	CANVAS_HEIGHT : 0,
	mouse : {
		startX : 0,
		startY : 0,
		x : 0,
		y : 0
	},
	drag : {
		side : "",
		index:0
	},
	toRemove:null,
	init : function() {
		this.getPages();
		this.setBook();
		this.buildCanvas();
		this.addListeners();
		this.showPage(this.currentIndex);
	},
	getPages : function() {
		this.holder = document.getElementById("book");
		if (!this.holder)
			return;

		//get page width and height
		this.CANVAS_WIDTH = this.holder.clientWidth;
		this.CANVAS_HEIGHT = this.holder.clientHeight;

		//set book size
		this.holder.style.width = (this.CANVAS_WIDTH * 2) + "px";
		this.holder.style.border = "1px solid #e4e4e4";

		for (var a = 0; a < this.holder.childNodes.length; a++) {
			var pageContainer;
			var child = this.holder.childNodes[a];
			if (child.tagName == 'DIV') {
				pageContainer = document.createElement("div");
				this.holder.removeChild(child);
				child.style.width = this.CANVAS_WIDTH + "px";
				child.style.position = "absolute";
				pageContainer.appendChild(child);
				this.pages.push(pageContainer);
			}
		}
	},
	setBook : function() {
		this.pageHolder = document.createElement("div");
		this.pageHolder.style.width = (this.CANVAS_WIDTH * 2) + "px";
		this.pageHolder.style.height = this.CANVAS_HEIGHT + "px";
		this.pageHolder.style.position = "relative";
		this.holder.appendChild(this.pageHolder);
	},
	buildCanvas : function() {
		if (!this.holder)
			return;
		this.canvas = document.createElement("canvas");
		if (window.G_vmlCanvasManager)
			G_vmlCanvasManager.initElement(this.canvas);
		this.canvas.style.width = (this.CANVAS_WIDTH * 2) + "px";
		this.canvas.style.height = this.CANVAS_HEIGHT + "px";
		this.canvas.style.position = "absolute";
		this.holder.appendChild(this.canvas);
	},
	setPage : function(page, side, w) {
		page.style.border = "1px solid #e4e4e4";
		page.style.position = "absolute";
		page.style.overflow = "hidden";
		page.style.backgroundColor = "#fff";
		page.style.top = "0px";
		page.childNodes[0].style.left = "0px";
		page.style.width = w!=undefined ? w : this.CANVAS_WIDTH + "px";
		page.style.left = (side == "LEFT" ? 0 : this.CANVAS_WIDTH) + "px";
		this.pageHolder.appendChild(page);
	},
	removePage : function() {
		if (!this.toRemove|| this.hasChild(this.toRemove))
			return;
		this.pageHolder.removeChild(this.toRemove);
		Book.toRemove =null;
	},
	hasChild : function(page) {
		for (var a = 0; a < this.pageHolder.childNodes.length; a++) {
			if (this.pageHolder.childNodes[a] == page)
				return true;
		}
		return false;
	},
	showPage : function(index) {
		var page = this.pages[index];
		var side = this.isEven(index) ? "RIGHT" : "LEFT";
		if (side == "RIGHT" && this.pages[index + 2]) {
			this.setPage(this.pages[index + 2], "RIGHT");
		}
		this.setPage(page, side);

	},
	addListeners : function() {

		Utensil.addListener(this.holder, "mousedown", this.onMouseDown, false);

	},
	onMouseMove : function(event) {
		Book.mouse.x = Utensil.mouseX(Book.holder, event);
		Book.mouse.y = Utensil.mouseY(Book.holder, event);
		if(Book.mouse.x<0)Book.mouse.x=0;
		
		
		if (Book.drag.side == "RIGHT") {
			Book.movePageRight();
		} else {
			Book.movePageLeft();
		}
	},
	movePageRight : function() {
		//set new page width and pos
		var w = (1 - (Book.mouse.x / (Book.CANVAS_WIDTH * 2))) * Book.CANVAS_WIDTH;
		var cw = ((Book.mouse.x / (Book.CANVAS_WIDTH * 2))) * Book.CANVAS_WIDTH;
		Book.pages[Book.drag.index].style.width = w + "px";
		Book.pages[Book.drag.index].style.zIndex="3";
		Book.pages[Book.drag.index].style.left = Book.mouse.x + "px";
		//set currentpage width
		Book.pages[Book.drag.index-1].style.width = cw + "px";
		
		
	},
	movePageLeft : function() {
		//set new page width and pos
		if(Book.mouse.x>(Book.CANVAS_WIDTH ))Book.mouse.x=(Book.CANVAS_WIDTH );
		var w = ((Book.mouse.x / (Book.CANVAS_WIDTH ))) * Book.CANVAS_WIDTH;
		var cw = Book.CANVAS_WIDTH -w;
		Book.pages[Book.drag.index].style.width = w + "px";
		Book.pages[Book.drag.index].style.zIndex="3";
		Book.pages[Book.drag.index].style.left = Book.mouse.x + "px";
		//set currentpage width
		Book.pages[Book.drag.index+1].style.width = cw + "px";
		Book.pages[Book.drag.index+1].style.left = Book.mouse.x + "px";
		Book.pages[Book.drag.index+1].childNodes[0].style.left = -Book.mouse.x + "px";
	},
	onMouseDown : function(event) {
		Book.mouse.startX = Utensil.mouseX(Book.holder, event);
		Book.mouse.startY = Utensil.mouseY(Book.holder, event);
		Book.mouse.x = Utensil.mouseX(Book.holder, event);
		Book.mouse.y = Utensil.mouseY(Book.holder, event);
		console.log(Book.currentIndex);
			Book.drag.index = Book.currentIndex;
		if (Book.mouse.startX > Book.CANVAS_WIDTH) {
			Book.drag.index+=2;
			if(Book.currentIndex==0)Book.drag.index=1;
			//page below
			Book.setNextPage(Book.drag.index+1, "RIGHT");
			//dragging page
			Book.setDragPageRight();
			Book.drag.side = "RIGHT";
		} else {
			if(Book.currentIndex==0)return;
			Book.drag.index--;
			//set bottom page
			if(Book.currentIndex > 1)Book.setNextPage(Book.drag.index-1, "LEFT");
			Book.setDragPageLeft();
			Book.drag.side = "LEFT";
		}
		Utensil.addListener(document, "mousemove", Book.onMouseMove, false);
		Utensil.addListener(document, "mouseup", Book.onMouseUp, false);
		
	},
	setDragPageRight : function() {
		//set the z-index
		Book.pages[Book.drag.index-1].style.zIndex="2";
		if(Book.pages[Book.drag.index +1])Book.pages[Book.drag.index +1].style.zIndex="1";
		console.log("dragging Index",Book.drag.index);
		Book.setNextPage(Book.drag.index, "RIGHT",0);
	},
	setDragPageLeft : function() {
		Book.pages[Book.drag.index].style.zIndex="2";
		Book.setNextPage(Book.drag.index, "LEFT",0);
	},
	onMouseUp : function(event) {
		Utensil.removeListener(document, "mousemove", Book.onMouseMove, false);
		Utensil.removeListener(document, "mouseup", Book.onMouseUp, false);
		console.log(Book.mouse.x,Book.mouse.startX );
		if(Book.mouse.x==Book.mouse.startX )return;
		switch(Book.drag.side) {
			case "LEFT":
			
			Book.animateLeftPage();
				break;
			case "RIGHT":
				Book.animateRightPage();
				
				break;
		}
		
	},
	animateRightPage : function() {
		if (Book.mouse.x > Book.CANVAS_WIDTH) {
			Book.toRemove = Book.pages[Book.drag.index];
			TweenLite.killTweensOf(Book.pages[Book.drag.index]);
			TweenLite.killTweensOf(Book.pages[Book.drag.index-1]);
			
			TweenLite.to(Book.pages[Book.drag.index],1,{css:{left:(Book.CANVAS_WIDTH * 2)+"px",width:0+"px"},onComplete:Book.onRightComplete});
			
			TweenLite.to(Book.pages[Book.drag.index-1], 1, {
				css : {
					width : Book.CANVAS_WIDTH + "px"
				}
			});
		} else {
			Book.toRemove = Book.pages[Book.drag.index-1];
			TweenLite.to(Book.pages[Book.drag.index], 1, {
				css : {
					left : 0 + "px",
					width : Book.CANVAS_WIDTH + "px"
				}
			});
			TweenLite.to(Book.pages[Book.drag.index-1], 1, {
				css : {
					width : 0 + "px"
				},
				onComplete : Book.onRightComplete
			});
			Book.currentIndex=Book.drag.index;
		}
	},
	animateLeftPage : function() {
		if (Book.mouse.x > Book.CANVAS_WIDTH *0.5) {
			Book.toRemove = Book.pages[Book.drag.index+1]?Book.pages[Book.drag.index+1]:null;
			
			TweenLite.to(Book.pages[Book.drag.index],1,{css:{left:(Book.CANVAS_WIDTH )+"px",width:Book.CANVAS_WIDTH+"px"},onComplete:Book.onRightComplete});
			if(Book.pages[Book.drag.index+1])TweenLite.to(Book.pages[Book.drag.index+1],1,{css:{left:(Book.CANVAS_WIDTH )+"px",width:0+"px"}});
			Book.currentIndex=Book.drag.index;
			
		} else {
			Book.toRemove = Book.pages[Book.drag.index];
			TweenLite.to(Book.pages[Book.drag.index], 1, {
				css : {
					left : 0 + "px",
					width : 0 + "px"
				}
			});
			TweenLite.to(Book.pages[Book.drag.index+1], 1, {
				css : {
					left : 0 + "px",
					width : Book.CANVAS_WIDTH + "px"
				},
				onComplete : Book.onRightComplete
			});
			TweenLite.to(Book.pages[Book.drag.index+1].childNodes[0], 1, {
				css : {
					left : 0 + "px",
					width : Book.CANVAS_WIDTH + "px"
				}
			});
			
		}
	},
	onRightComplete : function() {
		Book.removePage();
	},
	setNextPage : function(index, side,w) {
		if(!this.pages[index])return;
		Book.setPage(this.pages[index], side, w);
	},
	render : function() {

	},
	isEven : function(value) {
		if (value % 2 == 0)
			return true;
		else
			return false;
	}
};
