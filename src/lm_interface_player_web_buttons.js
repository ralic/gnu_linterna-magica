//  @licstart The following is the entire license notice for the
//  JavaScript code in this page (or file).
//
//  This file is part of Linterna Mágica
//
//  Copyright (C) 2010, 2011  Ivaylo Valkov <ivaylo@e-valkov.org>
//  Copyright (C) 2010  Anton Katsarov <anton@katsarov.org>
//
//  The JavaScript code in this page (or file) is free software: you
//  can redistribute it and/or modify it under the terms of the GNU
//  General Public License (GNU GPL) as published by the Free Software
//  Foundation, either version 3 of the License, or (at your option)
//  any later version.  The code is distributed WITHOUT ANY WARRANTY
//  without even the implied warranty of MERCHANTABILITY or FITNESS
//  FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
//
//  As additional permission under GNU GPL version 3 section 7, you
//  may distribute non-source (e.g., minimized or compacted) forms of
//  that code without the copy of the GNU GPL normally required by
//  section 4, provided you include this license notice and a URL
//  through which recipients can access the Corresponding Source.
//
//  @licend The above is the entire license notice for the JavaScript
//  code in this page (or file).
//
// @source http://linterna-magica.nongnu.org

// END OF LICENSE HEADER

// Create web controls
LinternaMagica.prototype.create_controls = function(object_data)
{
    var id= object_data.linterna_magica_id;

    var controls = document.createElement("div");
    controls.setAttribute("class", "linterna-magica-controls");

    var self =this;

    var started_clip = this.find_started_clip();

    var play = document.createElement("a");
    play.setAttribute("class", "linterna-magica-controls-buttons "+
		      "linterna-magica-controls-buttons-play");
    play.setAttribute("href", "#");
    play.setAttribute("title", this._("Play"));
    play.textContent ="Pl";
    // Only pause button should be visible on autostart
    // Auto start only if no other clip is playing.
    if (this.autostart && started_clip == null)
    {
	play.style.setProperty("display", "none", "important");
    }

    var play_click_function = function(ev)
    {
    	ev.preventDefault();

	this.style.setProperty("display", "none", "important");

	this.nextSibling.style.removeProperty("display");

    	self.player.play.apply(self, [id]);

	// Start the time ticker
	self.player_timers[id] = setInterval(
	    function()
	    {
		self.ticker.apply(self, [id]);
	    }, 500);
    };

    play.addEventListener("click", play_click_function, false);
    controls.appendChild(play);

    var pause = document.createElement("a");
    pause.setAttribute("class", "linterna-magica-controls-buttons "+
		       "linterna-magica-controls-buttons-pause");
    pause.setAttribute("href", "#");
    pause.setAttribute("title", this._("Pause"));
    pause.textContent ="Pa";
    // Only play button should be visible if !autostart or another
    // clip is strated.
    if (!this.autostart || started_clip !== null)
    {
	pause.style.setProperty("display", "none", "important");
    }

    var pause_click_function = function(ev)
    {
    	ev.preventDefault();
	this.style.
	    setProperty("display", "none", "important");

	this.previousSibling.style.removeProperty("display");

    	self.player.pause.apply(self, [id]);

	// Stop the time ticker
	clearInterval(self.player_timers[id]);
	delete self.player_timers[id];
    };

    pause.addEventListener("click", pause_click_function, false);
    controls.appendChild(pause);

    var stop = document.createElement("a");
    stop.setAttribute("class", "linterna-magica-controls-buttons "+
		      "linterna-magica-controls-buttons-stop");
    stop.setAttribute("href", "#");
    stop.setAttribute("title", this._("Stop"));
    stop.textContent ="St";

    var stop_click_function = function(ev)
    {
    	ev.preventDefault();
	// pause
	this.previousSibling.style.setProperty("display", 
					       "none", "important");
	// play button
	var play = this.previousSibling.previousSibling;
	play.style.removeProperty("display");

    	self.player.stop.apply(self, [id]);

	// Stop the time ticker
	clearInterval(self.player_timers[id]);
	delete self.player_timers[id];
    };

    stop.addEventListener("click", stop_click_function, false);
    controls.appendChild(stop);

    var time_slider = document.createElement("div");
    time_slider.setAttribute("title", this._("Time"));

    time_slider.setAttribute("class",
			     "linterna-magica-controls-horizontal-slider");

    // The slider width is calculated from
    // the object width.  We have 6 buttons
    // (width + border +padding +
    // margin). Remove the padding, margin,
    // border for each slider (2) : 2*x (
    // padding + border + margin)
    // The time slider uses 3/4 of the space
    var time_width = parseInt(((object_data.width - (4 * 21)) * 3/4)-12);
    time_slider.style.setProperty("width",
				  time_width+"px",
				  "important");

    time_slider.style.setProperty("position", "relative", "important");

    var mouse_scroll = /WebKit/i.test(navigator.userAgent) ?
	"mousewheel" : "DOMMouseScroll";

    var time_slider_scroll_function = function(ev)
    {
	ev.preventDefault();
	var pos = self.slider_control.apply(self, [ev]);

	if (pos.direction > 0)
	{
	    self.player.forward.apply(self,[id,pos.val]);
	}
	else
	{
	    self.player.rewind.apply(self,[id,pos.val]);
	}
    };

    time_slider.addEventListener(mouse_scroll, 
				 time_slider_scroll_function, false);

    var time_slider_click_function =  function(ev)
    {
	ev.preventDefault();
	// Stop the time ticker
	clearInterval(self.player_timers[id]);
	delete self.player_timers[id];

	var pos =  self.slider_control.apply(self, [ev]);

	if (pos.direction > 0)
	{
	    self.player.forward.apply(self,[id,pos.val]);
	}
	else
	{
	    self.player.rewind.apply(self,[id,pos.val]);
	}

	self.player_timers[id] = setInterval(
	    function()
	    {
		self.ticker.apply(self,[id]);
	    }, 500);
    };

    time_slider.addEventListener("click", time_slider_click_function, false);

    var time_knob_move = null;

    if (this.languages[this.lang].__direction == "ltr" ||
	this.languages[this.lang].__direction !== "rtl")
    {
	time_knob_move = "left";
    }
    else if (this.languages[this.lang].__direction == "rtl")
    {
	time_knob_move = "right";
    }

    var time_knob = document.createElement("a");
    time_knob.setAttribute("title", this._("Time"));
    time_knob.setAttribute("class", "linterna-magica-controls-slider-knob");
    time_knob.setAttribute("id",
			   "linterna-magica-controls-time-slider-knob-"+id);
    time_knob.style.setProperty(time_knob_move, "0px", "important");

    time_knob.setAttribute("href", "#");
    time_knob.addEventListener("mousedown", function(ev)
			       {
				   ev.preventDefault();
				   // Stop the time ticker
				   clearInterval(self.player_timers[id]);
				   delete self.player_timers[id];

				   self.slider_control.apply(self, [ev]);
			       }, false);

    time_slider.appendChild(time_knob);

    var time_text = document.createElement("span");
    time_text.style.display = "none";
    time_text.setAttribute("class", "linterna-magica-controls-slider-text");
    time_text.setAttribute("id",
			   "linterna-magica-controls-time-slider-text-"+id);
    time_text.textContent="--:--:--";
    time_text.style.setProperty("left",
				parseInt(time_width/2)+"px",
				"important");

    time_slider.appendChild(time_text);
    controls.appendChild(time_slider);


    // Appended after volume_knob. See below
    var volume_text = document.createElement("span");

    var volume_slider = document.createElement("div");
    volume_slider.setAttribute("class",
			       "linterna-magica-controls-horizontal-slider");
    volume_slider.setAttribute("title", this._("Volume control"));

    // The slider width is calculated from
    // the object width.  We have 6 buttons
    // (width + border +padding +
    // margin) Remove the padding, margin,
    // border for each slider (2) : 2 * x (
    // padding + border + margin)
    // The volume slider uses 1/4 of the space
    var volume_width = parseInt(((object_data.width - (4 * 21)) * 1/4)-12);
    volume_slider.style.setProperty("width",
				    volume_width+"px",
				    "important");

    var volume_slider_scroll_function = function(ev)
    {
	ev.preventDefault();
	var pos = self.slider_control.apply(self, [ev]);

	self.player.set_volume.apply(self, [id, pos.val]);

	volume_text.textContent = pos.val;
    };

    volume_slider.addEventListener(mouse_scroll,
				   volume_slider_scroll_function, false);

    var volume_slider_click_function = function(ev)
    {
	ev.preventDefault();
	var pos = self.slider_control.apply(self, [ev]);

	self.player.set_volume.apply(self, [id, pos.val]);

	volume_text.textContent = pos.val;
    };

    volume_slider.addEventListener("click",
				   volume_slider_click_function, false);

    var volume_knob_move = null;

    if (this.languages[this.lang].__direction == "ltr" ||
	this.languages[this.lang].__direction !== "rtl")
    {
	volume_knob_move = "left";
    }
    else if (this.languages[this.lang].__direction == "rtl")
    {
	volume_knob_move = "right";
    }

    var volume_knob = document.createElement("a");
    volume_knob.setAttribute("class", "linterna-magica-controls-slider-knob");
    volume_knob.setAttribute("id",
			     "linterna-magica-controls-volume-slider-knob-"+id);
    // If this is enabled it crops the css image
    // Fixes the knob width for small object widths
    // volume_knob.style.setProperty("width",
    // 				  parseInt(volume_width*10/100)+"px",
    // 				  "important");
    volume_knob.style.setProperty(volume_knob_move, "0px", "important");
    volume_knob.setAttribute("href", "#");
    volume_knob.setAttribute("title", this._("Volume control"));
    volume_knob.addEventListener("mousedown", function(ev)
				 {
				     ev.preventDefault();
				     self.slider_control.apply(self, [ev]);
				 }, false);

    volume_slider.appendChild(volume_knob);

    controls.appendChild(volume_slider);

    volume_text.setAttribute("class",
			     "linterna-magica-controls-slider-text");

    volume_text.style.setProperty("left",
				  parseInt(volume_width/3)+"px",
				  "important");

    volume_text.textContent = "--";
    volume_slider.appendChild(volume_text);

    var mute = document.createElement("a");
    mute.setAttribute("class", "linterna-magica-controls-buttons "+
		      "linterna-magica-controls-buttons-mute");
    mute.setAttribute("href", "#");
    mute.setAttribute("title", this._("Mute"));
    mute.textContent ="M";

    var mute_click_function = function(ev)
    {
	ev.preventDefault();
	var volume =
	    self.player.toggle_mute.apply(self,[id]);

	if (/M/i.test(mute.textContent))
	{
	    mute.textContent = "U";
	    mute.setAttribute("title", self._.apply(self, ["Unmute"]));

	    mute.setAttribute(
		"class",
		"linterna-magica-controls-buttons "+
		    "linterna-magica-controls-"+
		    "buttons-unmute");

	    volume_text.textContent = "0%";
	    volume_text.setAttribute("title",
				     self._.apply(self, ["Muted"]));
	    volume_slider.setAttribute("title",
				       self._.apply(self, ["Muted"]));
	    volume_knob.setAttribute("title",
				     self._.apply(self, ["Muted"]));
	}
	else
	{
	    mute.textContent = "M";
	    mute.setAttribute("title", self._.apply(self, ["Mute"]));
	    volume_text.textContent = volume;

	    volume_text.removeAttribute("title");
	    mute.setAttribute(
		"class",
		"linterna-magica-controls-buttons "+
		    "linterna-magica-controls-"+
		    "buttons-mute");

	    volume_slider.
		setAttribute("title",
			     self._.apply(self, ["Volume control"]));
	    volume_knob.
		setAttribute("title",
			     self._.apply(self, ["Volume control"]));
	}
    };

    mute.addEventListener("click", mute_click_function, false);
    controls.appendChild(mute);

    var fullscreen = document.createElement("a");
    fullscreen.setAttribute(
	"class", "linterna-magica-controls-buttons "+
	    "linterna-magica-controls-buttons-fullscreen");
    fullscreen.setAttribute("href", "#");
    fullscreen.setAttribute("title", this._("Fullscreen"));
    fullscreen.textContent ="Fs";

    var fullscreen_click_function = function(ev)
    {
    	ev.preventDefault();
    	self.player.fullscreen.apply(self, [id]);
    };
    				
    fullscreen.addEventListener("click",
				fullscreen_click_function, false);
    controls.appendChild(fullscreen);

    return controls;
}
