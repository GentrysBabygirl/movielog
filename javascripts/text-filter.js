(function() {
  "use strict";
  var $, TextFilter, old;

  $ = window.jQuery;

  TextFilter = (function() {
    function TextFilter(element, options) {
      this.$element = $(element);
      this.options = $.extend({}, TextFilter.DEFAULTS, options);
      this.attribute = this.options.filterAttribute;
    }

    TextFilter.DEFAULTS = {
      filterAttribute: 'text'
    };

    TextFilter.prototype.matcher = function() {
      var regex;
      if (!this.$element.val()) {
        return null;
      }
      regex = new RegExp(this.$element.val(), 'i');
      return (function(_this) {
        return function(item) {
          return regex.test(item.getAttribute(_this.attribute));
        };
      })(this);
    };

    return TextFilter;

  })();


  /*
  TEXTFILTER PLUGIN DEFINITION
   */

  old = $.fn.textFilter;

  $.fn.textFilter = function(option) {
    return this.each(function() {
      var $this, data, options;
      $this = $(this);
      data = $this.data('movielog.filter');
      options = $.extend({}, TextFilter.DEFAULTS, $this.data(), typeof option === 'object' && option);
      if (!data) {
        $this.data('movielog.filter', (data = new TextFilter(this, options)));
      }
      if (typeof option === 'string') {
        return data[option]();
      } else {
        return data;
      }
    });
  };

  $.fn.textFilter.Constructor = TextFilter;


  /*
  TEXTFILTER NO CONFLICT
   */

  $.fn.textFilter.noConflict = function() {
    $.fn.textFilter = old;
    return this;
  };


  /*
  FILTERER DATA-API
   */

  $(document).on('keyup.text-filter.movielog.data-api', '[data-filter-type="text"]', function(e) {
    return $(this).textFilter().trigger($.Event('filter-changed.movielog'));
  });

}).call(this);
