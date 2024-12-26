export interface NavItem {
    label: string;
    mobileLabel?: string;
    icon: string;
    route: string;
    module: string;
    children?: NavItem[];
    isCollapsed?: boolean;
  }