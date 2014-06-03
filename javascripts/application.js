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
/*! $.noUiSlider
 *  Documentation available at:
 *  http://refreshless.com/nouislider/
 *
 *  Copyright Léon Gersen, https://twitter.com/LeonGersen
 *  Released under the WTFPL license
 *  http://www.wtfpl.net/about/
 */

/*jslint browser: true  */
/*jslint devel: true    */
/*jslint continue: true */
/*jslint plusplus: true */
/*jslint white: true    */


(function( $ ){

	'use strict';

	if ( $.zepto && !$.fn.removeData ) {
		throw new ReferenceError('Zepto is loaded without the data module.');
	}

	$.fn.noUiSlider = function( options ){

		var
		// Cache the document and body selectors;
		 doc = $(document)
		,body = $('body')

		// Namespace for binding and unbinding slider events;
		,namespace = '.nui'

		// Copy of the current value function;
		,$VAL = $.fn.val

		// Re-usable list of classes;
		,clsList = [
		/*  0 */  'noUi-base'
		/*  1 */ ,'noUi-origin'
		/*  2 */ ,'noUi-handle'
		/*  3 */ ,'noUi-input'
		/*  4 */ ,'noUi-active'
		/*  5 */ ,'noUi-state-tap'
		/*  6 */ ,'noUi-target'
		/*  7 */ ,'-lower'
		/*  8 */ ,'-upper'
		/*  9 */ ,'noUi-connect'
		/* 10 */ ,'noUi-vertical'
		/* 11 */ ,'noUi-horizontal'
		/* 12 */ ,'noUi-background'
		/* 13 */ ,'noUi-z-index'
		/* 14 */ ,'noUi-block'
		/* 15 */ ,'noUi-state-blocked'
		/* 16 */ ,'noUi-rtl'
		]

		// Determine the events to bind. IE11 implements pointerEvents without
		// a prefix, which breaks compatibility with the IE10 implementation.
		,actions = window.navigator.pointerEnabled ? {
			 start: 'pointerdown'
			,move: 'pointermove'
			,end: 'pointerup'
		} : window.navigator.msPointerEnabled ? {
			 start: 'MSPointerDown'
			,move: 'MSPointerMove'
			,end: 'MSPointerUp'
		} : {
			 start: 'mousedown touchstart'
			,move: 'mousemove touchmove'
			,end: 'mouseup touchend'
		};

		// (percentage) How many percent is this value of this range?
		function fromPercentage ( range, value ) {
			return (value * 100) / ( range[1] - range[0] );
		}
		// (percentage) Where is this value on this range?
		function toPercentage ( range, value ) {
			return fromPercentage( range, range[0] < 0 ?
				value + Math.abs(range[0]) :
					value - range[0] );
		}
		// (value) How much is this percentage on this range?
		function isPercentage ( range, value ) {
			return ((value * ( range[1] - range[0] )) / 100) + range[0];
		}

		// Test an array of objects, and calls them if they are a function.
		function call ( functions, scope, args ) {

			// Allow the passing of an unwrapped function.
			// Leaves other code a more comprehensible.
			if( !$.isArray( functions ) ){
				functions = [ functions ];
			}

			$.each( functions, function(){
				if (typeof this === 'function') {
					this.call(scope, args);
				}
			});
		}

		// Test in an object is an instance of jQuery or Zepto.
		function instance ( object ) {
			return object instanceof $ || ( $.zepto && $.zepto.isZ ( object ) );
		}

		function fixEvent ( e ) {

			// Prevent scrolling and panning on touch events, while
			// attempting to slide. The tap event also depends on this.
			e.preventDefault();

			// Filter the event to register the type, which can be
			// touch, mouse or pointer. Offset changes need to be
			// made on an event specific basis.
			var  touch = e.type.indexOf('touch') === 0
				,mouse = e.type.indexOf('mouse') === 0
				,pointer = e.type.indexOf('pointer') === 0
				,x,y, event = e;

			// IE10 implemented pointer events with a prefix;
			if ( e.type.indexOf('MSPointer') === 0 ) {
				pointer = true;
			}

			// Get the originalEvent, if the event has been wrapped
			// by jQuery. Zepto doesn't wrap the event.
			if ( e.originalEvent ) {
				e = e.originalEvent;
			}

			if ( touch ) {
				// noUiSlider supports one movement at a time,
				// so we can select the first 'changedTouch'.
				x = e.changedTouches[0].pageX;
				y = e.changedTouches[0].pageY;
			}
			if ( mouse || pointer ) {

				// Polyfill the pageXOffset and pageYOffset
				// variables for IE7 and IE8;
				if( !pointer && window.pageXOffset === undefined ){
					window.pageXOffset = document.documentElement.scrollLeft;
					window.pageYOffset = document.documentElement.scrollTop;
				}

				x = e.clientX + window.pageXOffset;
				y = e.clientY + window.pageYOffset;
			}

			return $.extend( event, { pointX: x, pointY: y, cursor: mouse } );
		}

		// Handler for attaching events trough a proxy
		function attach ( events, target, callback, scope, noAbstraction ) {

			// Add the noUiSlider namespace to all events.
			events = events.replace( /\s/g, namespace + ' ' ) + namespace;

			// The 'noAbstraction' argument can be set to prevent
			// event checking, and instead just proxy the event to
			// the right namespace.
			if ( noAbstraction ) {
				return target.on( events,
					$.proxy( callback, $.extend(target, scope) ));
			}

			// Make the callback available in a lower scope
			scope.handler = callback;

			return target.on( events, $.proxy( function( e ){

				// Test if there is anything that should prevent an event
				// from being handled, such as a disabled state or an active
				// 'tap' transition. Prevent interaction with disabled sliders.
				if( this.target.hasClass('noUi-state-tap') ||
					this.target.attr('disabled')) {
						return false;
				}

				// Call the event handler with the original event as argument.
				// The handler won't know it has been passed trough this
				// proxy, and it won't have to filter event validity, because
				// that was done here. Since the scope can just be 'this',
				// there is no need to use .call().
				this.handler( fixEvent ( e ) );

			}, scope ));
		}

		// Checks whether a variable is numerical.
		function isNumeric ( a ) {
			return !isNaN( parseFloat( a ) ) && isFinite( a );
		}

		// jQuery doesn't have a method to return a CSS value as a percentage.
		// Return -1 if the element doesn't have an offset yet.
		function getPercentage ( ) {
			var value = parseFloat(this.style[$(this).data('style')]);
			return isNaN(value) ? -1 : value;
		}

		// Storing the a value on a handle
		function serialize ( a ) {

			// Re-scope target for availability within .each;
			var target = this.target;

			// Get the value for this handle
			if ( a === undefined ) {
				return this.element.data('value');
			}

			// console.log(this.element.data())

			// Write the value to all serialization objects
			// or store a new value on the handle
			if ( a === true ) {
				a = this.element.data('value');
			} else {
				this.element.data('value', a);
			}

			// If the provided element was a function,
			// call it with the slider as scope. Otherwise,
			// simply call the function on the object.
			$.each( this.elements, function() {
				if ( typeof this === 'function' ) {
					this.call(target, a);
				} else {
					this[0][this[1]](a);
				}
			});
		}

		function inputValue ( ) {

			// Determine the correct position to set,
			// leave the other one unchanged.
			var val = [null, null];
			val[this.which] = this.val();

			// Trigger the 'set' callback
			this.target.val(val, true);
		}

		function test ( input, sliders ){

		//	Every input option is tested and parsed. This'll prevent
		//	endless validation in internal methods. These tests are
		//	structured with an item for every option available. An
		//	option can be marked as required by setting the 'r' flag.
		//	The testing function is provided with three arguments:
		//		- The provided value for the option;
		//		- A reference to the options object;
		//		- The name for the option;
		//
		//	The testing function returns false when an error is detected,
		//	or true when everything is OK. It can also modify the option
		//	object, to make sure all values can be correctly looped elsewhere.

			var tests = {
				/*	Handles.
				 *	Has default, can be 1 or 2.
				 */
				 'handles': {
					 r: true
					,t: function(q){
						q = parseInt(q, 10);
						return ( q === 1 || q === 2 );
					}
				}
				/*	Range.
				 *	Must be an array of two numerical floats,
				 *	which can't be identical.
				 */
				,'range': {
					 r: true
					,t: function(q,o,w){

						if ( q.length !== 2 ){
							return false;
						}

						// Reset the array to floats
						q = [ parseFloat(q[0]), parseFloat(q[1]) ];

						// Test if those floats are numerical
						if( !isNumeric(q[0]) || !isNumeric(q[1]) ){
							return false;
						}

						// When this test is run for range, the values can't
						// be identical.
						if( w==='range' && q[0] === q[1] ){
							return false;
						}

						// The lowest value must really be the lowest value.
						if( q[1] < q[0] ){
							return false;
						}

						o[w] = q;
						return true;
					}
				 }
				/*	Start.
				 *	Must be an array of two numerical floats when handles = 2;
				 *	Uses 'range' test.
				 *	When handles = 1, a single float is also allowed.
				 */
				,'start': {
					 r: true
					,t: function(q,o,w){
						if( o.handles === 1 ){
							if( $.isArray(q) ){
								q = q[0];
							}
							q = parseFloat(q);
							o.start = [q];
							return isNumeric(q);
						}
						return tests.range.t(q,o,w);
					}
				}
				/*	Connect.
				 *	Must be true or false when handles = 2;
				 *	Can use 'lower' and 'upper' when handles = 1.
				 */
				,'connect': {
					 t: function(q,o){
							return o.handles === 1 ?
								( q === 'lower' || q === 'upper' ) :
								typeof q === 'boolean';
					 }
				}
				/*	Connect.
				 *	Will default to horizontal, not required.
				 */
				,'orientation': {
					 t: function(q){
						return ( q === 'horizontal' || q === 'vertical' );
					}
				}
				/*	Margin.
				 *	Must be a float, has a default value.
				 */
				,'margin': {
					 r: true
					,t: function(q,o,w){
						q = parseFloat(q);
						o[w] = fromPercentage(o.range, q);
						return isNumeric(q);
					}
				}
				/*	Direction.
				 *	Required, can be 'ltr' or 'rtl'.
				 */
				,'direction': {
					 r: true
					,t: function(q,o,w){
						switch ( q ) {
							case 'ltr': o[w] = 0; break;
							case 'rtl': o[w] = 1; break;
							default: return false;
						}
						return true;
					}
				}
				/*	Serialization.
				 *	Required, but has default. 'resolution' and 'mark' option,
				 *	are allowed to be missing, 'to' isn't. Must be an array
				 *	when using two handles, can be a single value
				 *	when using one handle. 'mark' can only be period (.) or
				 *	comma (,) to make sure the value can be parsed properly.
				 */
				,'serialization': {
					 r: true
					,t: function(q,o,w){

						// Checks whether a variable is a candidate to be a
						// valid serialization target.
						function ser(r){
							return instance ( r )
								|| typeof r === 'string'
								|| typeof r === 'function'
								|| r === false
								|| ( instance ( r[0] ) &&
									 typeof r[0][r[1]] === 'function' );
						}

						// Flatten the serialization array into a reliable
						// set of elements, which can be tested and looped.
						function filter ( value ) {

							var items = [[],[]];

							// If a single value is provided it can be pushed
							// immediately.
							if ( ser(value) ) {
								items[0].push(value);
							} else {

								// Otherwise, determine whether this is an
								// array of single elements or sets.
								$.each(value, function(i, val) {

									// Don't handle an overflow of elements.
									if( i > 1 ){
										return;
									}

									// Decide if this is a group or not
									if( ser(val) ){
										items[i].push(val);
									} else {
										items[i] = items[i].concat(val);
									}
								});
							}

							return items;
						}

						if ( !q.to ) {
							o[w].to = [[],[]];
						} else {

							var i, j;

							// Flatten the serialization array
							q.to = filter ( q.to, 0 );

							// Reverse the API for RTL sliders.
							if ( o.direction && q.to[1].length ) {
								q.to.reverse();
							}

							// Test all elements in the flattened array.
							for ( i = 0; i < o.handles; i++ ) {
								for ( j = 0; j < q.to[i].length; j++ ) {

									// Return false on invalid input
									if( !ser(q.to[i][j]) ){
										return false;
									}

									// Remove 'false' elements, since those
									// won't be handled anyway.
									if( !q.to[i][j] ){
										q.to[i].splice(j, 1);
									}
								}
							}

							// Write the new values back
							o[w].to = q.to;
						}

						if ( !q.resolution ){
							o[w].resolution = 1;
						} else {
							switch(q.resolution){
								case 1:
								case 0.1:
								case 0.01:
								case 0.001:
								case 0.0001:
								case 0.00001:
									break;
								default:
									return false;
							}
						}

						if ( !q.mark ){
							o[w].mark = '.';
						} else if ( q.mark !== '.' && q.mark !== ',' ) {
							return false;
						}

						return true;
					}
				}
				/*	Slide.
				 *	Not required. Must be a function.
				 */
				,'slide': {
					 t: function(q){
						return typeof q === 'function';
					}
				}
				/*	Set.
				 *	Not required. Must be a function.
				 *	Tested using the 'slide' test.
				 */
				,'set': {
					 t: function(q,o){
						return tests.slide.t(q,o);
					}
				}
				/*	Block.
				 *	Not required. Must be a function.
				 *	Tested using the 'slide' test.
				 */
				,'block': {
					 t: function(q,o){
						return tests.slide.t(q,o);
					}
				}
				/*	Step.
				 *	Not required.
				 */
				,'step': {
					 t: function(q,o,w){
						q = parseFloat(q);
						o[w] = q;
						return isNumeric(q);
					}
				}
			};

			$.each( tests, function( name, test ){

				var value = input[name], isSet = ( value || value === 0 );

				// If the value is required but not set, fail.
				if( ( test.r && !isSet ) ||
				// If the test returns false, fail.
					( isSet && !test.t( value, input, name ) ) ){

					// For debugging purposes it might be very useful to know
					// what option caused the trouble. Since throwing an error
					// will prevent further script execution, log the error
					// first. Test for console, as it might not be available.
					if( console && console.log && console.group ){
						console.group( 'Invalid noUiSlider initialisation:' );
						console.log( 'Option:\t', name );
						console.log( 'Value:\t', value );
						console.log( 'Slider(s):\t', sliders );
						console.groupEnd();
					}

					throw new RangeError('noUiSlider');
				}
			});
		}

		function closest( value, to ){
			// Round a value to the closest 'to'.
			// Used with the 'step' option.
			return Math.round(value / to) * to;
		}

		function format ( value, options ) {

			// Round the value to the resolution that was set
			// with the serialization options.
			value = value.toFixed( options.decimals );

			// Apply the proper decimal mark to the value.
			return value.replace( '.', options.serialization.mark );
		}

		function block ( base, ignore, stateless ) {

			// Optionality disable calls to this function
			if ( ignore ) {
				return false;
			}

			var target = base.data('target');

			if ( !target.hasClass(clsList[14]) ){

				// The visual effect should not always be applied.
				if ( !stateless ) {
					target.addClass(clsList[15]);
					setTimeout(function(){
						target.removeClass(clsList[15]);
					}, 600);
				}

				target.addClass(clsList[14]);
				call( base.data('options').block, target );
			}

			return false;
		}

		function setHandle ( handle, to, ignore ) {
			var  settings = handle.data('options')
				,base = handle.data('base')
				,handles = base.data('handles')
				,edge, initial = handle[0].gPct()
				,val = handle.data('value');

			// Catch any attempt to drag beyond the slider edges.
			to = to < 0 ? 0 : to > 100 ? 100 : to;

			// Catch invalid user input
			if( !isNumeric( to ) || to === val) {
				return false;
			}

			// Handle the step option.
			if( settings.step ){
				to = closest( to, fromPercentage(
									 settings.range
									,settings.step )
							);
			}

			// Stop handling this call if the handle
			// won't step to a new value.
			if( to === initial && val) {
				return false;
			}

			if( handles.length > 1 ){

				// If there are multiple handles, they can't pass
				// each other, and they'll be limited to the other handle.
				if ( handle[0] === handles[1][0] ) {
					edge = handles[0][0].gPct() + settings.margin;
					to = to < edge ? edge : to;
				} else {
					edge = handles[1][0].gPct() - settings.margin;
					to = to > edge ? edge : to;
				}
			}

			// Limit 'to' to 0 - 100 again after all modifications
			to = to < 0 ? 0 : to > 100 ? 100 : to;

			// Stop handling this call if the handle can't move past another.
			if( to === initial && handle.data("value")) {
				return block( base, ignore, !settings.margin );
			}

			// If the slider can move, remove the class
			// indicating the block state.
			base.data('target').removeClass(clsList[14]);

			// Set handle to new location
			handle.css( handle.data('style'), to + '%' );

			// Force proper handle stacking
			if ( handle[0] === handles[0][0] ) {
				handle.children('.' + clsList[2])
						.toggleClass(clsList[13], to > 50 );
			}

			if ( settings.direction ) {
				to = 100 - to;
			}

			// Write the value to the serialization object.
			handle.data('store').val(
				format ( isPercentage( settings.range, to ), settings )
			);

			return true;
		}

		function storeElement ( handle, item, number ) {

			// Add a change event to the supplied jQuery objects,
			// which triggers the value-setting function on the target.
			if ( instance( item ) ) {

				var elements = [];

				// Link the field to the other handle if the
				// slider is inverted.
				if ( handle.data('options').direction ) {
					number = number ? 0 : 1;
				}

				// Loop all items so the change event is properly bound,
				// and the items can individually be added to the array.
				item.each(function(){

					attach ( 'change', $(this), inputValue, {
						 target: handle.data('target')
						,handle: handle
						,which: number
					}, true );

					elements.push ( [ $(this), 'val' ] );
				});

				return elements;
			}

			// Append a new input to the noUiSlider base.
			// Prevent the change event from flowing upward.
			if ( typeof item === 'string' ) {

				item = [ $('<input type="hidden" name="'+ item +'">')
					.appendTo(handle)
					.addClass(clsList[3])
					.change(function ( e ) {
						e.stopPropagation();
					}), 'val'];
			}

			return [item];
		}

		function store ( handle, i, serialization ) {

			var elements = [];

			// Loops all items in the provided serialization setting,
			// add the proper events to them or create new input fields,
			// and add them as data to the handle so they can be kept
			// in sync with the slider value.
			$.each( serialization.to[i], function( index ){
				elements = elements.concat(
					storeElement( handle, serialization.to[i][index], i )
				);
			});

			return {
				 element: handle
				,elements: elements
				,target: handle.data('target')
				,val: serialize
			};
		}

		function move( event ) {
			var base = this.base, proposal, baseSize;
			// console.log(this.startEvent)

			// Subtract the initial movement from the current event,
			// while taking vertical sliders into account.
			if ( this.handle.data('style') === 'left' ) {
				proposal = event.pointX - this.startEvent.pointX;
				baseSize = base.width();
			} else {
				proposal = event.pointY - this.startEvent.pointY;
				baseSize = base.height();
			}

			proposal = this.position + ( ( proposal * 100 ) / baseSize );
			if ( setHandle( this.handle, proposal ) ) {

				// Trigger the 'slide' event, if the handle was moved.
				call( base.data('options').slide, base.data('target') );
			}
		}

		function end ( event ) {

			// The handle is no longer active, so remove the class.
			this.handle.children('.' + clsList[2]).removeClass(clsList[4]);

			if ( event.cursor ) {

				// Remove cursor styles and text-selection events
				// which are bound to the body.
				body.css('cursor', '').off( namespace );
			}

			// Unbind move and end events, to prevent them stacking
			// over and over.
			doc.off( namespace );

			// Trigger the change event.
			this.target.removeClass(clsList[14]).change();

			// Trigger the 'end' callback.
			call( this.handle.data('options').set, this.target );
		}

		function start ( event ) {

			// Mark the handle as 'active' so it can be properly styled.
			this.handle.children('.' + clsList[2]).addClass(clsList[4]);

			// Prevent triggering of the 'tap' event.
			event.stopPropagation();

			if (!event.pointX) {
				event = fixEvent(event)
			}

			// Attach the move event handler, while
			// passing all relevant information along.
			attach ( actions.move, doc, move, {
				 startEvent: event
				,position: this.handle[0].gPct()
				,base: this.base
				,target: this.target
				,handle: this.handle
			});

			attach ( actions.end, doc, end, {
				 base: this.base
				,target: this.target
				,handle: this.handle
			});

			// Text selection isn't an issue on touch devices,
			// so adding additional callbacks isn't required.
			if ( event.cursor ) {

				// Prevent the 'I' cursor.
				body.css('cursor', 'default');

				// Prevent text selection when dragging the handles.
				body.on('selectstart' + namespace, function( ){
					return false;
				});
			}
		}

		function tap ( event ) {

			// If the target contains an active handle, don't trigger
			// this event. Tapping shouldn't be possible while dragging.
			if ( this.base.find('.' + clsList[4]).length ) {
				return;
			}

			// Getting variables from the event is not required, but
			// shortens other expressions and is far more convenient;
			var  i, handle, hCenter, base = this.base
				,handles = base.data('handles')
				,style = handles[0].data('style')
				,eventXY = event[style === 'left' ? 'pointX' : 'pointY']
				,baseSize = style === 'left' ? base.width() : base.height()
				,offset = {
					 handles: []
					,base: base.offset()
				};

			// Loop handles and add data to the offset list.
			for (i = 0; i < handles.length; i++ ) {
				offset.handles.push( handles[i].offset() );
			}

			// Calculate the central point between the handles;
			hCenter = handles.length === 1 ? 0 :
				(( offset.handles[0][style] + offset.handles[1][style] ) / 2 );

			// If there is just one handle,
			// or the lower handles in closest to the event,
			// select the first handle. Otherwise, pick the second.
			if ( handles.length === 1 || eventXY < hCenter ){
				handle = handles[0];
			} else {
				handle = handles[1];
			}

			// Flag the slider as it is now in a transitional state.
			// Transition takes 300 ms, so re-enable the slider afterwards.
			base.addClass(clsList[5]);
			setTimeout(function(){
				base.removeClass(clsList[5]);
			}, 300);

			// Calculate the new position for the handle and
			// trigger the movement.
			setHandle(
				 handle
				,(((eventXY - offset.base[style]) * 100) / baseSize)
			);

			// Trigger the 'slide' and 'set' callbacks,
			// pass the target so that it is 'this'.
			call( [ handle.data('options').slide
				   ,handle.data('options').set ]
				 ,base.data('target') );

			base.data('target').change();
		}

		function create ( options ) {

			// Set defaults where applicable;
			options = $.extend({
				 handles: 2
				,margin: 0
				,direction: 'ltr'
				,orientation: 'horizontal'
			}, options) || {};

			// Make sure the test for serialization runs.
			options.serialization = options.serialization || {};

			// Run all options through a testing mechanism to ensure correct
			// input. The test function will throw errors, so there is
			// no need to capture the result of this call. It should be noted
			// that options might get modified to be handled properly. E.g.
			// wrapping integers in arrays.
			test( options, this );

			return this.each(function(){

				// Target is the wrapper that will receive all external
				// scripting interaction. It has no styling and serves no
				// other function. Base is the internal main 'bar'.
				var target = $(this).addClass(clsList[6]), i, handle,
					// base = $('<div/>').appendTo(target),
					base = target.children('div').first(),
					d = options.direction,
					classes = {
						 base: [ clsList[0] ]
						,origin: [
							 [ clsList[1], clsList[1] + clsList[d?8:7] ]
							,[ clsList[1], clsList[1] + clsList[d?7:8] ]
						]
						,handle: [
							 [ clsList[2], clsList[2] + clsList[d?8:7] ]
							,[ clsList[2], clsList[2] + clsList[d?7:8] ]
						]
					};

				// Apply the required connection classes to the elements
				// that need them. Some classes are made up for several
				// segments listed in the class list, to allow easy
				// renaming and provide a minor compression benefit.
				if( options.connect ) {

					if ( d ) {

						if ( options.connect === 'lower' ) {
							options.connect = 'upper';
						} else if ( options.connect === 'upper' ) {
							options.connect = 'lower';
						}
					}

					if( options.connect === 'lower' ){
						// Add some styling classes to the base;
						classes.base.push(clsList[9], clsList[9] + clsList[7]);
						// When using the option 'Lower', there is only one
						// handle, and thus only one origin.
						classes.origin[0].push(clsList[12]);
					} else {
						classes.base.push(clsList[9] + clsList[8], clsList[12]);
						classes.origin[0].push(clsList[9]);
					}

				} else {
					classes.base.push(clsList[12]);
				}

				// Parse the syntactic sugar that is the serialization
				// resolution option to a usable integer.
				// Checking for a string '1', since the resolution needs
				// to be cast to a string to split in on the period.
				options.decimals = (function(d){
					d = d.toString().split('.');
					return d[0] === '1' ? 0 : d[1].length;
				}( options.serialization.resolution ));

				// Add classes for horizontal and vertical sliders.
				// The horizontal class is provided for completeness,
				// as it isn't used in the default theme.
				if ( options.orientation === 'vertical' ){
					classes.base.push(clsList[10]);
				} else {
					classes.base.push(clsList[11]);
				}

				// Merge base classes with default,
				// and store relevant data on the base element.
				base.addClass( classes.base.join(' ') ).data({
					 target: target
					,options: options
					,handles: []
				});

				// Make data accessible in functions throughout the plugin.
				target.data('base', base);

				if ( d ) {
					target.addClass(clsList[16]);
				}

				for (i = 0; i < options.handles; i++ ) {

					// handle = $('<div><div/></div>').appendTo(base);
					handle = $(base.children('div')[i]) //$('<div><div/></div>').appendTo(base);

					// Add all default and option-specific classes to the
					// origins and handles.
					handle.addClass(classes.origin[i].join(' '));
					handle.children().addClass(classes.handle[i].join(' '));

					// These events are only bound to the visual handle
					// element, not the 'real' origin element.
					attach ( actions.start, handle.children(), start, {
						 base: base
						,target: target
						,handle: handle
					});

					// Make sure every handle has access to all variables.
					handle.data({
						 base: base
						,target: target
						,options: options
						,style: options.orientation === 'vertical' ?
									'top' : 'left'
					});

					// Every handle has a storage point, which takes care
					// of triggering the proper serialization callbacks.
					handle.data({
						store: store(handle, i, options.serialization)
					});

					// Write a function to the native DOM element, since
					// jQuery doesn't have a way to get the current
					// value as a percentage.
					handle[0].gPct = getPercentage;

					// Store handles on the base
					base.data('handles').push(handle);
				}

				// Use the public value method to set the start values.
				target.val( options.start );

				// Attach the the tap event to the slider base.
				attach ( actions.start, base, tap, {
					 base: base
					,target: target
				});
			});
		}

		function getValue ( ) {

			var base = $(this).data('base'), answer = [];

			// Loop the handles, and get the value from the input
			// for every handle on its' own.
			$.each( base.data('handles'), function(){
				answer.push( $(this).data('store').val() );
			});

			// If the slider has just one handle, return a single value.
			// Otherwise, return an array, which is in reverse order
			// if the slider is used RTL.
			if ( answer.length === 1 ) {
				return answer[0];
			}

			if ( base.data('options').direction ) {
				return answer.reverse();
			}

			return answer;
		}

		function setValue ( args, set ) {

			// If the value is to be set to a number, which is valid
			// when using a one-handle slider, wrap it in an array.
			if( !$.isArray(args) ){
				args = [args];
			}

			// Setting is handled properly for each slider in the data set.
			return this.each(function(){

				var handles = Array.prototype.slice.call(
								$(this).data('base').data('handles'), 0),
					settings = handles[0].data('options'), to, i;

				// If there are multiple handles to be set run the setting
				// mechanism twice for the first handle, to make sure it
				// can be bounced of the second one properly.
				if ( handles.length > 1) {
					handles[2] = handles[0];
				}

				// The RTL settings is implemented by reversing the front-end,
				// internal mechanisms are the same.
				if ( settings.direction ) {
					args.reverse();
				}

				for ( i = 0; i < handles.length; i++ ){

					// Calculate a new position for the handle.
					to = args[ i%2 ];

					// The set request might want to ignore this handle.
					// Test for 'undefined' too, as a two-handle slider
					// can still be set with an integer.
					if( to === null || to === undefined ) {
						continue;
					}

					// Add support for the comma (,) as a decimal symbol.
					// Replace it by a period so it is handled properly by
					// parseFloat. Omitting this would result in a removal
					// of decimals. This way, the developer can also
					// input a comma separated string.
					if( $.type(to) === 'string' ) {
						to = to.replace(',', '.');
					}

					// Calculate the new handle position
					to = toPercentage( settings.range, parseFloat( to ) );

					// Invert the value if this is an right-to-left slider.
					if ( settings.direction ) {
						to = 100 - to;
					}

					// If the value of the input doesn't match the slider,
					// reset it. Sometimes the input is changed to a value the
					// slider has rejected. This can occur when using 'select'
					// or 'input[type="number"]' elements. In this case, set
					// the value back to the input.
					if ( !setHandle( handles[i], to, true ) ){
						handles[i].data('store').val( true );
						// console.log(handles[i].data('store'));
					}

					// Optionally trigger the 'set' event.
					if( set === true ) {
						call( settings.set, $(this) );
					}
				}
			});
		}

		// Overwrite the native jQuery value function
		// with a simple handler. noUiSlider will use the internal
		// value method, anything else will use the standard method.
		$.fn.val = function(){

			// If the function is called without arguments,
			// act as a 'getter'. Call the getValue function
			// in the same scope as this call.
			if ( this.hasClass( clsList[6] ) ){
				return arguments.length ?
					setValue.apply( this, arguments ) :
					getValue.apply( this );
			}

			// If this isn't noUiSlider, continue with jQuery's
			// original method.
			return $VAL.apply( this, arguments );
		};

		return create.call( this, options );
	};

}( window.jQuery || window.Zepto ));
(function() {
  "use strict";
  var Filterer, old, underscoreDebounce;

  Filterer = (function() {
    function Filterer(element, options) {
      this.$element = $(element);
      this.options = $.extend({}, Filterer.DEFAULTS, options);
      this.attribute = options.attribute;
      this.$items = $(this.options.target).find(this.options.itemsSelector);
      this.filters = [];
    }

    Filterer.DEFAULTS = {
      attribute: 'text',
      itemsSelector: 'li'
    };


    /*
    Copyright 2009 Nicholas C. Zakas. All rights reserved. MIT Licensed
     */

    Filterer.timedChunk = function(items, process, context, callback) {
      var processItem, todo;
      todo = items.concat();
      processItem = function() {
        var start;
        start = +new Date();
        while (true) {
          process.call(context, todo.shift());
          if (!(todo.length > 0 && (+new Date() - start < 50))) {
            break;
          }
        }
        if (todo.length > 0) {
          return setTimeout(processItem, 25);
        } else if (callback) {
          return callback(items);
        }
      };
      return setTimeout(processItem, 25);
    };

    Filterer.prototype.addFilter = function(filter) {
      if (this.filters.indexOf(filter) === -1) {
        return this.filters.push(filter);
      }
    };

    Filterer.prototype.filter = function() {
      var filter, matchItem, matcher, matchers, _i, _len, _ref;
      matchers = [];
      _ref = this.filters;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        filter = _ref[_i];
        matcher = filter.matcher();
        if (matcher != null) {
          matchers.push(matcher);
        }
      }
      matchItem = function(item) {
        var match, _j, _len1;
        match = true;
        for (_j = 0, _len1 = matchers.length; _j < _len1; _j++) {
          matcher = matchers[_j];
          if (!matcher(item)) {
            match = false;
            break;
          }
        }
        if (match) {
          return item.removeAttribute('style');
        } else {
          return item.style.display = 'none';
        }
      };
      return Filterer.timedChunk(this.$items.get(), matchItem);
    };

    return Filterer;

  })();


  /*
  FILTERER PLUGIN DEFINITION
   */

  old = $.fn.filterer;

  $.fn.filterer = function(option) {
    return this.each(function() {
      var $this, data, options;
      $this = $(this);
      data = $this.data('movielog.filterer');
      options = $.extend({}, Filterer.DEFAULTS, $this.data(), typeof option === 'object' && option);
      if (!data) {
        $this.data('movielog.filterer', (data = new Filterer(this, options)));
      }
      if (typeof option === 'string') {
        return data[option]();
      }
    });
  };

  $.fn.filterer.Constructor = Filterer;


  /*
  FILTERER NO CONFLICT
   */

  $.fn.filterer.noConflict = function() {
    $.fn.filterer = old;
    return this;
  };


  /*
  FILTERER DATA-API
   */


  /*
  Borrowed from underscore.js
   */

  underscoreDebounce = function(func, wait, immediate) {
    return function() {
      var args, callNow, context, later, timeout, timestamp;
      context = this;
      args = arguments;
      timestamp = new Date();
      later = function() {
        var last, result, timeout;
        last = (new Date()) - timestamp;
        if (last < wait) {
          return timeout = setTimeout(later, wait - last);
        } else {
          timeout = null;
          if (!immediate) {
            return result = func.apply(context, args);
          }
        }
      };
      callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) {
        return func.apply(context, args);
      }
    };
  };

  $(document).on('filter-changed.movielog.data-api', '[data-filter-controls]', function(e) {
    var $filterer, $target, $this;
    $this = $(this);
    $target = $(e.target);
    $filterer = $this.filterer().data('movielog.filterer');
    $filterer.addFilter($target.data('movielog.filter'));
    return underscoreDebounce(function() {
      return $filterer.filter();
    }, 50)();
  });

}).call(this);
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
(function() {
  var $, toggle;

  $ = window.jQuery;

  toggle = function(value) {
    if (value) {
      return 'addClass';
    } else {
      return 'removeClass';
    }
  };

  $(document).on('input', '.clearable-wrap', function(e) {
    var target;
    target = e.target;
    return $(this)[toggle(target.value)]('has-value');
  });

  $(document).on('mousemove', '.has-value', function(e) {
    return $(this)[toggle(this.offsetWidth - 22 < e.clientX - this.getBoundingClientRect().left)]('is-on-clear-button');
  });

  $(document).on('click', '.is-on-clear-button', function(e) {
    $(this).removeClass('has-value is-on-clear-button');
    return $(this).find('input').val('').trigger('keyup');
  });

}).call(this);
(function() {


}).call(this);
