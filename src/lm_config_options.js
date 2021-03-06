//  @licstart The following is the entire license notice for the
//  JavaScript code in this page (or file).
//
//  This file is part of Linterna Mágica
//
//  Copyright (C) 2010, 2011, 2012 Ivaylo Valkov <ivaylo@e-valkov.org>
//  Copyright (C) 2010, 2013, 2014 Ivaylo Valkov <ivaylo@e-valkov.org>
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
// @source http://linternamagica.org

// END OF LICENSE HEADER

// Set cookies processing. See "A note on cookies".
LinternaMagica.prototype.set_cookies = function(cookies)
{
    // delete | restore
    var set_cookies_to = cookies ? cookies :"";

    if (!cookies ||
	(!/delete/i.test(cookies) &&
	 !/restore/i.test(cookies)))
    {
	set_cookies_to = "delete";
    }

    this.process_cookies = set_cookies_to;
}

// Check configuration options and set the types of controls
// for the video plugin (web/plguin control)
LinternaMagica.prototype.set_controls = function(controls)
{
    // self || plugin
    var set_controls_to;

    // If not valid value force to self
    if (!controls ||
	(!/plugin/i.test(controls) &&
	 !/self/i.test(controls)))
    {
	set_controls_to = false;
    }

    if (/plugin/i.test(controls))
    {
	set_controls_to=false;
    }

    if (/self/i.test(controls))
    {
	set_controls_to=true;
    }

    this.controls = set_controls_to;
}

// Check configuration options and set if
// playback should start on object creation
LinternaMagica.prototype.set_autostart = function(autostart)
{
    var start = autostart ? autostart : true;

    if (!autostart ||
	(!/enabled/i.test(autostart) && 
	 !/disabled/i.test(autostart) &&
	 !/on/i.test(autostart) &&
	 !/off/i.test(autostart) &&
	 !/true/i.test(autostart) &&
	 !/false/i.test(autostart)))
    {
	start = false;
    }

    if (/enabled/i.test(autostart) ||
	/on/i.test(autostart) ||
	/true/i.test(autostart))
    {
	start = true;
    }

    if (/disabled/i.test(autostart)
	|| /off/i.test(autostart)
	|| /false/i.test(autostart))
    {
	start = false;
    }

    this.autostart = start;
}

// Set the timeout for Dailymotion. After this timeout background
// processing starts
LinternaMagica.prototype.set_wait_xhr = function(wait)
{
    var set_wait_to = wait ? wait :"";

    if (!wait ||
	(typeof(wait) != "number" &&
	 !/[0-9]+/i.test(wait) &&
	 !/false/i.test(wait) &&
	 !/no/i.test(wait) &&
	 !/off/i.test(wait) &&
	 !/disabled/i.test(wait)))
    {
	// Realy ?
	set_wait_to = 1500;
    }

    if ( /false/i.test(wait) ||
	 /no/i.test(wait) ||
	 /off/i.test(wait) ||
	 /disabled/i.test(wait))
    {
	set_wait_to = 0;
    }

    if (/[0-9]+/i.test(wait))
    {
	set_wait_to = parseInt(wait);
    }

    this.wait_xhr = set_wait_to;
}

// Set updates 
LinternaMagica.prototype.set_check_updates = function(updates)
{
    var set_updates_to = updates ? updates : "";

    if (!updates ||
	(!/^[0-9]+(d|w|m||y)$/i.test(updates) &&
	 !/false/i.test(updates) &&
	 !/no/i.test(updates) &&
	 !/off/i.test(updates) &&
	 !/disabled/i.test(updates) &&
	 !/never/i.test(updates)))
    {
	set_updates_to = "3w";
    }

    if ((/false/i.test(updates) ||
	 /no/i.test(updates) ||
	 /off/i.test(updates) ||
	 /disabled/i.test(updates) ||
	 /never/i.test(updates)) ||
	// Don't accept raw numbers
	updates >= 0)
    {
	set_updates_to = -1;
    }

    this.updates = set_updates_to;
}

