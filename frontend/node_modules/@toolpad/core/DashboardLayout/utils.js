"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDrawerSxTransitionMixin = getDrawerSxTransitionMixin;
exports.getDrawerWidthTransitionMixin = getDrawerWidthTransitionMixin;
function getDrawerSxTransitionMixin(isExpanded, property) {
  return {
    transition: theme => theme.transitions.create(property, {
      easing: theme.transitions.easing.sharp,
      duration: isExpanded ? theme.transitions.duration.enteringScreen : theme.transitions.duration.leavingScreen
    })
  };
}
function getDrawerWidthTransitionMixin(isExpanded) {
  return {
    ...getDrawerSxTransitionMixin(isExpanded, 'width'),
    overflowX: 'hidden'
  };
}