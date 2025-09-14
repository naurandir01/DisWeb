export const seriesContextBuilder = context => ({
  type: 'series',
  color: context.color,
  label: context.label,
  seriesId: context.seriesId,
  itemId: context.itemId
});