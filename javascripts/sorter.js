(function() {
  "use strict";
  var Sorter, old;

  Sorter = (function() {
    function Sorter(element, options) {
      this.$element = $(element);
      this.options = $.extend({}, Sorter.DEFAULTS, options);
      this.$target = $(this.options.target);
      this.dataMap = Sorter.mapItems(this.$target.find(this.options.itemsSelector));
    }

    Sorter.DEFAULTS = {
      itemsSelector: 'li'
    };

    Sorter.descendingSort = function(a, b) {
      return -1 * Sorter.ascendingSort(a, b);
    };

    Sorter.ascendingSort = function(a, b) {
      if (typeof a === 'string') {
        return a.value.localeCompare(b.value);
      } else {
        if (a.value === b.value) {
          return 0;
        } else {
          if (a.value > b.value) {
            return 1;
          } else {
            return -1;
          }
        }
      }
    };

    Sorter.removeElementToInsertLater = function(element) {
      var nextSibling, parentNode;
      parentNode = element.parentNode;
      nextSibling = element.nextSibling;
      parentNode.removeChild(element);
      return function() {
        if (nextSibling) {
          return parentNode.insertBefore(element, nextSibling);
        } else {
          return parentNode.appendChild(element);
        }
      };
    };

    Sorter.mapItems = function(items) {
      var $item, data, item, key, map, value, _i, _len;
      map = [];
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        $item = $(item);
        data = $item.data();
        for (key in data) {
          value = data[key];
          if (map[key] == null) {
            map[key] = [];
          }
          map[key].push({
            item: item,
            value: value
          });
        }
      }
      return map;
    };

    Sorter.prototype.sort = function() {
      var attribute, list, reinsert, sortOrder, sortedItem, sortedItems, value, _i, _len, _ref;
      value = this.$element.val();
      list = this.$target[0];
      reinsert = Sorter.removeElementToInsertLater(list);
      this.$target.empty();
      _ref = (/(.*)-(asc|desc)$/.exec(value)).slice(1, 3), attribute = _ref[0], sortOrder = _ref[1];
      sortedItems = this.dataMap[jQuery.camelCase(attribute)].sort(sortOrder === 'desc' ? Sorter.descendingSort : Sorter.ascendingSort);
      for (_i = 0, _len = sortedItems.length; _i < _len; _i++) {
        sortedItem = sortedItems[_i];
        list.appendChild(sortedItem.item);
      }
      return reinsert();
    };

    return Sorter;

  })();


  /*
  SORTER PLUGIN DEFINITION
   */

  old = $.fn.sorter;

  $.fn.sorter = function(option) {
    return this.each(function() {
      var $this, data, options;
      $this = $(this);
      data = $this.data('movielog.sorter');
      options = $.extend({}, Sorter.DEFAULTS, $this.data(), typeof option === 'object' && option);
      if (!data) {
        $this.data('movielog.sorter', (data = new Sorter(this, options)));
      }
      if (typeof option === 'string') {
        return data[option]();
      }
    });
  };

  $.fn.sorter.Constructor = Sorter;


  /*
  SORTER NO CONFLICT
   */

  $.fn.sorter.noConflict = function() {
    $.fn.sorter = old;
    return this;
  };


  /*
  SORTER DATA-API
   */

  $(document).on('change.movielog.sort', '[data-sorter]', function(e) {
    return $(this).sorter('sort');
  });

}).call(this);
