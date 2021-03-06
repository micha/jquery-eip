(function($) {

  var wrapId            = "eip-mce-wrapper";
  var wrapElem          = $("<div/>").attr("id", wrapId);
  var uuid              = 0;
  var enabledVal        = false;

  function hover_in(event) {
    if ($.eip.enabled()) {
      var bgurl = "img/stripes.gif";
      $(this).data("oldbg", $(this).css("background-image"));
      $(this).css("background-image", "url("+bgurl+")");
    }
  }

  function hover_out(event) {
    $(this).css("background-image", $(this).data("oldbg"));
    $(this).removeData("oldbg");
  }

  function add_mce(event) {
    if (!$.eip.enabled()) return;
    $(document).trigger("eip-out", this);
    $(this).wrap(wrapElem);
    tinyMCE.execCommand('mceAddControl', false, wrapId);
    $("#"+wrapId+"_external").hover(
      function(event) { $.eip.enabled(false); },
      function(event) { $.eip.enabled(true); }
    );
  }

  function remove_mce(event) {
    if (! $("#"+wrapId).size())
      return;

    var wrapper  = $("#"+wrapId),
        children = wrapper.children();

    tinyMCE.execCommand('mceRemoveControl', false, wrapId);

    wrapper  = $("#"+wrapId);
    children = wrapper.children();

    if (children.size() > 1)
      wrapper.append($("<div class='eip'></div>").append(children));

    wrapper.children().addClass("eip");
    wrapper.after($("#"+wrapId).children().eip()).remove();
  }

  function body_click(event) {
    if ($.eip.enabled())
      remove_mce(event);
    else
      $("body").one("click", body_click);
    return false;
  }

  $.eip = {
    enabled: function(val) {
      return !arguments.length ? enabledVal : (enabledVal = val);
    }
  };

  $.fn.eip = function() {
    this.each(function() {

      var a = this;

      $(document).bind("eip-in", this, function(event, target) {
        if (target === event.data)
          hover_in.call(target, event);
      }).bind("eip-out", this, function(event, target) {
        if (target === event.data)
          hover_out.call(target, event);
      });

      $(this).hover(
        function(event) {
          $(document).trigger("eip-in", a);
          return false;
        },
        function(event) {
          $(document).trigger("eip-out", a);
          return false;
        }
      ).click(function(event) {
        remove_mce(event);
        add_mce.call(this, event);
        $("body").one("click", body_click);
        return false;
      });

    });
    return this;
  };

  $(function() {
    $("head").append(  
      "<style type='text/css'> " +
        "#"+wrapId+"_toolbar1 { "+
          "margin: 0px !important; "+
        "} "+
        "#"+wrapId+"_external { "+
          "position:fixed !important; "+
          "top:0px !important; "+
          "left: 0px !important; "+
          "padding:0px !important; "+
          "margin:0px !important; "+
          "border:1px solid #444 !important; "+
          "display:block !important; "+
          "z-index: 5000 !important; "+
        "} "+
      "</style>"
    );
    $("#menu_"+wrapId+"_"+wrapId+"_formatselect_menu_co")
      .live("mouseover", function(event) { $.eip.enabled(false); })
      .live("mouseout", function(event) { $.eip.enabled(true); });
    $.eip.enabled(true);
  });

})(jQuery);

  /*
  var topbarId          = "eip-topbar";
  var blackoutId        = "eip-blackout";
  var blackoutCloseId   = "eip-blackout-close";
  var helpId            = "eip-help";

  var buttonClass       = "eip-button";
  */

      /*
      $("head").append(  
        "<style type='text/css'> " +
          "#"+wrapId+" { "+
            "padding-top: 0 !important; "+
            "padding-right: 0 !important; "+
            "padding-bottom: 0 !important; "+
            "padding-left: 0 !important; "+
            "margin-top: 0 !important; "+
            "margin-right: 0 !important; "+
            "margin-bottom: 0 !important; "+
            "margin-left: 0 !important; "+
          "} "+
          "#"+topbarId+" { "+
            "position: fixed; "+
            "bottom: 0px; "+
            "left: 0px; "+
            "width: 100%; "+
            "background: red; "+
            "color: white; "+
            "padding: 4px 20px; "+
            "z-index: 5000 !important; "+
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
          "#"+wrapId+"_tbl { "+
            "margin: 0px !important; "+
            (!$.browser.msie ? "position: relative !important; " : "")+
            (!$.browser.msie ? "z-index: 3000 !important; " : "")+
          "} "+
          "#"+wrapId+"_tblext { "+
            "margin: 0px !important; "+
          "} "+
          "#"+wrapId+"_toolbar1 { "+
            "margin: 0px !important; "+
          "} "+
          "#"+wrapId+"_parent { "+
            ($.browser.msie ? "position: relative !important; " : "")+
            ($.browser.msie ? "z-index: 3000 !important; " : "")+
          "} "+
          "#"+wrapId+"_external { "+
            "position:fixed !important; "+
            "top:0px !important; "+
            "left: 0px !important; "+
            "padding:0px !important; "+
            "margin:0px !important; "+
            "border:1px solid #444 !important; "+
            "display:block !important; "+
            "z-index: 5000 !important; "+
          "} "+
          "#"+blackoutCloseId+" { "+
            "padding: 5px; "+
            "position: absolute !important; "+
            "z-index: 4000 !important; "+
            "text-align: right; "+
          "} "+
        "</style>"
      );
      */
      /*
        function(event) { 
          // disable editmode submit button if necessary
          try { $.editmode.set.eip(); } catch (e) {}

          // blackout overlay
          var bo = $("<div id='"+blackoutId+"'/>");
          bo.css("width", $(window).width()+"px");
          bo.css("height", $(window).height()+"px");
          $("body").append(bo);

          // tinymce editor
          $(this).wrap(wrapElem);
          tinyMCE.execCommand('mceAddControl', false, wrapId);

          $("#"+wrapId+"_parent > div").eq(0)
            .css("position", "fixed")
            .css("top", "0px")
            .css("left", "0px")

          // ok button
          var editor  = $("#"+wrapId+"_tbl");
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
          $("#"+wrapId).children().addClass("eip");
          $("#"+wrapId).after($("#"+wrapId).children().eip()).remove();
          $("#"+blackoutId).remove();
          $("#"+blackoutCloseId).remove();

          // re-enable editmode submit button if necessary
          try { $.editmode.set.edit(); } catch (e) {}
        }
      );
  */
