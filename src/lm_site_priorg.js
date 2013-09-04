//  @licstart The following is the entire license notice for the
//  JavaScript code in this page (or file).
//
//  This file is part of Linterna Mágica
//
//  Copyright (C) 2012 Ivaylo Valkov <ivaylo@e-valkov.org>
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

LinternaMagica.prototype.sites["pri.org"] = new Object();

// Reference 
LinternaMagica.prototype.sites["www.pri.org"] = "pri.org";

// The swf object is part of the HTML body. Scanning scripts is useless.
LinternaMagica.prototype.sites["pri.org"].no_flash_plugin_installed =
function()
{
    return true;
}

// Force link extraction
LinternaMagica.prototype.sites["pri.org"].skip_link_extraction = function()
{
    var player = document.getElementById("shoutcast");

    if (!player)
    {
	return null;
    }

    var extracted_data = new Object();
    extracted_data.link = "http://www.pri.org/stream/listen.pls";
    extracted_data.hd_links = new Array();

    var links = ["pri1", "pri1-fallback", "pri2-fallback" ];

    for (var pl=0, l=links.length; pl<l; pl++  )
    {
	var link = new Object();
	var cnt = parseInt(pl+1);
	link.url = "http://pri-ice.streamguys.biz/"+links[pl];
	link.label = this._("Link")+" "+cnt;
	link.more_info = "Public Radio International #"+cnt+" - "+(cnt > 1 ? 32 : 64)+"kbs";
	extracted_data.hd_links.push(link);
    }

    return extracted_data;
}

