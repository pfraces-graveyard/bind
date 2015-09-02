define('bind', function (require) {
  'use strict';

  var reduce = require('mu.list.reduce'),
      path   = require('mu.tree.path');

  var dom    = require('domo').use({
    clone    : require('domo.clone'),
    native   : require('domo.native'),
    val      : require('domo.val'),
    onInput  : require('domo.on.input')
  });

  var attributes = function (node) {
    return reduce(node.attributes, {}, function (acc, item) {
      acc[item.name] = item.value;
      return acc;
    });
  };

  var element = function (node) {
    return {
      name: node.tagName.toLowerCase(),
      attr: attributes(node)
    };
  };

  var bind = function (selector, model) {
    var template = dom(selector).clone();
    template.outerHTML = template.innerHTML;

    dom('[bind=*]', template).native(function (node) {
      var el = element(node),
          expr = el.attr.bind.split('.'),
          index = expr.pop(),
          parent = path(model, expr),
          $el = dom(el);

      parent.on(index, $el.val);
      $el.onInput(parent[index]);
    });

    return template;
  };

  return bind;
});
