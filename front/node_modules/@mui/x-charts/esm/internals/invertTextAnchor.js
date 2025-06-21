export function invertTextAnchor(textAnchor) {
  switch (textAnchor) {
    case 'start':
      return 'end';
    case 'end':
      return 'start';
    default:
      return textAnchor;
  }
}