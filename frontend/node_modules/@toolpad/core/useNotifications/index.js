"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _useNotifications = require("./useNotifications");
Object.keys(_useNotifications).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _useNotifications[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useNotifications[key];
    }
  });
});
var _NotificationsProvider = require("./NotificationsProvider");
Object.keys(_NotificationsProvider).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _NotificationsProvider[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _NotificationsProvider[key];
    }
  });
});