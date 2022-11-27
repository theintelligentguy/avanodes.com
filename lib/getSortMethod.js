import get from 'lodash/get'
import isNaN from 'lodash/isNaN'

export const getSortMethod = (sortingMap) => (...args) => {
  var _args = [...args]
  return function(a, b) {
    for (var x in _args) {
      const field = get(sortingMap, _args[x].substring(1))
      if (!field) {
        continue
      }
      var ax = get(a, field);
      var bx = get(b, field);
      var cx;

      ax = typeof ax === "string"
        ? (isNaN(new Number(ax))
          ? ax.toLowerCase()
          : ax / 1)
        : ax / 1;
      bx = typeof bx === "string"
        ? (isNaN(new Number(bx))
          ? bx.toLowerCase()
          : bx / 1)
        : bx / 1;

      if (_args[x].substring(0,1) === "-") {
        cx = ax;
        ax = bx;
        bx = cx;
      }
      if (ax != bx) {
        return ax < bx ? -1 : 1;
      }
    }
  }
}
