(function() {
  "use strict";
  var $, RadioFilter, old;

  $ = window.jQuery;

  RadioFilter = (function() {
    function RadioFilter(element, options) {
      this.$element = $(element);
      this.options = $.extend({}, RadioFilter.DEFAULTS, options);
      this.attribute = this.options.filterAttribute;
      this.$inputs = this.$element.find('input[type="radio"]');
    }

    RadioFilter.DEFAULTS = {
      filterAttribute: 'text',
      changeEventName: 'changed.radioFilter'
    };

    RadioFilter.getFilterValue = function($inputs) {
      var filterValue;
      filterValue = function(input) {
        var id, name, regex;
        name = input.getAttribute('name');
        id = input.getAttribute('id');
        regex = new RegExp("^" + name + "_(.*)$", 'i');
        return (regex.exec(id))[1];
      };
      return $inputs.filter(":checked")[0].value;
    };

    RadioFilter.prototype.matcher = function() {
      var filter, regex;
      filter = RadioFilter.getFilterValue(this.$element.find('input[type="radio"]'));
      regex = new RegExp("^" + filter + "$", 'i');
      return (function(_this) {
        return function(item) {
          if (!filter || filter === "on") {
            return true;
          }
          return regex.test(item.getAttribute(_this.attribute));
        };
      })(this);
    };

    return RadioFilter;

  })();


  /*
  RADIOFILTER PLUGIN DEFINITION
   */

  old = $.fn.radioFilter;

  $.fn.radioFilter = function(option) {
    return this.each(function() {
      var $this, data, options;
      $this = $(this);
      data = $this.data('movielog.filter');
      options = $.extend({}, RadioFilter.DEFAULTS, $this.data(), typeof option === 'object' && option);
      if (!data) {
        $this.data('movielog.filter', (data = new RadioFilter(this, options)));
      }
      if (typeof option === 'string') {
        return data[option]();
      }
    });
  };

  $.fn.radioFilter.Constructor = RadioFilter;


  /*
  RADIOFILTER NO CONFLICT
   */

  $.fn.rangeFilter.noConflict = function() {
    $.fn.radioFilter = old;
    return this;
  };


  /*
  SORTER DATA-API
   */

  $(document).on('change.movielog.radio-filter', '[data-filter-type="radio"]', function(e) {
    var $this;
    $this = $(this);
    $this.radioFilter().trigger($.Event('filter-changed.movielog'));
    $this.find('label').removeClass('active');
    return $(e.target).parent('label').toggleClass("active");
  });

}).call(this);
