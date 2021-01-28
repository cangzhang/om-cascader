import './Cascader.scss';

import React, {FormEvent, ReactNode, useEffect, useLayoutEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import cn from 'classnames';

type Trigger = `hover` | `click`;

interface IOMCascaderMenuItem {
  label: string;
  value: any;
  className?: string;
  onClick?: (ev: FormEvent, v: any) => any;
  children?: IOMCascaderMenuItem[];
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
}

type PickedMenuProps = `menu` | `menuTrigger` | `menuExpandIcon`;

interface IOMCascader extends Pick<IOMCascaderMenu, PickedMenuProps> {
  container?: HTMLElement;
  className?: string;
  menuClassName?: string;
}

const MIN_MARGIN = 30;

const Menu = ({
                container,
                show,
                className,
                offset,
                menu,
                menuTrigger,
                menuExpandIcon,
                onMenuItemClick,
              }: IOMCascaderMenu) => {
  const [opened, setOpened] = useState(``);
  const [expandR, setExpandR] = useState(false);
  const [toRight, setToRight] = useState(false);
  const [toTop, setToTop] = useState(false);

  useEffect(() => {
    if (!show) {
      setOpened(``);
    }
  }, [show]);

  useLayoutEffect(() => {
    if (!show || !container) {
      return;
    }

    const allMenus: HTMLElement[] = Array.from(container.querySelectorAll(`ul.omc-menu`));
    if (!allMenus.length) {
      return;
    }
    const rootMenu = allMenus[0];
    const placeToRight = rootMenu.offsetWidth + offset.left + MIN_MARGIN >= window.innerWidth;
    setToRight(placeToRight);

    const placeToTop = offset.top + rootMenu.offsetHeight + MIN_MARGIN >= window.innerHeight;
    setToTop(placeToTop);

    const totalWidth = allMenus.reduce((cur, i) => cur + i.offsetWidth, 0);
    const shouldExpandToR = totalWidth + offset.left + MIN_MARGIN >= window.innerWidth;
    setExpandR(shouldExpandToR);
  }, [show, opened]);

  const onClickItem = (key, i) => (ev) => {
    if (i.onClick) {
      i.onClick(ev, {
        label: i.label,
        value: i.value,
      });
    }

    if (i.children?.length > 0 && key !== opened) {
      setOpened(key);
      return;
    }

    if (!i.keepMenuOnClick) {
      onMenuItemClick();
    }
  };

  const onHoverToggle = (key) => () => {
    if (menuTrigger === `click`) {
      return;
    }

    setOpened(key);
  };

  const renderItems = (list = [], parentKey = ``) => {
    return list.map((i, idx) => {
      const hasChildren = i.children?.length > 0;
      const key = parentKey ? `${parentKey}-${idx}` : `${idx}`;
      const showChildren = opened.startsWith(key);

      return (
        <li
          key={key}
          className={cn(
            `omc-menu-item`,
            hasChildren && `has-children`,
            i.showDividerAfter && `has-divider`,
            i.className,
          )}
        >
          <span
            onMouseEnter={onHoverToggle(key)}
            onMouseLeave={onHoverToggle(key)}
            onClick={onClickItem(key, i)}
          >
            {i.label}
            {hasChildren && menuExpandIcon && <div className='expand-icon'>{menuExpandIcon}</div>}
          </span>
          {showChildren && hasChildren && (
            <ul className={
              cn(
                `omc-menu`,
                expandR && `expand-r`,
                toTop && `expand-top`,
                i.childrenListClassName,
              )}
            >
              {renderItems(i.children, key)}
            </ul>
          )}
        </li>
      );
    });
  };

  if (!show || !container) {
    return null;
  }

  const style: React.CSSProperties = {
    top: toTop ? `calc(100vh - ${offset.top}px)` : offset.bottom,
  };

  if (toRight) {
    style.right = 0;
  } else {
    style.left = offset.left;
  }

  return ReactDOM.createPortal(
    <ul
      className={cn(`omc-menu`, className)}
      style={style}
    >
      {renderItems(menu, ``)}
    </ul>,
    container,
  );
};

const Cascader: React.FC<IOMCascader> = ({
                                           children,
                                           container = document.querySelector(`body`),
                                           className = ``,
                                           menuClassName = ``,
                                           menu,
                                           menuTrigger = `hover`,
                                           menuExpandIcon,
                                         }) => {
  const el = useRef(null);
  const menuRef = useRef(null);
  const observer = useRef(null);

  const [showMenu, toggleMenu] = useState(false);
  const [offset, setOffset] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  useEffect(() => {
    document.addEventListener(`mousedown`, onClickOutside);

    return () => {
      document.removeEventListener(`mousedown`, onClickOutside);
    };
  }, []);

  useEffect(() => {
    if (observer.current || !showMenu) {
      return;
    }

    const fixedDiv = document.createElement(`div`);
    fixedDiv.setAttribute(`tabindex`, `-1`);
    fixedDiv.setAttribute(
      `style`,
      `width: 1px; height: 0px; padding: 0px;overflow: hidden;position: fixed;top: 1px;left: 1px;`,
    );
    const div = document.createElement(`div`);
    menuRef.current = div;
    container.appendChild(div);
    div.appendChild(fixedDiv);

    observer.current = new ResizeObserver(() => {
      if (!showMenu) {
        return;
      }

      const {left, bottom, right, top} = el.current.getBoundingClientRect();
      setOffset({
        left: Math.ceil(left),
        right: Math.ceil(right),
        bottom: Math.ceil(bottom),
        top: Math.ceil(top),
      });
    });
    observer.current.observe(div);
  }, [showMenu]);

  useEffect(() => {
    return () => {
      menuRef.current?.parentNode?.removeChild(menuRef.current);
      observer.current?.unobserve(menuRef.current);
    };
  }, []);

  const onToggle = (ev) => {
    ev.stopPropagation();
    const next = !showMenu;
    if (el.current && next) {
      const {left, bottom, right, top} = el.current.getBoundingClientRect();
      setOffset({
        left: Math.ceil(left),
        right: Math.ceil(right),
        bottom: Math.ceil(bottom),
        top: Math.ceil(top),
      });
    }
    toggleMenu(next);
  };

  const onClickOutside = (ev) => {
    if (el.current?.contains(ev.target) || menuRef.current?.contains(ev.target)) {
      return;
    }

    toggleMenu(false);
  };

  const onMenuItemClick = () => {
    toggleMenu(!showMenu);
  };

  return <>
    <div
      ref={el}
      className={cn(
        `omc-trigger`,
        showMenu && `open`,
        className,
      )}
      onClick={onToggle}
    >
      {children}
    </div>
    <Menu
      className={cn(menuClassName)}
      show={showMenu}
      container={menuRef.current}
      offset={offset}
      menu={menu}
      menuTrigger={menuTrigger}
      menuExpandIcon={menuExpandIcon}
      onMenuItemClick={onMenuItemClick}
    />
  </>;
};

export default Cascader;
