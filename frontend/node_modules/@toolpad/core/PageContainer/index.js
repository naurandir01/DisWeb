"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _PageContainer = require("./PageContainer");
Object.keys(_PageContainer).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _PageContainer[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _PageContainer[key];
    }
  });
});
var _PageHeader = require("./PageHeader");
Object.keys(_PageHeader).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _PageHeader[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _PageHeader[key];
    }
  });
});
var _PageHeaderToolbar = require("./PageHeaderToolbar");
Object.keys(_PageHeaderToolbar).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _PageHeaderToolbar[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _PageHeaderToolbar[key];
    }
  });
});