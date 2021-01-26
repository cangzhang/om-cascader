import './Cascader.scss';

import React, {FormEvent, useEffect, useLayoutEffect, useRef, useState} from 'react';
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
}

interface Props {
  container?: HTMLElement;
  className?: string;
  menuClassName?: string;
  menu: MenuItemProps[];
  menuTrigger?: Trigger;
}

const Menu = ({container, show, className, offset, menu, menuTrigger}: MenuProps) => {
  const [opened, setOpened] = useState(``);
  const [expandR, setExpandR] = useState(false);

  useEffect(() => {
    if (!show) {
      setOpened(``);
    }
  }, [show]);

  useLayoutEffect(() => {
    if (!show) {
      return;
    }

    const wholeWidth = Array.from(container.querySelectorAll(`ul.omc-menu`)).reduce((cur, i: HTMLElement) => cur + i.offsetWidth, 0);
    const shouldExpandToR = wholeWidth + offset.left + 30 >= window.innerWidth;
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
          className={cn(i.className, hasChildren && `has-children`, `omc-menu-item`)}
        >
          <span
            onMouseEnter={onHoverToggle(key)}
            onMouseLeave={onHoverToggle(key)}
            onClick={onClickItem(key, i)}
          >
            {i.label}
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

  return ReactDOM.createPortal(
    <ul
      className={cn(className, `omc-menu`)}
      style={{
        left: offset?.left,
        top: offset?.top,
      }}
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
    />
  </>;
};

export default Cascader;
