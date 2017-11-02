(function() {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];

	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
			window[vendors[x] + 'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	}

	if (!window.cancelAnimationFrame) {
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
	}
})();


function extend(object) {
	var objects = Array.prototype.slice.call(arguments, 1);
	var length = arguments.length;
	var index = 0;
	var merge = function(index) {
		if (typeof objects[index] == 'object') {
			Object.keys(objects[index]).forEach(function(key) {
				object[key] = objects[index][key];
			});
		}
	};
	for (; index < length; index++) {
		merge(index);
	}
	return object;
}


let doScroll = function(position, options) {
	var start = Date.now();
	var scrollTop = window.pageYOffset;
	var scroll = function(timestamp) {
		var currentTime = Date.now();
		var time = Math.min(1, ((currentTime - start) / options.duration));
		var easedT = options.easing(time);
		window.scrollTo(0, (easedT * (position - scrollTop)) + scrollTop);
		if (time < 1) {
			requestAnimationFrame(scroll);
		} else if (typeof options.callback === 'function') {
			options.callback();
		}
	};

	if (scrollTop === position) {
		if (typeof options.callback === 'function') {
			options.callback();
		}
		return; // Prevent scrolling to the Y point if already there
	}

	requestAnimationFrame(scroll);
};

function scroller(id, opt) {
	var scrollTop = window.pageYOffset;
	var options = scroller.defaults;
	var position = 0;
	var height = 0;
	var time = 0;

	if (typeof opt === 'object') {
		extend(options, opt);
	}

	if (typeof id === 'number') {
		position = id - options.offset;
	} else if (typeof id === 'string') {
		id = document.querySelector(id);
	}

	if (typeof id === 'object') {
		try {
			position = Math.round(id.getBoundingClientRect().top + scrollTop);
		} catch (error) {
			position = 0;
		}
	}

	position += options.offset;

	if (!options.animate) {
		window.scrollTo(0, position);
		return;
	}
	height = position < scrollTop ? scrollTop - position : position - scrollTop;
	time = height * options.msPerPixel;
	time = Math.min(time, options.maxRange);
	time = Math.max(time, options.minRange);
	options.duration = time;

	doScroll(position, options);
}

scroller.defaults = {
	animate    : true,  // Animiere Scrolling
	msPerPixel : 0.5,   // Wie viele ms pro Pixel
	minRange   : 400,   // Minimale Animationszeit
	maxRange   : 1500,  // Maximale Animationszeit
	offset     : 0,     // Offset (z.B. wegen Navigationsbar)
	easing     : function(t) { return t < 0.5 ? 2 * t  * t  : -1 + (4 - 2 * t) * t; }, // easeInOutQuad,
	callback   : null   // möglicher Callback
};

module.exports = scroller;
