import * as React from 'react';
export interface GridPanelTrigger {
  setRef: (instance: HTMLElement | null) => void;
  element: HTMLElement | null;
}
export interface GridPanelContextValue {
  triggers: {
    filterPanel: GridPanelTrigger;
    aiAssistantPanel: GridPanelTrigger;
    columnsPanel: GridPanelTrigger;
  };
}
export declare const GridPanelContext: React.Context<GridPanelContextValue | undefined>;
export declare function useGridPanelContext(): GridPanelContextValue;
export declare function GridPanelContextProvider({
  children
}: {
  children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;