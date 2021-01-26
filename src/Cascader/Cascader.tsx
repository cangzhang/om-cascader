import './Cascader.scss';

import React, {FormEvent, ReactNode, useEffect, useLayoutEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import cn from 'classnames';

type Trigger = `hover` | `click`;

interface MenuItemProps {
  label: string;
  value: any;
  className?: string;
  onClick?: (ev: FormEvent, v: any) => any;
  children?: MenuItemProps[];
  childrenListClassName?: string;
  showDividerAfter?: boolean;
}

interface MenuProps {
  container: HTMLElement;
  show: boolean;
  className?: string;
  offset: {
    left: number;
    top: number;
    right: number;
  };
  menu: MenuItemProps[];
  menuTrigger?: Trigger;
  menuExpandIcon?: ReactNode;
}

interface Props extends Pick<MenuProps, `menu` | `menuTrigger` | `menuExpandIcon`> {
  container?: HTMLElement;
  className?: string;
  menuClassName?: string;
}

const MIN_MARGIN = 30;

const Menu = ({container, show, className, offset, menu, menuTrigger, menuExpandIcon}: MenuProps) => {
  const [opened, setOpened] = useState(``);
  const [expandR, setExpandR] = useState(false);
  const [firstLevelMenuToRight, setFirstLevelMenu] = useState(false);

  useEffect(() => {
    if (!show) {
      setOpened(``);
    }
  }, [show]);

  useLayoutEffect(() => {
    if (!show) {
      return;
    }

    const allMenus: HTMLElement[] = Array.from(container.querySelectorAll(`ul.omc-menu`));
    const placeFirstLevelToRight = allMenus[0].offsetWidth + offset.left + MIN_MARGIN >= window.innerWidth;
    setFirstLevelMenu(placeFirstLevelToRight);
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
            i.className,
            `omc-menu-item`,
            hasChildren && `has-children`,
            i.showDividerAfter && `has-divider`,
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
            <ul className={cn(i.childrenListClassName, `omc-menu`, expandR && `expand-r`)}>
              {renderItems(i.children, key)}
            </ul>
          )}
        </li>
      );
    });
  };

  if (!show) {
    return null;
  }

  const style: React.CSSProperties = {
    top: offset?.top,
  };
  if (firstLevelMenuToRight) {
    style.right = 0;
  } else {
    style.left = offset.left;
  }

  return ReactDOM.createPortal(
    <ul
      className={cn(className, `omc-menu`)}
      style={style}
    >
      {renderItems(menu, ``)}
    </ul>,
    container,
  );
};

const Cascader: React.FC<Props> = ({
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
    left: 0,
    top: 0,
    right: 0,
  });

  useEffect(() => {
    document.addEventListener(`mousedown`, onClickOutside);

    return () => {
      document.removeEventListener(`mousedown`, onClickOutside);
    };
  }, []);

  useEffect(() => {
    const div = document.createElement(`div`);
    menuRef.current = div;
    container.appendChild(div);

    observer.current = new ResizeObserver(() => {
      const {left, bottom, right} = el.current.getBoundingClientRect();
      setOffset({
        left: Math.ceil(left),
        top: Math.ceil(bottom),
        right: Math.ceil(right),
      });
    });
    observer.current.observe(div);

    return () => {
      div.parentNode?.removeChild(div);
      observer.current.unobserve(div);
    };
  }, []);

  const onToggle = (ev) => {
    ev.stopPropagation();
    const next = !showMenu;
    if (el.current && next) {
      const {left, bottom, right} = el.current.getBoundingClientRect();
      setOffset({
        left: Math.ceil(left),
        top: Math.ceil(bottom),
        right: Math.ceil(right),
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

  return <>
    <div
      ref={el}
      className={cn(className, `omc-trigger`)}
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
    />
  </>;
};

export default Cascader;