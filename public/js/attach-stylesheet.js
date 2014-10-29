/*Attaches browser specific stylesheet*/
(function(n){
	var p = window.basePath || '//ui1.img.digitalrivercontent.net/drui/1.9.29/';
	p = p.replace(/^\/\//, location.protocol+'//');
	var b = 'ff';
	var ffie = n.match(/(MSIE|Firefox)[\/\s](\d+)/);
	var modernIE = n.search('Trident') > -1 && n.search('MSIE') === -1;
	if (ffie) {
		var v = parseFloat(ffie[2], 10);
		if (ffie[1] === 'MSIE') {
			b = (v < 7) ? 'ie6' : (v < 8) ? 'ie7' : (v < 9) ? 'ie8' : 'ie9';
		} else if (v < 3) {b = 'ff2';}
	} else {
		var ocs = n.match(/Opera|Chrome|Safari/);
		if (ocs) {b = ocs[0].toLowerCase();}
	}
	if (modernIE === true) {
		b = 'ie9';
	}
	var c = document.createElement('link');
	c.type = 'text/css';
	c.rel = 'stylesheet';
	c.href = p+'css/dr-stylesheet-'+b+'-compressed.css';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(c, s);
})(navigator.userAgent);