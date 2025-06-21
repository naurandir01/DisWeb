"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _chartsBaseSlots = require("./chartsBaseSlots");
Object.keys(_chartsBaseSlots).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _chartsBaseSlots[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _chartsBaseSlots[key];
    }
  });
});
var _chartsBaseSlotProps = require("./chartsBaseSlotProps");
Object.keys(_chartsBaseSlotProps).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _chartsBaseSlotProps[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _chartsBaseSlotProps[key];
    }
  });
});
var _chartsIconSlots = require("./chartsIconSlots");
Object.keys(_chartsIconSlots).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _chartsIconSlots[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _chartsIconSlots[key];
    }
  });
});