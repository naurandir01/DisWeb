import type { Breadcrumb } from "../PageContainer/index.js";
export interface ActivePage {
  title: string;
  path: string;
  breadcrumbs: Breadcrumb[];
}
export declare function useActivePage(): ActivePage | null;