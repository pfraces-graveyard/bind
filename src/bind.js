define('bind', function (require) {
  'use strict';

  var path  = require('mu.tree.path');

  var dom   = require('domo').use({
    attr    : require('domo.attr'),
    val     : require('domo.val'),
    html    : require('domo.html'),
    onInput : require('domo.on.input')
  });

  var bind = function (selector, model) {
    var template = dom(dom(selector).html());

    dom(template, '[bind]').each(function (node) {
      var tagName = node.tagName.toLowerCase(),
          $node = dom(node),
          expr = $node.attr('bind').split('.'),
          index = expr.pop(),
          parent = path(model, expr);

      if (tagName === 'input') {
        parent.on(index, $node.val);
        $node.onInput(parent[index]);
        return;
      }

      parent.on(index, $node.html);
    });

    return template;
  };

  return bind;
});
