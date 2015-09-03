define('bind', function (require) {
  'use strict';

  var reduce = require('mu.list.reduce'),
      path   = require('mu.tree.path');

  var dom    = require('domo').use({
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

  var fragment = function(html) {
    var doc = document.createDocumentFragment(),
        div = document.createElement('div'),
        it;

    div.innerHTML = html;
    while (it = div.firstChild) { doc.appendChild(it); }
    return doc;
  };

  var bind = function (id, model) {
    var template = fragment(document.getElementById(id).innerHTML);

    dom('[bind]', template).native(function (node) {
      var el = element(node),
          $el = dom(node),
          expr = el.attr.bind.split('.'),
          index = expr.pop(),
          parent = path(model, expr);

      if (el.name === 'input') {
        parent.on(index, $el.val);
        $el.onInput(parent[index]);
        return;
      }

      parent.on(index, $el.html);
    });

    return template;
  };

  return bind;
});
