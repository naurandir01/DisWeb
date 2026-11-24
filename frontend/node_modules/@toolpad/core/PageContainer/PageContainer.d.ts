import * as React from 'react';
import { ContainerProps } from '@mui/material/Container';
import { SxProps } from '@mui/material';
import { PageHeaderProps } from "./PageHeader.js";
export interface Breadcrumb {
  /**
   * The title of the breadcrumb segment.
   */
  title: string;
  /**
   * The path the breadcrumb links to.
   */
  path?: string;
}
export interface PageContainerSlotProps {
  header: PageHeaderProps;
}
export interface PageContainerSlots {
  /**
   * The component that renders the page header.
   * @default PageHeader
   */
  header: React.ElementType;
}
export interface PageContainerProps extends ContainerProps {
  children?: React.ReactNode;
  /**
   * The title of the page. Leave blank to use the active page title.
   */
  title?: string;
  /**
   * The breadcrumbs of the page. Leave blank to use the active page breadcrumbs.
   */
  breadcrumbs?: Breadcrumb[];
  /**
   * The components used for each slot inside.
   */
  slots?: PageContainerSlots;
  /**
   * The props used for each slot inside.
   */
  slotProps?: PageContainerSlotProps;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps;
}
/**
 * A container component to provide a title and breadcrumbs for your pages.
 *
 * Demos:
 *
 * - [Page Container](https://mui.com/toolpad/core/react-page-container/)
 *
 * API:
 *
 * - [PageContainer API](https://mui.com/toolpad/core/api/page-container)
 */
declare function PageContainer(props: PageContainerProps): React.JSX.Element;
declare namespace PageContainer {
  var propTypes: any;
}
export { PageContainer };