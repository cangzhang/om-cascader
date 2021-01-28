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
  observeNode?: HTMLElement | undefined | null;
}

type PickedMenuProps = `menu` | `menuTrigger` | `menuExpandIcon` | `observeNode`;

interface IOMCascader extends Pick<IOMCascaderMenu, PickedMenuProps> {
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
                observeNode,
              }: IOMCascaderMenu) => {
  const [opened, setOpened] = useState(``);
  const [expandR, setExpandR] = useState(false);
  const [toRight, setToRight] = useState(false);
  const [toTop, setToTop] = useState(false);
  const [ulOffset, setUlOffset] = useState({});

  useEffect(() => {
    if (!show) {
      setOpened(``);
      setUlOffset({});
    }
  }, [show]);

  useLayoutEffect(() => {
    if (!show || !container) {
      return;
    }

    const allMenus: HTMLElement[] = Array.from(container.querySelectorAll(`ul.omc-menu[data-parent]`));
    if (!allMenus.length) {
      return;
    }

    const rootMenu = allMenus[0];
    const placeToRight = rootMenu.offsetWidth + offset.left + MIN_MARGIN > window.innerWidth;
    setToRight(placeToRight);

    const placeToTop = offset.top + rootMenu.offsetHeight + MIN_MARGIN > window.innerHeight;
    setToTop(placeToTop);

    const totalWidth = allMenus.reduce((cur, i) => cur + i.offsetWidth, 0);
    const shouldExpandToR = totalWidth + offset.left + MIN_MARGIN > window.innerWidth;
    setExpandR(shouldExpandToR);

    if (allMenus.length < 2) {
      return;
    }

    const lastIdx = allMenus.length - 1;
    const lastMenu = allMenus[lastIdx];
    const parentMenu = allMenus[lastIdx - 1];

    const rect = lastMenu.getBoundingClientRect();
    if (rect.bottom + MIN_MARGIN > window.innerHeight) {
      const openedLi = parentMenu.querySelector(`li.has-children.show-children`);
      const liRect = openedLi.getBoundingClientRect();
      const offsetTop = rect.bottom - liRect.bottom;
      setUlOffset(p => ({
        ...p,
        [lastMenu.dataset.parent]: offsetTop,
      }));
    }
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
      const shouldResetOffset = !!ulOffset[key];
      const style: React.CSSProperties = {};
      if (shouldResetOffset) {
        style.top = `-${ulOffset[key]}px`;
      }

      return (
        <li
          key={key}
          className={cn(
            `omc-menu-item`,
            hasChildren && `has-children`,
            showChildren && `show-children`,
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
            <ul
              data-parent={key}
              className={
                cn(
                  `omc-menu`,
                  expandR && `expand-r`,
                  toTop && `expand-top`,
                  i.childrenListClassName,
                )}
              style={style}
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

  const style: React.CSSProperties = toTop
    ? {
      bottom: `calc(100vh - ${offset.top}px)`,
    }
    : {
      top: offset.bottom,
    };

  style.left = offset.left;
  if (toRight) {
    style.left = offset.right;
    style.transform = `translateX(-100%)`;
  }

  return ReactDOM.createPortal(
    <ul
      data-parent={`root`}
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
                                           className = ``,
                                           menuClassName = ``,
                                           menu,
                                           menuTrigger = `hover`,
                                           menuExpandIcon,
                                           observeNode,
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
    document.addEventListener(`scroll`, onOffsetChange);

    return () => {
      document.removeEventListener(`mousedown`, onClickOutside);
      document.removeEventListener(`scroll`, onOffsetChange);
    };
  }, []);

  useEffect(() => {
    const fixedDiv = document.createElement(`div`);
    fixedDiv.setAttribute(`tabindex`, `-1`);
    fixedDiv.setAttribute(
      `style`,
      `width: 1px; height: 0px; padding: 0px;overflow: hidden;position: fixed;top: 1px;left: 1px;`,
    );
    const div = document.createElement(`div`);
    menuRef.current = div;
    document.body.appendChild(div);
    div.appendChild(fixedDiv);
  }, []);

  useEffect(() => {
    return () => {
      menuRef.current?.parentNode?.removeChild(menuRef.current);
      observer.current?.unobserve(menuRef.current);
    };
  }, []);

  useEffect(() => {
    if (!showMenu) {
      return;
    }

    if (!observeNode) {
      return;
    }

    observer.current = new ResizeObserver(() => {
      if (!showMenu) {
        return;
      }

      onOffsetChange();
    });
    observer.current.observe(menuRef.current);
  }, [showMenu]);

  const onOffsetChange = () => {
    if (!el.current) {
      return;
    }

    const {left, bottom, right, top} = el.current.getBoundingClientRect();
    setOffset({
      left: Math.ceil(left),
      right: Math.ceil(right),
      bottom: Math.ceil(bottom),
      top: Math.ceil(top),
    });
  };

  const onToggle = (ev) => {
    ev.stopPropagation();
    const next = !showMenu;
    if (el.current && next) {
      onOffsetChange();
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
      observeNode={observeNode}
    />
  </>;
};

export default Cascader;
