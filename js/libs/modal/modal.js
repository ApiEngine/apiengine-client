define(['jquery'], function ($) {
  var defaultOptions = {

  };
  var modal = function (options) {
    var options = $.extend(defaultOptions, options);

    
    this.overlay = $('<div>');
    this.overlay.addClass('overlay')
    $('body').append(this.overlay);

    this.el = $('<div>');
    this.el.html(options.content);
    this.el.addClass('modal')
    $('body').append(this.el);

  };

  modal.prototype.show = function () {
    this.addClass('shown')
  };
  
  modal.prototype.hide = function () {
    this.addClass('hidden')
  };

  var create = function (options) {
    var Modal = new modal(options);
    return Modal;
  };


  return {
    create: create
  };

});

// GAVE UP