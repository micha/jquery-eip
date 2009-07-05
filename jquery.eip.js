(function($) {

  var wrapId            = "eip-mce-wrapper";
  var topbarId          = "eip-topbar";
  var blackoutId        = "eip-blackout";
  var blackoutCloseId   = "eip-blackout-close";
  var helpId            = "eip-help";

  var buttonClass       = "eip-button";
  var noMarginClass     = "eip-no-margin";

  var wrapElem          = $("<div/>").attr("id", wrapId);

  var enableVal         = true;

  $.eip = {
    enabled : function(val) {
      return arguments.length 
        ? (enableVal = $.hoverlay.enabled(val)) 
        : enableVal;
    },
    init : function(hcss) {
      $("head").append(  
        "<style type='text/css'> " +
          "#"+topbarId+" { "+
            "position: fixed; "+
            "bottom: 0px; "+
            "left: 0px; "+
            "width: 100%; "+
            "background: red; "+
            "color: white; "+
            "padding: 4px 20px; "+
            "z-index: 99999 !important; "+
          "} "+
          "#"+topbarId+" input { "+
            "float: right; "+
            "margin: 2px 5px; "+
          "} "+
          "#"+blackoutId+" { "+
            "position: fixed; "+
            "top: 0px; "+
            "left: 0px; "+
            "z-index: 100 !important; "+
            "background: #000; "+
            "opacity: 0.66; "+
            "filter: alpha(opacity = 66); "+
          "} "+
          "#"+wrapId+" { "+
            "position: absolute !important; "+
            "padding-top: 0 !important; "+
            "padding-right: 0 !important; "+
            "padding-bottom: 0 !important; "+
            "padding-left: 0 !important; "+
            "margin-top: 0 !important; "+
            "margin-right: 0 !important; "+
            "margin-bottom: 0 !important; "+
            "margin-left: 0 !important; "+
          "} "+
          "#"+wrapId+"_"+($.browser.msie?"parent":"tbl")+" { "+
            "position: relative !important; "+
            "z-index: 3000 !important; "+
          "} "+
          "#"+wrapId+"_external { "+
            "position:fixed !important; "+
            "top:0px !important; "+
            "left: 0px !important; "+
            "padding:0px !important; "+
            "margin:0px !important; "+
            "border:1px solid #444 !important; "+
            "display:block !important; "+
            "z-index: 99999 !important; "+
          "} "+
          "#"+blackoutCloseId+" { "+
            "padding: 5px; "+
            "position: absolute !important; "+
            "z-index: 4000 !important; "+
            "text-align: right; "+
          "} "+
          "html body #"+wrapId+" ."+noMarginClass+" { "+
            "margin: 0px !important; "+
          "} "+
        "</style>"
      );

      if (hcss) $.hoverlay.css(hcss);

      $("a").unbind("mousedown")
        .unbind("mouseup")
        .unbind("click")
        .click(function() { return false; })
        .dblclick(function() { return false; });

      /*
      var tbar, b1, b2;
      tbar = $("<div/>").attr("id", topbarId);
      tbar.append("<div style='width:20px;float:right'>&nbsp;</div>");
      t1 = $("<div/>");
      b1 = $("<input/>").attr("type", "button").addClass(buttonClass);
      b2 = $("<input/>").attr("type", "button").addClass(buttonClass);
      tbar.append(b2,b1,t1);
      $("body").append(tbar);

      b1.val("save");
      b2.val("reset");
      t1.text("Click somewhere");
      */

      $(".eip").eip();
    }
  };

  $.fn.eip = function() {
    if (!$.eip.enabled())
      return this;
    this.each(function() {
      var a = $(this);
      a.hoverlay(
        { border : "1px solid black" },
        function(event) { 
          // blackout overlay
          var bo = $("<div id='"+blackoutId+"'/>");
          bo.css("width", $("body").width()+"px");
          bo.css("height", $("body").height()+"px");
          $("body").append(bo);

          // tinymce editor
          var dup = $(this).clone();
          dup.addClass(noMarginClass);

          var wrap = $("<div/>").attr("id", wrapId);
          wrap.css    ("position", "absolute");
          wrap.css    ("top", $(this).offset().top + "px");
          wrap.css    ("left", $(this).offset().left + "px");
          wrap.append(dup);

          $(this).after(wrap);

          tinyMCE.execCommand('mceAddControl', false, wrapId);

          var ed1 = $("#"+wrapId+"_parent");
          ed1.css("position","absolute");
          ed1.css("top", $(this).offset().top + "px");
          ed1.css("left", $(this).offset().left + "px");

          // ok button
          var editor  = $("#"+wrapId+"_tbl");
          editor.width   ($(this).width()+"px");
          editor.height  ($(this).height()+"px");
          var oktop   = editor.offset().top + editor.height();
          var okleft  = editor.offset().left;
          var okwidth = editor.width() - 3; // 3px 'padding' on right
          var ok = $("<div id='"+blackoutCloseId+"'/>");
          ok.css("top",     oktop+"px");
          ok.css("left",    okleft+"px");
          ok.css("width",   okwidth+"px");
          ok.append(
            $("<input type='button'/>")
              .val("done")
              .click(function(event) {
                $(document).trigger("hoverlay-term", event);  
              })
          );
          $("body").append(ok);
        },
        function(event) { 
          tinyMCE.execCommand('mceRemoveControl', false, wrapId);
          $("#"+wrapId).children().removeClass(noMarginClass).addClass("eip");
          $(this).replaceWith($("#"+wrapId).children().eip());
          $("#"+wrapId).remove();
          $("#"+blackoutId).remove();
          $("#"+blackoutCloseId).remove();
        }
      );
    });
    return this;
  };

  $(function() { $.eip.init(); });

})(jQuery);
