(function() {
  "use strict";
  var $, RatingRangeFilter, old,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $ = window.jQuery;

  RatingRangeFilter = (function(_super) {
    __extends(RatingRangeFilter, _super);

    function RatingRangeFilter(element, options) {
      options = $.extend({}, RatingRangeFilter.DEFAULTS, options);
      RatingRangeFilter.__super__.constructor.call(this, element, options);
    }

    RatingRangeFilter.DEFAULTS = {
      filterAttribute: 'text',
      filterMinValue: 1,
      filterMaxValue: 11,
      changeEventName: 'filter-changed.movielog',
      onSlide: function() {
        var values;
        values = this.slider.val();
        this.$element.find('.filter-range__min .rating').html(RatingRangeFilter.ratingTag(values[0]));
        return this.$element.find('.filter-range__max .rating').html(RatingRangeFilter.ratingTag(values[1]));
      }
    };

    RatingRangeFilter.ratingTag = function(rating) {
      var parseRating, ratingStar;
      ratingStar = function(char) {
        switch (char) {
          case '☆':
            return '<span class="rating-star-empty">☆</span>';
          case '½':
            return '<span class="rating-star-half">½</span>';
          case '★':
            return '<span class="rating-star-full">★</span>';
        }
      };
      parseRating = function(ratingString) {
        var star;
        return ((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = ratingString.length; _i < _len; _i++) {
            star = ratingString[_i];
            _results.push(ratingStar(star));
          }
          return _results;
        })()).join('');
      };
      switch (+rating) {
        case 1:
          return parseRating('☆☆☆☆☆');
        case 2:
          return parseRating('½☆☆☆☆');
        case 3:
          return parseRating('★☆☆☆☆');
        case 4:
          return parseRating('★½☆☆☆');
        case 5:
          return parseRating('★★☆☆☆');
        case 6:
          return parseRating('★★½☆☆');
        case 7:
          return parseRating('★★★☆☆');
        case 8:
          return parseRating('★★★½☆');
        case 9:
          return parseRating('★★★★☆');
        case 10:
          return parseRating('★★★★½');
        case 11:
          return parseRating('★★★★★');
      }
    };

    return RatingRangeFilter;

  })($.fn.rangeFilter.Constructor);


  /*
  RATINGRANGEFILTER PLUGIN DEFINITION
   */

  old = $.fn.rangeFilter;

  $.fn.ratingRangeFilter = function(option) {
    return this.each(function() {
      var $this, data, options;
      $this = $(this);
      data = $this.data('movielog.filter');
      options = $.extend({}, RatingRangeFilter.DEFAULTS, $this.data(), typeof option === 'object' && option);
      if (!data) {
        $this.data('movielog.filter', (data = new RatingRangeFilter(this, options)));
      }
      if (typeof option === 'string') {
        return data[option]();
      }
    });
  };

  $.fn.ratingRangeFilter.Constructor = RatingRangeFilter;


  /*
  RATINGRANGEFILTER NO CONFLICT
   */

  $.fn.ratingRangeFilter.noConflict = function() {
    $.fn.rangeFilter = old;
    return this;
  };


  /*
  RATINGRANGEFILTER DATA-API
   */

  $(document).on("mousedown.range-filter.movielog.data-api MSPointerDown.range-filter.movielog.data-api touchstart.range-filter.movielog.data-api", "[data-filter-type='rating-range']", function(e) {
    var $this;
    $this = $(this);
    if (!$this.data('movielog.filter')) {
      console.log("init");
      e.preventDefault();
      $this.ratingRangeFilter();
      return $(e.target).trigger(e);
    }
  });

}).call(this);
