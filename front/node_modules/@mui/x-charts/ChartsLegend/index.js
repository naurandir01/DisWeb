"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  legendClasses: true,
  continuousColorLegendClasses: true,
  piecewiseColorLegendClasses: true,
  piecewiseColorDefaultLabelFormatter: true
};
Object.defineProperty(exports, "continuousColorLegendClasses", {
  enumerable: true,
  get: function () {
    return _continuousColorLegendClasses.continuousColorLegendClasses;
  }
});
Object.defineProperty(exports, "legendClasses", {
  enumerable: true,
  get: function () {
    return _chartsLegendClasses.legendClasses;
  }
});
Object.defineProperty(exports, "piecewiseColorDefaultLabelFormatter", {
  enumerable: true,
  get: function () {
    return _piecewiseColorDefaultLabelFormatter.piecewiseColorDefaultLabelFormatter;
  }
});
Object.defineProperty(exports, "piecewiseColorLegendClasses", {
  enumerable: true,
  get: function () {
    return _piecewiseColorLegendClasses.piecewiseColorLegendClasses;
  }
});
var _ChartsLegend = require("./ChartsLegend");
Object.keys(_ChartsLegend).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _ChartsLegend[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _ChartsLegend[key];
    }
  });
});
var _chartsLegend = require("./chartsLegend.types");
Object.keys(_chartsLegend).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _chartsLegend[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _chartsLegend[key];
    }
  });
});
var _direction = require("./direction");
Object.keys(_direction).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _direction[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _direction[key];
    }
  });
});
var _legendContext = require("./legendContext.types");
Object.keys(_legendContext).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _legendContext[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _legendContext[key];
    }
  });
});
var _chartsLegendClasses = require("./chartsLegendClasses");
var _ContinuousColorLegend = require("./ContinuousColorLegend");
Object.keys(_ContinuousColorLegend).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _ContinuousColorLegend[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _ContinuousColorLegend[key];
    }
  });
});
var _colorLegend = require("./colorLegend.types");
Object.keys(_colorLegend).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _colorLegend[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _colorLegend[key];
    }
  });
});
var _continuousColorLegendClasses = require("./continuousColorLegendClasses");
var _PiecewiseColorLegend = require("./PiecewiseColorLegend");
Object.keys(_PiecewiseColorLegend).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _PiecewiseColorLegend[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _PiecewiseColorLegend[key];
    }
  });
});
var _piecewiseColorLegendClasses = require("./piecewiseColorLegendClasses");
var _piecewiseColorDefaultLabelFormatter = require("./piecewiseColorDefaultLabelFormatter");
var _legend = require("./legend.types");
Object.keys(_legend).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _legend[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _legend[key];
    }
  });
});