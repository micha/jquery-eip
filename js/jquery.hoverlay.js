/*
 * hoverlay - Jquery plugin to make an absolutely positioned overlay layer
 *            on top of matched elements, triggered on hover. It will trigger
 *            a specified callback when the overlay is double-clicked, and. 
 *
 * Fork me on github:
 *   http://github.com/micha/hoverlay
 *
 * Author:
 *   Micha Niskin <micha@thinkminimo.com>
 *   Copyright 2009, no rights reserved.
 */

(function($) {

  var enableVal = true;

  var handlers = {
    dblclick : function(event) {
      $(document).trigger("hoverlay-term", event);
    }
  };

  $.hoverlay = {
    css : function(obj) {
      obj.position = "absolute";
      var tag = "<style type='text/css'> html body .hoverlay { ";
      for (var i in obj)
        tag += i+":"+obj[i]+"; ";
      tag += "} </style>";
      $("head").append(tag);
    },
    enabled : function(val) {
      if (arguments.length && !val) {
        $(document).trigger("hoverlay-remove", {});
        $(document).trigger("hoverlay-term", {});
        return (enableVal = false);
      }
      return arguments.length ? (enableVal = val) : enableVal;
    }
  };

  $.fn.hoverlay = function(css, init, term) {
    if (! css) css = {};
    if (! $.isFunction(init)) init = function() {};
    if (! $.isFunction(term)) term = function() {};
    if ($.isFunction(css)) {
      term = init;
      init = css;
      css  = {};
    }
    var border=0;
    if (css.border)
      border = css.border.replace(/px.*$/, "");
    this.each(function() {
      var a = $(this);
      a.hover(function(event) {
        if (! $.hoverlay.enabled()) return true;
        $(document).trigger("hoverlay-remove", a);
        var h = $(a).clone();
        for (var i in css)
          h.css(i, css[i]);
        h.addClass    ("hoverlay");
        h.width       ($(a).width()+"px");
        h.height      ($(a).height()+"px");
        h.css         ("position", "absolute");
        h.css         ("top", (a.offset().top - border) + "px");
        h.css         ("left", (a.offset().left - border) + "px");
        h.css         ("margin", "0");
        h.hover       (
          function(event) { }, 
          function(event) {
            $(document).trigger("hoverlay-remove", h);
            return false;
          }
        );
        h.click       (function(event) { 
          var ondbl, onkup;
          $(this).remove();
          $(document).trigger("hoverlay-remove", h);
          $(document).trigger("hoverlay-term", event);
          init.call(a, event); 

          $(document).one(
            "hoverlay-term", 
            function(event) { 
              for (var i in handlers)
                $(document).unbind(i, handlers[i]);
              term.call(a, event.data); 
              return false;
            }
          );

          for (var i in handlers)
            $(document).one(i, handlers[i]);

          return false;
        });
        a.after(h);
        var rmv = function(elem) {
          return function(event) {
            if (event.data === this)
              $(document).one(event.type, rmv(elem));
            else
              elem.remove();
            return false;
          };
        };
        $(document).one("hoverlay-remove", rmv(h));
        return false;
      }, function(event) { return false; });
    });
    return this;
  };

})(jQuery);
