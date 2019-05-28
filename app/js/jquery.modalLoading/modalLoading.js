/*
 * modalLoading.js
 *
 *	Copyright (c) 2013 Robson Martins Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
 *
 *	modalLoading jQuery Plugin creates a Loading screen over your page and it allows you to choose the holder container, so you can append the Modal Loading to the document.body ('body') or to a html-div object.
 *
 *	Needed includes:
 *
 *		<script src="http://code.jquery.com/jquery-1.10.1.min.js"></script>
 *		<script type="text/javascript" src="modalLoading.js"></script>
 *
 *	Simple usage:
 *
 *	To create:
 *		
 *		loading = $(selector).modalLoading(height);
 *		
 *	To Remove:
 *		
 *		loading.remove();
 *	 
 *	Examples:
 *
 *		loading = $(document.body).modalLoading(100);
 *		loading.remove();
 *
 *		$('#div-name').modalLoading(100);
 *		loading.remove();
 *
 *		$('#div-name').modalLoading();
 *		loading.remove();
 *
 *		$(document.body).modalLoading(100, 'New Message...');
 *		loading.remove();
 *
 *		$('#div-name').modalLoading(0, 'New Message...');
 *		loading.remove();
 *
 *	Notes:
 *	- valid height value from 0 to 100, it represents the % of the holder container
 *	- if no height is provided, it will assume the height of its holder container
 *
*/

(function ($) {
    $.fn.modalLoading = function (height, message) {
    	if (!message) message = 'Loading...';

		modalLoading = $('<div style="position: fixed; display: block; z-index: 999999; text-align: center; font-size: 20px; background-color:rgba(238,238,238,0.8);">'+
							'<div style="display: inline-block; position:relative; top:50%;">'+
								'<i class="icon-spinner icon-spin blue bigger-125"></i> &nbsp; &nbsp; '+message+
							'</div>'+
						'</div>');

    	modalLoading.attr('id', 'modalLoading');

		modalLoading.css('width', this.innerWidth());

		if (height && height > 0) height = height+'%';
		else height = this.innerHeight();
		modalLoading.css('height', height);

		offset = this.offset();
		modalLoading.css('top', offset.top+'px');
		modalLoading.css('left', offset.left+'px');

    	this.append(modalLoading);

		return $(modalLoading);
    }
})(jQuery);