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
