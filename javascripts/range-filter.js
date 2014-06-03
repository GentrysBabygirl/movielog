(function() {
  "use strict";
  var $, RangeFilter, old;

  $ = window.jQuery;

  RangeFilter = (function() {
    function RangeFilter(element, options) {
      this.$element = $(element);
      this.options = $.extend({}, RangeFilter.DEFAULTS, options);
      this.attribute = this.options.filterAttribute;
      this.slider = this.$element.find('.noUiSlider').noUiSlider({
        range: [this.options.filterMinValue, this.options.filterMaxValue],
        start: [this.options.filterMinValue, this.options.filterMaxValue],
        step: 1,
        slide: (function(_this) {
          return function() {
            $.proxy(_this.options.onSlide, _this)();
            return _this.$element.trigger($.Event(_this.options.changeEventName));
          };
        })(this)
      });
    }

    RangeFilter.DEFAULTS = {
      filterAttribute: 'text',
      filterMinValue: 1,
      filterMaxValue: 10,
      changeEventName: 'filter-changed.movielog',
      onSlide: function() {
        var values;
        values = this.slider.val();
        this.$element.find('.filter-range__min').text(values[0]);
        return this.$element.find('.filter-range__max').text(values[1]);
      }
    };

    RangeFilter.prototype.matcher = function() {
      var range;
      range = this.slider.val();
      if (range[0] === this.options.filterMinValue && range[1] === this.options.filterMaxValue) {
        return null;
      }
      return (function(_this) {
        return function(item) {
          var value;
          value = parseInt(item.getAttribute(_this.attribute));
          return value >= range[0] && value <= range[1];
        };
      })(this);
    };

    return RangeFilter;

  })();


  /*
  RANGEFILTER PLUGIN DEFINITION
   */

  old = $.fn.rangeFilter;

  $.fn.rangeFilter = function(option) {
    return this.each(function() {
      var $this, data, options;
      $this = $(this);
      data = $this.data('movielog.filter');
      options = $.extend({}, RangeFilter.DEFAULTS, $this.data(), typeof option === 'object' && option);
      if (!data) {
        $this.data('movielog.filter', (data = new RangeFilter(this, options)));
      }
      if (typeof option === 'string') {
        return data[option]();
      }
    });
  };

  $.fn.rangeFilter.Constructor = RangeFilter;


  /*
  RANGEFILTER NO CONFLICT
   */

  $.fn.rangeFilter.noConflict = function() {
    $.fn.rangeFilter = old;
    return this;
  };


  /*
  RANGEFILTER DATA-API
   */

  $(document).on("mousedown.range-filter.movielog.data-api MSPointerDown.range-filter.movielog.data-api touchstart.range-filter.movielog.data-api", "[data-filter-type='range']", function(e) {
    var $this;
    $this = $(this);
    if (!$this.data('movielog.filter')) {
      console.log("init");
      e.preventDefault();
      $this.rangeFilter();
      return $(e.target).trigger(e);
    }
  });

}).call(this);
