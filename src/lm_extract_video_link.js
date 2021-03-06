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
// @source http://linternamagica.org

// END OF LICENSE HEADER

// Extract video links from a string passed as argument
LinternaMagica.prototype.extract_link = function()
{
    if (!this.extract_link_data)
    {
	return null;
    }

    var data = this.extract_link_data;

    var self = this;
    var val = this.call_site_function_at_position.apply(self,[
	"set_video_link_regex",
	window.location.hostname]);


    var link_re = null;
    var link_position = null;

    if (val && typeof(val) != "boolean")
    {
	link_re = val.link_re;
	link_position = val.link_position;
    }
    else
    {
	link_re = new RegExp (
	    "\\\{{0}.*(video|flv_ur|streamer|file|moviepath|videourl|"+
		"mediaurl|audio|soundfile|sdurl|videopath|flv|url|ms|"+
		"nextmovie|flvaddress)"+
		"(\\\"|\\\')*\\\s*(\\\=|\\\:|\\\,)\\\s*(\\\"|\\\')*"+
	  	 "(.*\\\."+
		"(flv|mp4|mp3)"+ // Add other extensions here
		"((\\\?|\\\&)?\\\w+\\\=[A-Za-z0-9_\\\-]+"+
		"\\\&?)*)(?!\\\.)",
	    "i");
    }

    if (link_position == null ||
	typeof(link_position) == "undefined")
    {
	link_position = 4;
    }

    var link = unescape(data).match(link_re);

    if (link && link[link.length-link_position])
    {
	link = unescape(link[link.length-link_position]);

	// Used in Metacafe. Unescape is not helping. Small and not
	// significant to be exported in src/lm_site_metacafe.js
	link = link.replace(/\\\//g, "/");

	// Escape spaces.
	// See bug #37661
	// https://savannah.nongnu.org/bugs/index.php?37661
	link = link.replace(/ /g, "%20");

	var self = this;
	var val = this.call_site_function_at_position.apply(self,[
	    "process_extracted_link",
	    window.location.hostname, link]);

	if (val && typeof(val) != "boolean")
	{
	    link = val;
	}

	var self = this;
	var val = this.call_site_function_at_position.apply(self,[
	    "do_not_clean_amps_in_extracted_link",
	    window.location.hostname]);

	if (val)
	{
	    // The parameters are for the player and with them the
	    // video is no accessible
	    link = link.split("&")[0];

	    this.log("LinternaMagica.extract_link:\n"+
		     " Link split at the first ampersand",3);

	    // Abrowser/Firefox is not loading i-kat.org link
	    // with two slashes. Strange!
	    link = link.replace(/[^:]\/\//, "/");
	}

	// // Amps are not required everywhere
	// var keep_amp_in_hosts_re = new RegExp (
	//     // Will match com de etc.
	//     "video\\\.google\\\.|"+
	// 	".*facebook\\\.",
	//     // this used to be cleared. now the logic is reverse
	//     // "i-kat\\\.org|video\\\.fensko\\\.com|mqsto\\\.com"+
	//     // 	"|fun-6\\\.com|videoclipsdump\\\.com|boomclips\\\.com"+
	//     // 	"|lucidclips\\\.com|reuters\\\.com|failo\\\.bg|5min\\\.com|"+
	//     // 	"mediashare\\\.bg|ted\\\.com",
	//     "i");


	self = this;
	val = this.call_site_function_at_position.apply(self,[
	    "skip_flowplayer_links_fix",
	    window.location.hostname]);

	if (val)
	{
	    // Some links used with flowplayer are relative
	    if (data.match(/.*flowplayer.*/))
	    {
		link = this.fix_flowplayer_links(link);
	    }
	}

	this.log("LinternaMagica.extract_link:\n"+
		 " Extracted link: "+link,1);

	return link;
    }
    else
    {
	this.log("LinternaMagica.extract_link:\n"+
		 "No link found.",4);
    }

    return null;
}

// Extract video id from string passed as argument.  This is used to
// request a document (usually XML) containing the video link
LinternaMagica.prototype.extract_video_id = function()
{

    if (!this.extract_video_id_data)
    {
	return null;
    }

    var data = this.extract_video_id_data;

    // Fix vbox7.com (flashvars="id=...")
    data = "&"+data;

    var video_id_re = null;
    var match_site = null;
    var video_id_position = null;

    if (/blip\.tv/i.test(data))
    {
	// Blip.tv has a JSONP API that could be used in remote
	// sites. That is why we cant search for blip.tv directly in
	// the data.
	// http://wiki.blip.tv/index.php/Extract_metadata_from_our_embed_code

	match_site = "blip.tv";
    }
    else
    {
	match_site = window.location.hostname;
    }

    var self = this;
    var val = this.call_site_function_at_position.apply(self,[
	"set_video_id_regex",
	match_site]);

    if (val && typeof(val) !== "boolean")
    {
	video_id_re = val.video_id_re;
	video_id_position = val.video_id_position;
    }
    else
    {
	video_id_re = new RegExp (
	    "(\\\"|\\\'|\\\&|\\\?|\\\;|\\\/|\\\.|\\\=)(itemid|"+
		"clip_id|audio|soundfile|clip|video_id|vid|"+
		"player_config\\\.php\\\?v|"+
		"videoid|media_id|vkey|video3|_videoid|"+
		"vimeo_clip_|php&ID|\\\/video_embed\\\/\\\?id)"+
		"(\\\"|\\\')*(\\\=|\\\:|,|\\\/)\\\s*(\\\"|\\\')*"+
		"([a-zA-Z0-9\\\-\\\_]+)",
	"i");
    }

    if (video_id_position == null ||
	typeof(video_id_position) == "undefined")
    {
	video_id_position = 1;
    }

    var video_id =data.match(video_id_re);

    if (video_id)
    {
	video_id = video_id[video_id.length-video_id_position];

	this.log("LinternaMagica.extract_video_id:\n"+
		 "Extracted video id : "+video_id,1);

	return video_id;
    }
    else
    {
	this.log("LinternaMagica.extract_video_id:\n"+
		 "No video_id found. ",4);
    }

    return null;
}
