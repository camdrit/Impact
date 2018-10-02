ig.module(
	'weltmeister.select-file-dropdown'
)
.defines(function(){ "use strict";
	
wm.SelectFileDropdown = ig.Class.extend({
	input: null,
	boundShow: null,
	div: null,
	filelistPHP: '',
	filetype: '',
	
	init: function( elementId, filelistPHP, filetype ) {
		this.filetype = filetype || '';
		this.filelistPHP = filelistPHP;
		this.input = ( elementId.constructor == HTMLInputElement ? elementId : document.getElementById( elementId.split("#")[1] ) );
		this.boundHide = this.hide.bind(this);
		this.input.addEventListener('focus', this.show.bind(this) );
		
		this.div = document.createElement('div');
		this.div.className = 'selectFileDialog';

		this.input.parentNode.insertBefore( this.div, this.input.nextSibling );
		this.div.addEventListener('mousedown', this.noHide.bind(this) );
		
		this.loadDir( '' );
	},
	
	
	loadDir: function( dir ) {
		var path = this.filelistPHP + '?dir=' + encodeURIComponent( dir || '' ) + '&type=' + this.filetype;
		var req = new XMLHttpRequest();
		req.open('GET', path, false);
		req.onload = () => {
			if (req.status === 200) {
				this.showFiles(JSON.parse(req.response));
			}
		}
		req.send();
	},
	
	
	selectDir: function( event ) {
		this.loadDir( event.target.href );
		return false;
	},
	
	
	selectFile: function( event ) {
		this.input.value = event.target.href;
		this.input.blur();
		this.hide();
		return false;
	},
	
	
	showFiles: function( data ) {
		this.div.innerHTML = "";
		if( data.parent !== false ) {
			var parentDir = document.createElement('a');
			parentDir.className = 'dir';
			parentDir.href = data.parent;
			parentDir.innerHTML = '&hellip;parent directory';
			parentDir.addEventListener( 'click', this.selectDir.bind(this) );
			this.div.appendChild( parentDir );
		}
		for( var i = 0; i < data.dirs.length; i++ ) {
			var name = data.dirs[i].match(/[^\/]*$/)[0] + '/';
			var dir = document.createElement('a');
			dir.className = 'dir';
			dir.href = data.dirs[i];
			dir.innerHTML = dir.title = name;
			dir.addEventListener( 'click', this.selectDir.bind(this) );
			this.div.appendChild( dir );
		}
		for( var i = 0; i < data.files.length; i++ ) {
			var name = data.files[i].match(/[^\/]*$/)[0];
			var file = document.createElement('a');
			file.className = 'file';
			file.href = data.files[i];
			file.innerHTML = file.title = name;
			file.addEventListener( 'click', this.selectFile.bind(this) );
			this.div.appendChild( file );
		}
	},
	
	
	noHide: function(event) {
		event.stopPropagation();
	},
	
	
	show: function( event ) {
		var inputPos = { top: this.input.offsetTop - parseInt(getComputedStyle(this.input).marginTop), left: this.input.offsetLeft };//this.input.getPosition(this.input.getOffsetParent());
		var inputHeight = this.input.clientHeight + parseInt(getComputedStyle(this.input).marginTop);
		var inputWidth = this.input.clientWidth;
		
		document.addEventListener( 'mousedown', this.boundHide );
		this.div.classList.remove('closed');
		this.div.classList.add('opened');
		this.div.style.top = inputPos.top + inputHeight + 1 + "px";
		this.div.style.left = inputPos.left + "px";
		this.div.style.width = inputWidth + "px";
		
		this.div.style.display = "block";
		var maxHeight = this.div.firstChild.clientHeight * this.div.childNodes.length;
		this.div.style.maxHeight = maxHeight + "px";
		// this.div.css({
		// 	'top': inputPos.top + inputHeight + 1,
		// 	'left': inputPos.left,
		// 	'width': inputWidth
		// }).slideDown(100);
	},
	
	
	hide: function() {
		document.removeEventListener( 'mousedown', this.boundHide );
		this.div.classList.remove('opened');
		this.div.classList.add('closed');
	}
});

});