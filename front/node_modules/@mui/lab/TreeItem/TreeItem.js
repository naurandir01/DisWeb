"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
let warnedOnce = false;
const warn = () => {
  if (!warnedOnce) {
    console.warn(['MUI: The TreeItem component was moved from `@mui/lab` to `@mui/x-tree-view`.', '', "You should use `import { TreeItem } from '@mui/x-tree-view'`", "or `import { TreeItem } from '@mui/x-tree-view/TreeItem'`", '', 'More information about this migration on our blog: https://mui.com/blog/lab-tree-view-to-mui-x/.'].join('\n'));
    warnedOnce = true;
  }
};
/**
 * @deprecated The TreeItem component was moved from `@mui/lab` to `@mui/x-tree-view`. More information about this migration on our blog: https://mui.com/blog/lab-tree-view-to-mui-x/.
 * @ignore - do not document.
 */
const TreeItem = /*#__PURE__*/React.forwardRef(function DeprecatedTreeItem() {
  warn();
  return null;
});
var _default = exports.default = TreeItem;