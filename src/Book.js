var Book = {
	pages : [],
	canvas : null,
	context : null,
	holder : null,
	pageHolder : null,
	currentIndex : 0,
	CANVAS_WIDTH : 0,
	CANVAS_HEIGHT : 0,
	CANVAS_PADDING : 60,
	mouse : {
		startX : 0,
		startY : 0,
		x : 0,
		y : 0
	},
	drag : {
		side : "",
		index : 0
	},
	toRemove : null,
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
		//this.holder.style.border = "1px solid #e4e4e4";

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
		this.context = this.canvas.getContext('2d');
		this.canvas.style.width = (this.CANVAS_WIDTH * 2) + (this.CANVAS_PADDING * 2 ) + "px";
		this.canvas.width = (this.CANVAS_WIDTH * 2) + (this.CANVAS_PADDING * 2 );
		this.canvas.style.height = (this.CANVAS_HEIGHT) + (this.CANVAS_PADDING * 2 ) + "px";
		this.canvas.height = (this.CANVAS_HEIGHT + (this.CANVAS_PADDING * 2 ));
		this.canvas.style.position = "absolute";
		this.canvas.style.top = -this.CANVAS_PADDING + "px";
		this.pageHolder.appendChild(this.canvas);
	},
	setPage : function(page, side, w) {
		// page.style.border = "1px solid #e4e4e4";
		page.style.position = "absolute";
		page.style.overflow = "hidden";
		page.style.backgroundColor = "#fff";
		page.style.top = "0px";
		page.childNodes[0].style.left = "0px";
		page.style.width = w != undefined ? w : this.CANVAS_WIDTH + "px";
		page.style.left = (side == "LEFT" ? 0 : this.CANVAS_WIDTH) + "px";
		this.pageHolder.appendChild(page);
	},
	removePage : function() {
		if (!this.toRemove || this.hasChild(this.toRemove))
			return;
		this.pageHolder.removeChild(this.toRemove);
		Book.toRemove = null;
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
		if (Book.mouse.x < 0)
			Book.mouse.x = 0;

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
		Book.pages[Book.drag.index].style.zIndex = "3";
		Book.pages[Book.drag.index].style.border = "0px solid #e4e4e4";
		Book.pages[Book.drag.index].style.left = Book.mouse.x + "px";
		//set currentpage width
		Book.pages[Book.drag.index - 1].style.width = cw + "px";
		Book.drawFlip(w / Book.CANVAS_WIDTH, w);
	},
	movePageLeft : function() {
		//set new page width and pos
		if (Book.mouse.x > (Book.CANVAS_WIDTH ))
			Book.mouse.x = (Book.CANVAS_WIDTH );
		var w = ((Book.mouse.x / (Book.CANVAS_WIDTH ))) * Book.CANVAS_WIDTH;
		var cw = Book.CANVAS_WIDTH - w;
		Book.pages[Book.drag.index].style.width = w + "px";
		Book.pages[Book.drag.index].style.zIndex = "3";
		Book.pages[Book.drag.index].style.left = Book.mouse.x + "px";
		//set currentpage width
		Book.pages[Book.drag.index + 1].style.width = cw + "px";
		Book.pages[Book.drag.index + 1].style.left = Book.mouse.x + "px";
		Book.pages[Book.drag.index+1].childNodes[0].style.left = -Book.mouse.x + "px";
		Book.drawFlip(w / Book.CANVAS_WIDTH, w);
	},
	onMouseDown : function(event) {
		Book.context.clearRect(0, 0, Book.canvas.width, Book.canvas.height);
		TweenLite.ticker.removeEventListener("tick", Book.onTweenTicker);
		Book.mouse.startX = Utensil.mouseX(Book.holder, event);
		Book.mouse.startY = Utensil.mouseY(Book.holder, event);
		Book.mouse.x = Utensil.mouseX(Book.holder, event);
		Book.mouse.y = Utensil.mouseY(Book.holder, event);
		if (Book.pages[Book.drag.index])
			Book.pages[Book.drag.index].style.zIndex = "3";
		Book.drag.index = Book.currentIndex;
		if (Book.mouse.startX > Book.CANVAS_WIDTH) {
			Book.drag.index += 2;
			if (Book.currentIndex == 0)
				Book.drag.index = 1;
			//page below
			Book.setNextPage(Book.drag.index + 1, "RIGHT");
			//dragging page
			Book.setDragPageRight();
			Book.drag.side = "RIGHT";
		} else {
			if (Book.currentIndex == 0)
				return;
			Book.drag.index--;
			//set bottom page
			if (Book.currentIndex > 1)
				Book.setNextPage(Book.drag.index + 1, "LEFT");
			Book.setDragPageLeft();
			Book.drag.side = "LEFT";
		}
		Utensil.addListener(document, "mousemove", Book.onMouseMove, false);
		Utensil.addListener(document, "mouseup", Book.onMouseUp, false);

	},
	setDragPageRight : function() {
		//set the z-index
		Book.pages[Book.drag.index - 1].style.zIndex = "2";
		if (Book.pages[Book.drag.index + 1])
			Book.pages[Book.drag.index + 1].style.zIndex = "1";

		Book.setNextPage(Book.drag.index, "RIGHT", 0);
	},
	setDragPageLeft : function() {
		//Book.pages[Book.drag.index].style.zIndex="2";
		Book.setNextPage(Book.drag.index, "LEFT", 0);
	},
	onMouseUp : function(event) {
		Utensil.removeListener(document, "mousemove", Book.onMouseMove, false);
		Utensil.removeListener(document, "mouseup", Book.onMouseUp, false);
		//console.log(Book.mouse.x, Book.mouse.startX);
		if (Book.mouse.x == Book.mouse.startX)
			return;
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
			TweenLite.killTweensOf(Book.pages[Book.drag.index - 1]);

			TweenLite.to(Book.pages[Book.drag.index], 1, {
				css : {
					left : (Book.CANVAS_WIDTH * 2) + "px",
					width : 0 + "px"
				},
				onComplete : Book.onRightComplete
			});

			TweenLite.to(Book.pages[Book.drag.index - 1], 1, {
				css : {
					width : Book.CANVAS_WIDTH + "px"
				}
			});
		} else {
			Book.toRemove = Book.pages[Book.drag.index - 1];
			TweenLite.to(Book.pages[Book.drag.index], 1, {
				css : {
					left : 0 + "px",
					width : Book.CANVAS_WIDTH + "px"
				}
			});
			TweenLite.to(Book.pages[Book.drag.index - 1], 1, {
				css : {
					width : 0 + "px"
				},
				onComplete : Book.onRightComplete
			});
			Book.currentIndex = Book.drag.index;
		}
		TweenLite.ticker.addEventListener("tick", Book.onTweenTicker);

	},
	onTweenTicker:function()
	{
		if(!Book.hasChild(Book.pages[Book.drag.index]))return;
		Book.mouse.x = Number(Book.pages[Book.drag.index].style.left.replace("px",""));
		var w=0;
		switch(Book.drag.side)
		{
			case "LEFT":
			w = ((Book.mouse.x / (Book.CANVAS_WIDTH ))) * Book.CANVAS_WIDTH;
			break;
			case "RIGHT":
			w = (1 - (Book.mouse.x / (Book.CANVAS_WIDTH * 2))) * Book.CANVAS_WIDTH;
			break;
		}
		Book.drawFlip(w / Book.CANVAS_WIDTH, w);
	},
	animateLeftPage : function() {
		TweenLite.killTweensOf(Book.pages[Book.drag.index]);
		if (Book.mouse.x > Book.CANVAS_WIDTH * 0.5) {
			Book.toRemove = Book.pages[Book.drag.index + 1] ? Book.pages[Book.drag.index + 1] : null;

			TweenLite.to(Book.pages[Book.drag.index], 1, {
				css : {
					left : (Book.CANVAS_WIDTH ) + "px",
					width : Book.CANVAS_WIDTH + "px"
				},
				onComplete : Book.onRightComplete
			});
			if (Book.pages[Book.drag.index + 1]) {
				TweenLite.killTweensOf(Book.pages[Book.drag.index + 1]);
				TweenLite.to(Book.pages[Book.drag.index + 1], 1, {
					css : {
						left : (Book.CANVAS_WIDTH ) + "px",
						width : 0 + "px"
					}
				});
			}
			Book.currentIndex = Book.drag.index - 1;

		} else {
			TweenLite.killTweensOf(Book.pages[Book.drag.index + 1]);
			TweenLite.killTweensOf(Book.pages[Book.drag.index+1].childNodes[0]);
			Book.toRemove = Book.pages[Book.drag.index];
			TweenLite.to(Book.pages[Book.drag.index], 1, {
				css : {
					left : 0 + "px",
					width : 0 + "px"
				}
			});
			TweenLite.to(Book.pages[Book.drag.index + 1], 1, {
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
		TweenLite.ticker.addEventListener("tick", Book.onTweenTicker);
	},
	onRightComplete : function() {
		Book.context.clearRect(0, 0, Book.canvas.width, Book.canvas.height);
		TweenLite.ticker.removeEventListener("tick", Book.onTweenTicker);
		Book.removePage();
	},
	setNextPage : function(index, side, w) {
		if (!this.pages[index])
			return;
		Book.setPage(this.pages[index], side, w);
	},
	drawFlip : function(progress, foldWidth) {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		Book.canvas.style.zIndex = "4";
		Book.pages[Book.drag.index].style.zIndex = "5";
		// Strength of the fold is strongest in the middle of the book
		var strength = 1 - progress;

		// // How far the page should outdent vertically due to perspective
		var verticalOutdent = 20 * strength;

		// // The maximum width of the left and right side shadows
		var paperShadowWidth = (Book.CANVAS_WIDTH * 0.5 ) * Math.max(Math.min(1 - progress, 0.5), 0);
		var rightShadowWidth = (Book.CANVAS_WIDTH * 0.5 ) * Math.max(Math.min(strength, 0.5), 0);
		var leftShadowWidth = (Book.CANVAS_WIDTH * 0.5 ) * Math.max(Math.min(strength, 0.5), 0);

		Book.context.save();
		Book.context.translate(0, this.CANVAS_PADDING);

		// // Draw a sharp shadow on the left side of the page
		this.context.strokeStyle = 'rgba(0,0,0,' + (0.05 * strength) + ')';
		this.context.lineWidth = 30 * strength;
		this.context.beginPath();
		this.context.moveTo(Book.mouse.x, -verticalOutdent * 0.5);
		this.context.lineTo(Book.mouse.x, Book.CANVAS_HEIGHT + (verticalOutdent * 0.5));
		this.context.stroke();

		// Right side drop shadow
		var rightShadowGradient = this.context.createLinearGradient(Book.mouse.x + foldWidth, 0, Book.mouse.x + foldWidth + rightShadowWidth, 0);
		rightShadowGradient.addColorStop(0, 'rgba(0,0,0,' + (strength * 0.2) + ')');
		rightShadowGradient.addColorStop(0.8, 'rgba(0,0,0,0.0)');

		this.context.fillStyle = rightShadowGradient;
		this.context.beginPath();
		this.context.moveTo(Book.mouse.x + foldWidth, 0);
		this.context.lineTo(Book.mouse.x + foldWidth + rightShadowWidth, 0);
		this.context.lineTo(Book.mouse.x + foldWidth + rightShadowWidth, Book.CANVAS_HEIGHT);
		this.context.lineTo(Book.mouse.x + foldWidth, Book.CANVAS_HEIGHT);
		this.context.fill();

		// Left side drop shadow
		var leftShadowGradient = this.context.createLinearGradient(Book.mouse.x - leftShadowWidth, 0, Book.mouse.x, 0);
		leftShadowGradient.addColorStop(0, 'rgba(0,0,0,0.0)');
		leftShadowGradient.addColorStop(1, 'rgba(0,0,0,' + (strength * 0.15) + ')');

		this.context.fillStyle = leftShadowGradient;
		this.context.beginPath();
		this.context.moveTo(Book.mouse.x - leftShadowWidth, 0);
		this.context.lineTo(Book.mouse.x, 0);
		this.context.lineTo(Book.mouse.x, Book.CANVAS_HEIGHT);
		this.context.lineTo(Book.mouse.x - leftShadowWidth, Book.CANVAS_HEIGHT);
		this.context.fill();

		// Gradient applied to the folded paper (highlights & shadows)
		var foldGradient = Book.context.createLinearGradient(Book.mouse.x - paperShadowWidth, 0, Book.mouse.x, 0);
		foldGradient.addColorStop(0.35, '#fafafa');
		foldGradient.addColorStop(0.73, '#eeeeee');
		foldGradient.addColorStop(0.9, '#fafafa');
		foldGradient.addColorStop(1.0, '#e2e2e2');

		Book.context.fillStyle = "#fff";
		Book.context.strokeStyle = 'rgba(0,0,0,0.06)';
		Book.context.lineWidth = 0.5;

		// Draw the folded piece of paper
		Book.context.beginPath();
		Book.context.moveTo(Book.mouse.x, 0);
		Book.context.lineTo(Book.mouse.x, Book.CANVAS_HEIGHT);
		Book.context.quadraticCurveTo(Book.mouse.x, Book.CANVAS_HEIGHT + (verticalOutdent * 2), Book.mouse.x + foldWidth, Book.CANVAS_HEIGHT + verticalOutdent);
		Book.context.lineTo(Book.mouse.x + foldWidth, -verticalOutdent);
		Book.context.quadraticCurveTo(Book.mouse.x, -verticalOutdent * 2, Book.mouse.x, 0);
		Book.context.fill();
		Book.context.stroke();

		Book.context.restore();

	},
	isEven : function(value) {
		if (value % 2 == 0)
			return true;
		else
			return false;
	}
};
