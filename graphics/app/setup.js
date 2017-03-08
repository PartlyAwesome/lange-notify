/* eslint-disable no-var */
var bgs;
var label;
/* eslint-enable no-var */

(function () {
	'use strict';

	// Create the canvas element that will become the render target.
	// EaselJS calls this a "stage".
	const containerEl = document.getElementById('container');
	const stageEl = document.createElement('canvas');
	stageEl.id = 'notification';
	stageEl.width = 992;
	stageEl.height = 100;
	containerEl.appendChild(stageEl);

	const SLANT = 20;

	// Store some important coordinates we'll be needing later.
	const midX = stageEl.width / 2;
	const maxX = stageEl.width - SLANT;
	const maxY = stageEl.height;

	// Create the stage on the target canvas, and create a ticker that will render at 60 fps.
	const stage = new createjs.Stage('notification');
	createjs.Ticker.addEventListener('tick', event => {
		if (event.paused) {
			return;
		}

		bgs.forEach(bg => {
			// The two left side x values. Will be inverted to get right side x values.
			const tipX = Math.min(-(bg.width / 2), 0);
			const baseX = Math.min(-(bg.width / 2) + SLANT, 0);

			// Start at top left point, moves clockwise
			bg.graphics
				.clear()
				.beginFill(bg.color)
				.moveTo(baseX, 0)
				.lineTo(-baseX, 0)
				.lineTo(-tipX, maxY / 2)
				.lineTo(-baseX, maxY)
				.lineTo(baseX, maxY)
				.lineTo(tipX, maxY / 2)
				.closePath();
		});

		stage.update();
	});
	createjs.Ticker.framerate = 60;
	createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;

	const bgContainer = new createjs.Container();
	stage.addChild(bgContainer);

	// Create the three background elements
	const bg3 = new createjs.Shape();
	bg3.name = 'bg3';
	bg3.maxWidth = maxX;
	bg3.width = 0;
	bg3.x = midX;
	bgContainer.addChild(bg3);

	const bg2 = new createjs.Shape();
	bg2.name = 'bg2';
	bg2.maxWidth = maxX - 23;
	bg2.width = 0;
	bg2.x = midX;
	bgContainer.addChild(bg2);

	const bg1 = new createjs.Shape();
	bg1.name = 'bg1';
	bg1.maxWidth = maxX - 54;
	bg1.width = 0;
	bg1.x = midX;
	bgContainer.addChild(bg1);

	// Put all the background elements into an array to make the stagger tweens a bit easier to write
	bgs = [bg1, bg2, bg3];

	// Create the text element
	label = new createjs.Text('SUBSCRIBER', '800 65px proxima-nova', '#F7F2E8');
	label.x = midX;
	label.showY = 11;
	label.hideY = 0;
	label.y = label.hideY;
	label.textAlign = 'center';
	label.mask = bg1;
	label.maxWidth = bg1.maxWidth - (SLANT * 3);
	stage.addChild(label);
})();
