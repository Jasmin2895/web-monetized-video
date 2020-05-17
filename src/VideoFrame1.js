import { __esModule } from "react-bootstrap/lib/utils/bootstrapUtils";

const FrameRates = {
	film: 24,
	NTSC : 29.97,
	NTSC_Film: 23.98,
	NTSC_HD : 59.94,
	PAL: 25,
	PAL_HD: 50,
	web: 30,
	high: 60
};

export default class VideoFrame1  {
    constructor(options) {
        if (this === window) { return new VideoFrame1(options); }
        this.obj = options || {};
        this.frameRate = this.obj.frameRate || 24;
        this.video = document.getElementsByClassName("video") || document.getElementsByTagName('video')[0];
        console.log("videoFrame inside", this.video.length,document.getElementsByClassName("video_source"), document.getElementsByTagName("video").length)

    }

    get() {
		return Math.floor(this.video.currentTime.toFixed(5) * this.frameRate);
    }
    
    listen(format, tick) {
		var _video = this;
		if (!format) { console.log('VideoFrame: Error - The listen method requires the format parameter.'); return; }
		this.interval = setInterval(function() {
			if (_video.video.paused || _video.video.ended) { return; }
			var frame = ((format === 'SMPTE') ? _video.toSMPTE() : ((format === 'time') ? _video.toTime() : _video.get()));
			if (_video.obj.callback) { _video.obj.callback(frame, format); }
			return frame;
		}, (tick ? tick : 1000 / _video.frameRate / 2));
    }
    
    stopListen() {
		var _video = this;
		clearInterval(_video.interval);
	}
    fps=FrameRates
    
    toTime(frames) {
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
    }

    toSMPTE(frame) {
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
    }

    toSeconds(SMPTE) {
        var frames = (!SMPTE) ? Number(this.toSMPTE().split(':')[3]) : Number(SMPTE.split(':')[3]);
        var milliseconds = (1000 / this.frameRate) * (isNaN(frames) ? 0 : frames);
        return Math.floor(((this.toSeconds(SMPTE) * 1000) + milliseconds));
    }

    toFrames(SMPTE) {
        var time = (!SMPTE) ? this.toSMPTE().split(':') : SMPTE.split(':');
        var frameRate = this.frameRate;
        var hh = (((Number(time[0]) * 60) * 60) * frameRate);
        var mm = ((Number(time[1]) * 60) * frameRate);
        var ss = (Number(time[2]) * frameRate);
        var ff = Number(time[3]);
        return Math.floor((hh + mm + ss + ff));
    }

    __seek(direction, frames) {
        if (!this.video.paused) { this.video.pause(); }
        var frame = Number(this.get());
        /** To seek forward in the video, we must add 0.00001 to the video runtime for proper interactivity */
        this.video.currentTime = ((((direction === 'backward' ? (frame - frames) : (frame + frames))) / this.frameRate) + 0.00001);
    }

    seekForward(frames, callback) {
        if (!frames) { frames = 1; }
        this.__seek('forward', Number(frames));
        return (callback ? callback() : true);
    }

    seekBackward(frames, callback) {
        if (!frames) { frames = 1; }
        this.__seek('backward', Number(frames));
        return (callback ? callback() : true);
    }

    seekTo(config) {
        var obj = config || {}, seekTime, SMPTE;
	/** Only allow one option to be passed */
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
    }
}