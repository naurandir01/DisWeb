import * as React from 'react';
/**
 * @ignore - internal component.
 */
export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  history?: 'auto' | 'push' | 'replace';
  href: string;
}
export declare const DefaultLink: React.ForwardRefExoticComponent<LinkProps & React.RefAttributes<HTMLAnchorElement>>;
export declare const Link: React.ForwardRefExoticComponent<LinkProps & React.RefAttributes<HTMLAnchorElement>>;