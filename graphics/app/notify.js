(function () {
	'use strict';

	// Permanent GSAP timeline
	const tl = new TimelineLite({autoRemoveChildren: true});
	const label = window.label;
	const bgs = window.bgs;

	// Dope constants.
	const DELAY_INCREMENT = 0.09;
	const SUB_COLORS = [
		'#e87933',
		'#f6ce14',
		'#6bba82'
	];
	const TIP_COLORS = [
		'#6bba82',
		'#e87933',
		'#f6ce14'
	];
	const FIRST_MSG_FONT = '800 65px proxima-nova';
	const SECOND_MSG_FONT = '800 65px proxima-nova';

	nodecg.listenFor('subscription', 'lfg-nucleus', data => {
		let firstMsg = 'NEW SUBSCRIBER';
		if (data.resub) {
			firstMsg = `RESUB × ${data.months}`;
		}

		notify(firstMsg, data.name, {
			colors: SUB_COLORS,
			inSound: 'sub'
		});
	});

	nodecg.listenFor('tip', 'lfg-nucleus', tip => {
		// Got a tip from StreamTip
		notify(`${tip.formattedAmount} TIP`, truncateTo25(tip.name), {
			colors: TIP_COLORS,
			inSound: 'tip'
		});
	});

	nodecg.listenFor('cheer', 'lfg-nucleus', cheer => {
		// Got a cheer from Twitch
		notify(`${cheer.formattedAmount} BITS`, truncateTo25(cheer.name), {
			colors: TIP_COLORS,
			inSound: 'tip'
		});
	});

	function notify(firstMsg, secondMsg, opts) {
		firstMsg = firstMsg.toUpperCase();
		secondMsg = secondMsg.toUpperCase();
		opts = opts || {};
		opts.colors = opts.colors || SUB_COLORS;

		const reverseBgs = bgs.slice(0).reverse();
		const foremostBg = bgs[0];
		let delay = 0;

		// Animate in
		tl.add('npIn');

		tl.call(() => {
			const len = bgs.length;
			for (let i = 0; i < len; i++) {
				bgs[i].color = opts.colors[i];
			}
			nodecg.playSound(opts.inSound);
		}, null, null, 'npIn');

		reverseBgs.forEach(bg => {
			tl.to(bg, 0.75, {
				width: bg.maxWidth,
				ease: Elastic.easeOut.config(0.3, 0.4)
			}, `npIn+=${delay}`);
			delay += DELAY_INCREMENT;
		});

		tl.to(label, 0.6, {
			onStart() {
				label.font = FIRST_MSG_FONT;
				label.text = firstMsg;
			},
			y: label.showY,
			ease: Back.easeOut.config(4),
			autoRound: false
		}, `npIn+=${delay - DELAY_INCREMENT}`);

		// Show second message
		tl.to(foremostBg, 0.6, {
			onStart() {
				nodecg.playSound('cut');
			},
			width: 0,
			ease: Elastic.easeIn.config(0.3, 0.4),
			onComplete() {
				label.font = SECOND_MSG_FONT;
				label.text = secondMsg;
			}
		}, '+=1.5');

		tl.to(foremostBg, 0.6, {
			width: foremostBg.maxWidth,
			ease: Elastic.easeOut.config(0.3, 0.4)
		}, '+=0.01');

		// Animate out
		delay = 0;

		tl.add('npOut', '+=4');
		tl.call(() => {
			nodecg.playSound('out');
		}, null, null, 'npOut');
		bgs.forEach(bg => {
			tl.to(bg, 0.7, {
				width: 0,
				ease: Elastic.easeIn.config(0.3, 0.4)
			}, `npOut+=${delay}`);
			delay += DELAY_INCREMENT;
		});

		tl.to(label, 0.467, {
			y: label.hideY,
			ease: Power2.easeIn
		}, `npOut+=${delay}`);

		// Kill time between successive notifications
		tl.to({}, 1, {});
	}

	function truncateTo25(text) {
		const len = text.length;
		if (len > 25) {
			let truncated = text.substring(0, 23);
			truncated += '…';
			return truncated;
		}

		return text;
	}
})();