// Set the language to the user preferred or the env (provided by the
// browser)
LinternaMagica.prototype.set_locale = function(locale)
{
    // See lm_localisation.js
    this.set_env_lang();

    if (/auto/i.test(locale))
    {
	locale = this.env_lang;
    }

    // In case the country code is lowercase and the language code is
    // upper case
    if (/.*_.*/.test(locale))
    {
	locale = locale.split(/_/);
	locale[locale.length-1] = 
	    locale[locale.length-1].toUpperCase();

	locale[0] = 
	    locale[0].toLowerCase();
    
	locale = locale.join("_");
    }

    var set_lang_to = locale ? locale : this.env_lang;

    if (!set_lang_to ||
	!/[a-z][a-z]_[A-Z][A-Z]/i.test(set_lang_to) ||
	this.languages[set_lang_to] == undefined)
    {
	set_lang_to = "C";
    }

    this.lang = set_lang_to;
}

// Set the preferred video quality 
LinternaMagica.prototype.set_hd_link_quality = function(quality)
{
    var set_quality_to = quality ? quality : "low";
    var err = null;
    
    if (!/^(low|medium|high|[0-9]+|[0-9.,]+%|[0-9]+p)$/i.test(set_quality_to) ||
	/^low$/i.test(set_quality_to))
    {
	// Low
	set_quality_to = -0.33;
    }
    else if (/^medium$/i.test(set_quality_to))
    {
	// Medium
	set_quality_to = -0.66;
    }
    else if (/^high$/i.test(set_quality_to))
    {
	// High
	set_quality_to = -1;
    }
    else if (/^[0-9]+$/i.test(set_quality_to))
    {
	// Set to link number
	set_quality_to = parseInt(set_quality_to);
	if (!set_quality_to)
	{
	    err = 1;
	}
    }
    else if (/^[0-9.,]+%$/i.test(set_quality_to))
    {
	// parseFloat accepts only "." for separator.
	set_quality_to = set_quality_to.replace(/,/g,".");

	// Set to percent
	set_quality_to = - parseFloat(set_quality_to)/100;
	if (isNaN(set_quality_to))
	{
	    err = 1;
	}
    }

    if (err) 
    {
	// Low
	set_quality_to = -0.33;
    }

    this.preferred_hd_quality = set_quality_to;
}

LinternaMagica.prototype.set_web_log_expand = function(web_log_expand)
{
    if (/true/i.test(web_log_expand))
    {
	web_log_expand = true;
    }
    else if (/false/i.test(web_log_expand))
    {
	web_log_expand = false;
    }

    this.web_log_expand = web_log_expand;
}

LinternaMagica.prototype.set_format = function(format)
{
    if (!/^(webm|flv|mp4|3gp|h264)$/i.test(format))
    {
	format = "";
    }

    this.format = format;
}


LinternaMagica.prototype.set_priority = function(priority)
{
    var set_priority = false;

    if (/html5/i.test(priority))
    {
	set_priority = false;
    }
    else
    {
	set_priority = true;
    }

    this.priority = set_priority;
}

LinternaMagica.prototype.set_manual_run = function(manual_run)
{
    var manual = manual_run ? manual_run : true;

    if (!manual ||
	(!/enabled/i.test(manual) &&
	 !/disabled/i.test(manual) &&
	 !/on/i.test(manual) &&
	 !/off/i.test(manual) &&
	 !/true/i.test(manual) &&
	 !/false/i.test(manual) &&
	 !/0/i.test(manual) &&
	 !/1/i.test(manual) &&
	 !/yes/i.test(manual) &&
	 !/no/i.test(manual)))
    {
	start = false;
    }

    if (/enabled/i.test(manual) ||
	/on/i.test(manual) ||
	/yes/i.test(manual) ||
	/1/i.test(manual) ||
	/true/i.test(manual))
    {
	manual = true;
    }

    if (/disabled/i.test(manual)
	|| /off/i.test(manual)
	|| /no/i.test(manual)
	|| /0/i.test(manual)
	|| /false/i.test(manual))
    {
	manual = false;
    }

    this.manual_run = manual;

    return manual;
}
