//  @licstart The following is the entire license notice for the
//  JavaScript code in this page (or file).
//
//  This file is part of Linterna Mágica
//
//  Copyright (C) 2010, 2011, 2012  Ivaylo Valkov <ivaylo@e-valkov.org>
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

// Check if there is a flash plugin installed and set
// "this.plugin_is_installed" for later use
LinternaMagica.prototype.check_flash_plugin = function()
{
    var is_installed = false;

    // OK even in Greasemonkey. Since 0.0.9-4 Linterna Magica is
    // injected in the page.
    var nav = window.navigator;

    if (nav && nav.mimeTypes &&
	nav.mimeTypes.length > 0 &&
	nav.plugins &&
	nav.plugins.length > 0)
    {
	if (nav.mimeTypes["application/x-shockwave-flash"] &&
	    nav.plugins["Shockwave Flash"])
	{
	    is_installed = true;
	}
    }

    if (is_installed)
    {
	var flash_plugin = nav.plugins["Shockwave Flash"].filename;

	var plugin_name = /gnash/i.test(flash_plugin) ? "Gnash" :
	    /lightspark/i.test(flash_plugin) ? "Lightspark" :
	    /totem-vegas/i.test(flash_plugin) ? "Totem Vegas" :
	    "a flash plugin";

	this.log("LinternaMagica.check_flash_plugin:\n"+
		 "Flash plugin ("+plugin_name+") detected. ",2);
    }

    this.plugin_is_installed = is_installed;
}

// Check if html element is a flash object
// arguments : @element
// return: true/false
LinternaMagica.prototype.is_swf_object = function(element)
{
    // There is a problem in Epiphany 2.30.2 (probably a bug). The typeof
    // function returns "function" for object and emebed elements
    // if (typeof (element) !== "object")
    // 	return false;

    // Work-around ^^^
    if (!/HTML(embed|object|iframe)element/i.test(element))
    {
	return null;
    }

    var detected_via ="";
    var is_swf = false;
    var classid_string = ".*D27CDB6E-AE6D-11cf-96B8-444553540000.*";
    var classid_re = new RegExp(classid_string, "i");

    if (element.hasAttribute('type') &&
	/.*-shockwave-flash.*/.test(element.getAttribute("type")))
    {
	is_swf = true;
	detected_via = "type";
    }
    else if (element.hasAttribute("codebase")
	     && /.*flash.*/.test(element.getAttribute('codebase')))
    {
	is_swf = true;
	detected_via = "codebase";
    }
    else if (element.hasAttribute('classid')
	     && element.getAttribute('classid').match(classid_re))
    {
	is_swf = true;
	detected_via = "classid";
    }
    // The iframe will enter here because of src
    else if (element.hasAttribute("data") ||
	     element.hasAttribute("src"))
    {
	var attr = element.getAttribute("data")
	    ? element.getAttribute("data") :
	    element.getAttribute("src");

	if (attr.match(/\.swf/))
	{
	    is_swf = true;
	    detected_via = "file extension (.swf)";
	}
	// Not a swf but best to detect remotely embedded clips with
	// current logic.
	else if (element.localName.toLowerCase() == "iframe")
	{
	    var self = this;
	    var val = this.call_site_function_at_position.apply(self,[
		"do_not_force_iframe_detection",
		window.location.hostname]);

	    if (!val)
	    {
		return false;
	    }

	    is_swf = true;
	    detected_via = "forced for iframe";
	}
    }

    if (detected_via)
    {
	this.log("LinternaMagica.is_swf_object:\n"+
		 "SWF DOM object found.",1);

	this.log("LinternaMagica.is_swf_object:\n"+
		 "SWF <"+element.localName+"> "+
		 (element.hasAttribute("id") ? 
		  (" with id \""+element.getAttribute("id")+"\" " ) :"") +
		 "detected via \""+detected_via+"\".", 2);

    }
    return is_swf;
}
