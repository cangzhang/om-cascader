# `om-cascader`: oh my cascader

[![](https://img.shields.io/npm/v/om-cascader?style=flat-square)](https://npm.im/package/om-cascader)

## props

### MenuItem props
```typescript

type Trigger = `hover` | `click`;

interface IOMCascaderMenuItem {
  label: string;
  value: any;
  className?: string;
  onClick?: (ev: FormEvent, v: any) => any;
  children?: IOMCascaderMenuItem[];
  isChildrenWrapper?: boolean;
  childrenListClassName?: string;
  showDividerAfter?: boolean;
  keepMenuOnClick?: boolean;
}

interface IOMCascaderMenu {
  container: HTMLElement;
  show: boolean;
  className?: string;
  offset: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  menu: IOMCascaderMenuItem[];
  menuTrigger?: Trigger;
  menuExpandIcon?: ReactNode;
  onMenuItemClick: () => void;
  observeNode?: HTMLElement | undefined | null;
}

type PickedMenuProps = `menu` | `menuTrigger` | `menuExpandIcon` | `observeNode`;

interface IOMCascader extends Pick<IOMCascaderMenu, PickedMenuProps> {
  className?: string;
  menuClassName?: string;
}

```
