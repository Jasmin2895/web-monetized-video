var VideoFrame = function(options) {
    console.log("videoFrame objects", options, this)
	if (this === window) { return new VideoFrame(options); }
	this.obj = options || {};
	this.frameRate = this.obj.frameRate || 24;
	this.video = document.getElementById(this.obj.id) || document.getElementsByTagName('video')[0];
};

/**
 * FrameRates - Industry standard frame rates
 *
 * @namespace
 * @type {Object}
 * @property {Number} film - 24
 * @property {Number} NTSC - 29.97
 * @property {Number} NTSC_Film - 23.98
 * @property {Number} NTSC_HD - 59.94
 * @property {Number} PAL - 25
 * @property {Number} PAL_HD - 50
 * @property {Number} web - 30
 * @property {Number} high - 60
 */
var FrameRates = {
	film: 24,
	NTSC : 29.97,
	NTSC_Film: 23.98,
	NTSC_HD : 59.94,
	PAL: 25,
	PAL_HD: 50,
	web: 30,
	high: 60
};

VideoFrame.prototype = {
	get : function() {        
		return Math.floor(this.video.currentTime.toFixed(5) * this.frameRate);
	},
	listen : function(format, tick) {
		var _video = this;
		if (!format) { console.log('VideoFrame: Error - The listen method requires the format parameter.'); return; }
		this.interval = setInterval(function() {
			console.log("setInterval")
			if (_video.video.paused || _video.video.ended) { return; }
			var frame = ((format === 'SMPTE') ? _video.toSMPTE() : ((format === 'time') ? _video.toTime() : _video.get()));
			if (_video.obj.callback) { _video.obj.callback(frame, format); }
			return frame;
		}, (tick ? tick : 1000 / _video.frameRate / 2));
	},
	stopListen : function() {
		var _video = this;
		clearInterval(_video.interval);
	},
	fps : FrameRates
};

VideoFrame.prototype.toTime = function(frames) {
	var time = (typeof frames !== 'number' ? this.video.currentTime : frames), frameRate = this.frameRate;
	var dt = (new Date()), format = 'hh:mm:ss' + (typeof frames === 'number' ? ':ff' : '');
	dt.setHours(0); dt.setMinutes(0); dt.setSeconds(0); dt.setMilliseconds(time * 1000);
	function wrap(n) { return ((n < 10) ? '0' + n : n); }
	return format.replace(/hh|mm|ss|ff/g, function(format) {
		switch (format) {
			case "hh": return wrap(dt.getHours() < 13 ? dt.getHours() : (dt.getHours() - 12));
			case "mm": return wrap(dt.getMinutes());
			case "ss": return wrap(dt.getSeconds());
			case "ff": return wrap(Math.floor(((time % 1) * frameRate)));
		}
	});
};

VideoFrame.prototype.toSMPTE = function(frame) {
	if (!frame) { return this.toTime(this.video.currentTime); }
	var frameNumber = Number(frame);
	var fps = this.frameRate;
	function wrap(n) { return ((n < 10) ? '0' + n : n); }
	var _hour = ((fps * 60) * 60), _minute = (fps * 60);
	var _hours = (frameNumber / _hour).toFixed(0);
	var _minutes = (Number((frameNumber / _minute).toString().split('.')[0]) % 60);
	var _seconds = (Number((frameNumber / fps).toString().split('.')[0]) % 60);
	var SMPTE = (wrap(_hours) + ':' + wrap(_minutes) + ':' + wrap(_seconds) + ':' + wrap(frameNumber % fps));
	return SMPTE;
};

VideoFrame.prototype.toSeconds = function(SMPTE) {
	if (!SMPTE) { return Math.floor(this.video.currentTime); }
	var time = SMPTE.split(':');
	return (((Number(time[0]) * 60) * 60) + (Number(time[1]) * 60) + Number(time[2]));
};

VideoFrame.prototype.toMilliseconds = function(SMPTE) {
	var frames = (!SMPTE) ? Number(this.toSMPTE().split(':')[3]) : Number(SMPTE.split(':')[3]);
	var milliseconds = (1000 / this.frameRate) * (isNaN(frames) ? 0 : frames);
	return Math.floor(((this.toSeconds(SMPTE) * 1000) + milliseconds));
};

VideoFrame.prototype.toFrames = function(SMPTE) {
	var time = (!SMPTE) ? this.toSMPTE().split(':') : SMPTE.split(':');
	var frameRate = this.frameRate;
	var hh = (((Number(time[0]) * 60) * 60) * frameRate);
	var mm = ((Number(time[1]) * 60) * frameRate);
	var ss = (Number(time[2]) * frameRate);
	var ff = Number(time[3]);
	return Math.floor((hh + mm + ss + ff));
};

VideoFrame.prototype.__seek = function(direction, frames) {
	if (!this.video.paused) { this.video.pause(); }
	var frame = Number(this.get());
	this.video.currentTime = ((((direction === 'backward' ? (frame - frames) : (frame + frames))) / this.frameRate) + 0.00001);
};

VideoFrame.prototype.seekForward = function(frames, callback) {
	if (!frames) { frames = 1; }
	this.__seek('forward', Number(frames));
	return (callback ? callback() : true);
};

VideoFrame.prototype.seekBackward = function(frames, callback) {
	if (!frames) { frames = 1; }
	this.__seek('backward', Number(frames));
	return (callback ? callback() : true);
};

VideoFrame.prototype.seekTo = function(config) {
	var obj = config || {}, seekTime, SMPTE;
	var option = Object.keys(obj)[0];

	if (option == 'SMPTE' || option == 'time') {
		SMPTE = obj[option];
		seekTime = ((this.toMilliseconds(SMPTE) / 1000) + 0.001);
		this.video.currentTime = seekTime;
		return;
	}

	switch(option) {
		case 'frame':
			SMPTE = this.toSMPTE(obj[option]);
			seekTime = ((this.toMilliseconds(SMPTE) / 1000) + 0.001);
			break;
		case 'seconds':
			seekTime = Number(obj[option]);
			break;
		case 'milliseconds':
			seekTime = ((Number(obj[option]) / 1000) + 0.001);
			break;
	}
	
	if (!isNaN(seekTime)) {
		this.video.currentTime = seekTime;
	}
};

export default VideoFrame;