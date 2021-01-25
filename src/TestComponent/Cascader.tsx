import './Cascader.scss';

import React, {FormEvent, useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import cn from 'classnames';

interface Props {
  children: React.ReactChildren;
  container?: HTMLElement;
  className?: string;
  menuClassName?: string;
  menu: MenuItemProps[];
}

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
  };
  menu: MenuItemProps[];
}

const Menu = ({container, show, className, offset, menu}: MenuProps) => {
  const [opened, setOpened] = useState([]);

  const onClick = (i) => (ev) => {
    if (i.onClick) {
      i.onClick(ev, {
        label: i.label,
        value: i.value,
      });
    }
  };

  const onToggleOpen = (key, i) => () => {
    if (!i.children?.length) {
      return;
    }

    if (opened.includes(key)) {
      setOpened(opened.filter(i => i !== key));
      return;
    }

    setOpened(opened.concat(key));
  };

  const renderItems = (list = [], parentKey = ``) => {
    return list.map((i, idx) => {
      const hasChildren = i.children?.length > 0;
      const key = parentKey ? `${parentKey}-${idx}` : `${idx}`;
      const showChildren = opened.includes(key);

      return (
        <li
          key={key}
          className={cn(i.className, hasChildren && `has-children`, `omc-menu-item`)}
          onMouseEnter={onToggleOpen(key, i)}
          onMouseLeave={onToggleOpen(key, i)}
        >
          <span onClick={onClick(i)}>{i.label}</span>
          {showChildren && hasChildren && (
            <ul className={cn(i.childrenListClassName, `omc-menu`)}>
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
        position: `absolute`,
        left: offset?.left,
        top: offset?.top,
      }}
    >
      {renderItems(menu, ``)}
    </ul>,
    container,
  );
};

const Cascader = ({
                    children,
                    container = document.querySelector(`body`),
                    className = ``,
                    menuClassName = ``,
                    menu,
                  }: Props) => {
  const el = useRef(null);
  const menuRef = useRef(null);
  const [showMenu, toggleMenu] = useState(false);
  const [offset, setOffset] = useState({
    left: 0,
    top: 0,
  });

  const onToggle = (ev) => {
    ev.stopPropagation();
    const next = !showMenu;
    if (el.current && next) {
      const {left, bottom} = el.current.getBoundingClientRect();
      console.log(left, bottom);
      setOffset({
        left: Math.ceil(left),
        top: Math.ceil(bottom),
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

    return () => {
      div.parentNode?.removeChild(div);
    };
  }, []);

  return <>
    <div
      ref={el}
      className={cn(className, `omc-trigger`)}
      onClick={onToggle}
    >
      {children}
    </div>
    <Menu show={showMenu} container={menuRef.current} className={cn(menuClassName)} offset={offset} menu={menu}/>
  </>;
};

export default Cascader;
