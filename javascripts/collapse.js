(function() {
  "use strict";
  var $, Collapse, old, transitionEnd;

  $ = window.jQuery;

  transitionEnd = function() {
    var el, name, transEndEventNames;
    el = document.createElement("bootstrap");
    transEndEventNames = {
      WebkitTransition: "webkitTransitionEnd",
      MozTransition: "transitionend",
      OTransition: "oTransitionEnd otransitionend",
      transition: "transitionend"
    };
    for (name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return {
          end: transEndEventNames[name]
        };
      }
    }
  };

  $.fn.emulateTransitionEnd = function(duration) {
    var $el, callback, called;
    called = false;
    $el = this;
    $(this).one($.support.transition.end, function() {
      return called = true;
    });
    callback = function() {
      if (!called) {
        return $($el).trigger($.support.transition.end);
      }
    };
    setTimeout(callback, duration);
    return this;
  };

  $(function() {
    return $.support.transition = transitionEnd();
  });

  Collapse = (function() {
    function Collapse(element, options) {
      this.$element = $(element);
      this.options = $.extend({}, Collapse.DEFAULTS, options);
      this.transitioning = null;
      this.collapseHeight = this.options.collapseHeight || 0;
      if (this.options.toggle) {
        this.toggle();
      }
    }

    Collapse.DEFAULTS = {
      toggle: true
    };

    Collapse.prototype.show = function() {
      var complete, startEvent;
      if (this.transitioning || this.$element.hasClass('open')) {
        return false;
      }
      startEvent = $.Event('show.movielog.collapse');
      this.$element.trigger(startEvent);
      if (startEvent.isDefaultPrevented()) {
        return false;
      }
      this.$element.removeClass('collapsed').addClass('opening').height(this.collapseHeight);
      this.transitioning = 1;
      this.$element.trigger('showing.movielog.collapse');
      complete = function() {
        this.$element.removeClass('opening').addClass('open');
        this.transitioning = 0;
        return this.$element.trigger('shown.movielog.collapse');
      };
      if (!$.support.transition) {
        return complete.call(this);
      }
      return this.$element.one($.support.transition.end, $.proxy(complete, this)).emulateTransitionEnd(350).height(this.$element[0].scrollHeight);
    };

    Collapse.prototype.hide = function() {
      var complete, startEvent;
      if (this.transitioning || !this.$element.hasClass('open')) {
        return false;
      }
      startEvent = $.Event('hide.movielog.collapse');
      this.$element.trigger(startEvent);
      if (startEvent.isDefaultPrevented()) {
        return false;
      }
      this.$element.height(this.$element.height())[0].offsetHeight;
      this.$element.addClass('collapsing').removeClass('collapsed').removeClass('open');
      this.transitioning = 1;
      this.$element.trigger($.Event('hiding.movielog.collapse'));
      complete = function() {
        this.transitioning = 0;
        return this.$element.trigger('hidden.movielog.collapse').removeClass('collapsing').addClass('collapsed');
      };
      if (!$.support.transition) {
        return complete.call(this);
      }
      return this.$element.height(this.options.collapseHeight).one($.support.transition.end, $.proxy(complete, this)).emulateTransitionEnd(350);
    };

    Collapse.prototype.toggle = function() {
      return this[this.$element.hasClass('open') ? 'hide' : 'show']();
    };

    return Collapse;

  })();


  /*
  COLLAPSE PLUGIN DEFINITION
   */

  old = $.fn.collapse;

  $.fn.collapse = function(option) {
    return this.each(function() {
      var $this, data, options;
      $this = $(this);
      data = $this.data('movielog.collapse');
      options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option === 'object' && option);
      if (!data) {
        $this.data('movielog.collapse', (data = new Collapse(this, options)));
      }
      if (typeof option === 'string') {
        return data[option]();
      }
    });
  };

  $.fn.collapse.Constructor = Collapse;


  /*
  COLLAPSE NO CONFLICT
   */

  $.fn.collapse.noConflict = function() {
    $.fn.collapse = old;
    return this;
  };


  /*
  COLLAPSE DATA-API
   */

  $(document).on('touchend.movielog.collapse.data-api click.movielog.collapse.data-api', '[data-toggle=collapse]', function(e) {
    var $parent, $target, $this, data, href, option, parent, target;
    e.preventDefault();
    $this = $(this);
    target = $this.attr('data-target') || e.preventDefault() || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '');
    $target = $(target);
    data = $target.data('movielog.collapse');
    parent = $target.attr('data-parent');
    $parent = parent && $(parent);
    if (data) {
      option = 'toggle';
    } else {
      option = $this.data();
      option.collapseHeight || (option.collapseHeight = $target.height());
    }
    if (!data || !data.transitioning) {
      if ($parent) {
        $parent.find('[data-parent="' + parent + '"]').not($target).css({
          height: ''
        }).removeClass('open');
      }
      $this[$target.hasClass('open') ? 'addClass' : 'removeClass']('collapsed');
    }
    return $target.collapse(option);
  });

}).call(this);
