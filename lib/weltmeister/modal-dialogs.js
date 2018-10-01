ig.module(
	'weltmeister.modal-dialogs'
)
.requires(
	'weltmeister.select-file-dropdown'
)
.defines(function(){ "use strict";

wm.ModalDialog = ig.Class.extend({
	onOk: null,
	onCancel: null,

	text: '',
	okText: '',
	cancelText: '',
	
	background: null,
	dialogBox: null,
	buttonDiv: null,
	
	init: function( text, okText, cancelText ) {
		this.text = text;
		this.okText = okText || 'OK';
		this.cancelText = cancelText || 'Cancel';
	
		this.background = document.createElement('div');
		this.background.className = 'modalDialogBackground';
		
		this.dialogBox = document.createElement('div');
		this.dialogBox.className = 'modalDialogBox';
	
		this.background.appendChild( this.dialogBox );
		document.body.appendChild( this.background );
		
		this.initDialog( text );
	},
	
	
	initDialog: function() {
		this.buttonDiv = document.createElement('div');
		this.buttonDiv.className = 'modalDialogButtons';

		var okButton = document.createElement('input');
		okButton.type = okButton.className = 'button';
		okButton.value = this.okText;

		var cancelButton = document.createElement('input');
		cancelButton.type = cancelButton.className = 'button';
		cancelButton.value = this.cancelText;

		okButton.addEventListener( 'click', this.clickOk.bind(this) );
		cancelButton.addEventListener( 'click', this.clickCancel.bind(this) );
		
		this.buttonDiv.appendChild( okButton );
		this.buttonDiv.appendChild( cancelButton );
		
		this.dialogBox.innerHTML = '<div class="modalDialogText">' + this.text + '</div>';

		this.dialogBox.appendChild( this.buttonDiv );
	},
	
	
	clickOk: function() {
		if( this.onOk ) { this.onOk(this); }
		this.close();
	},
	
	
	clickCancel: function() {
		if( this.onCancel ) { this.onCancel(this); }
		this.close();
	},
	
	
	open: function() {
		this.background.style.opacity = 1;
		this.background.style.transition = "opacity 100ms ease";
	},
	
	
	close: function() {
		this.background.style.opacity = 0;
		this.background.style.transition = "opacity 100ms ease";
	}
});



wm.ModalDialogPathSelect = wm.ModalDialog.extend({
	pathDropdown: null,
	pathInput: null,
	fileType: '',
	
	init: function( text, okText, type ) {
		this.fileType = type || '';
		this.parent( text, (okText || 'Select') );
	},
	
	
	setPath: function( path ) {
		var dir = path.replace(/\/[^\/]*$/, '');
		this.pathInput.value = path;
		this.pathDropdown.loadDir( dir );
	},
	
	
	initDialog: function() {
		this.parent();
		this.pathInput = document.createElement('input');
		this.pathInput.type = 'text';
		this.pathInput.className = 'modalDialogPath';

		this.dialogBox.insertBefore( this.pathInput, this.buttonDiv );

		this.pathDropdown = new wm.SelectFileDropdown( this.pathInput, wm.config.api.browse, this.fileType );
	},
	
	
	clickOk: function() {
		if( this.onOk ) { 
			this.onOk(this, this.pathInput.val()); 
		}
		this.close();
	}
});

});