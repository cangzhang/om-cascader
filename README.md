# `om-cascader`, oh my cascader

## props

### MenuItem props
```typescript
interface IMenuItem {
    label: string;
    value: any;
    className?: string;
    onClick?: (ev: React.FormEvent, v: any) => any;
    children?: IMenuItem[];
    childrenListClassName?: string;
    showDividerAfter?: boolean;
    keepMenuOnClick?: boolean;
}
```

### Menu props
```typescript
interface IMenu {
    container: HTMLElement;
    show: boolean;
    className?: string;
    offset: {
        left: number;
        top: number;
        right: number;
    };
    menu: MenuItem[];
    menuTrigger?: `hover` | `click`;
    menuExpandIcon?: React.ReactNode;
}
```

### Cascader props
```typescript
interface CascaderProps {
    container?: HTMLElement;
    className?: string;
    menuClassName?: string;
    menu: IMenuItem[];
    menuTrigger?: `hover` | `click`;
    menuExpandIcon?: ReactNode;
}
```
