import * as React from 'react';
import Cascader from '../src/Cascader/Cascader';

import './cascader.css';

export default {
  title: 'Cascader',
};

const menu = [
  {
    label: `Turbo Transformers`,
    value: `item1`,
    onClick: (_, i) => console.log(i),
  },
  {
    label: `Item 2`,
    value: `item2`,
    onClick: (_, i) => console.log(i),
    children: [
      {
        label: `Turbo Transformers: Child Item 1 Turbo Transformers: Child Item 1`,
        value: `child item1`,
        onClick: (_, i) => console.log(i),
        children: [
          {
            label: `Grandchild Item 1`,
            value: `grandchild item1`,
            onClick: (_, i) => console.log(i),
          },
        ],
      },
      {
        label: `Child Item 2`,
        value: `child item2`,
        onClick: (_, i) => console.log(i),
        children: [
          {
            label: `Grandchild Item 2`,
            value: `grandchild item2`,
            onClick: (_, i) => console.log(i),
          },
        ],
      },
    ],
  },
  {
    label: `Turbo Transformers 2`,
    value: `item1`,
    onClick: (_, i) => console.log(i),
    showDividerAfter: true,
  },
  {
    label: `Turbo Transformers 3`,
    value: `item1`,
    onClick: (_, i) => console.log(i),
    children: [
      {
        label: `Turbo Transformers`,
        value: `item1`,
        onClick: (_, i) => console.log(i),
      },
      {
        label: `Item 2`,
        value: `item2`,
        onClick: (_, i) => console.log(i),
        children: [
          {
            label: `Turbo Transformers: Child Item 1 Turbo Transformers: Child Item 1`,
            value: `child item1`,
            onClick: (_, i) => console.log(i),
            children: [
              {
                label: `Grandchild Item 1`,
                value: `grandchild item1`,
                onClick: (_, i) => console.log(i),
              },
            ],
          },
          {
            label: `Child Item 2`,
            value: `child item2`,
            onClick: (_, i) => console.log(i),
            children: [
              {
                label: `Grandchild Item 2`,
                value: `grandchild item2`,
                onClick: (_, i) => console.log(i),
              },
            ],
          },
        ],
      },
      {
        label: `Turbo Transformers 2`,
        value: `item1`,
        onClick: (_, i) => console.log(i),
        showDividerAfter: true,
      },
      {
        label: `Turbo Transformers 3`,
        value: `item1`,
        onClick: (_, i) => console.log(i),
      },
    ],
  },
];

const menuWithChildrenWrapper = [
  {
    label: `Turbo Transformers`,
    value: `item1`,
    onClick: (_, i) => console.log(i),
  },
  {
    label: `Item 2`,
    value: `item2`,
    onClick: (_, i) => console.log(i),
    isChildrenWrapper: true,
    childrenListClassName: `scrollList`,
    children: [
      {
        label: `wrapper child: Turbo Transformers: Child Item 1 Turbo Transformers: Child Item 1`,
        value: `child item1`,
        onClick: (_, i) => console.log(i),
        children: [
          {
            label: `Grandchild Item 1`,
            value: `grandchild item1`,
            onClick: (_, i) => console.log(i),
          },
        ],
      },
      {
        label: `wrapper child: Child Item 2`,
        value: `child item2`,
        onClick: (_, i) => console.log(i),
      },
      {
        label: `wrapper child: Child Item 3`,
        value: `child item3`,
        onClick: (_, i) => console.log(i),
      },
      {
        label: `wrapper child: Child Item 4`,
        value: `child item4`,
        onClick: (_, i) => console.log(i),
      },
      {
        label: `wrapper child: Child Item 5`,
        value: `child item5`,
        onClick: (_, i) => console.log(i),
      },
    ],
  },
  {
    label: `Turbo Transformers 2`,
    value: `item1`,
    onClick: (_, i) => console.log(i),
    showDividerAfter: true,
  },
  {
    label: `Turbo Transformers 3`,
    value: `item1`,
    onClick: (_, i) => console.log(i),
    children: [
      {
        label: `Turbo Transformers`,
        value: `item1`,
        onClick: (_, i) => console.log(i),
      },
      {
        label: `Item 2`,
        value: `item2`,
        onClick: (_, i) => console.log(i),
        children: [
          {
            label: `Turbo Transformers: Child Item 1 Turbo Transformers: Child Item 1`,
            value: `child item1`,
            onClick: (_, i) => console.log(i),
            children: [
              {
                label: `Grandchild Item 1`,
                value: `grandchild item1`,
                onClick: (_, i) => console.log(i),
              },
            ],
          },
          {
            label: `Child Item 2`,
            value: `child item2`,
            onClick: (_, i) => console.log(i),
            children: [
              {
                label: `Grandchild Item 2`,
                value: `grandchild item2`,
                onClick: (_, i) => console.log(i),
              },
            ],
          },
        ],
      },
      {
        label: `Turbo Transformers 2`,
        value: `item1`,
        onClick: (_, i) => console.log(i),
        showDividerAfter: true,
      },
      {
        label: `Turbo Transformers 3`,
        value: `item1`,
        onClick: (_, i) => console.log(i),
      },
    ],
  },
];

export const Primary = () => {
  const log = () => {
    console.log(new Date().toLocaleString());
  };

  return (
    <div
      style={{
        display: `flex`,
        flexDirection: `column`,
        justifyContent: `center`,
        alignItems: `center`,
      }}
    >
      <div style={{margin: `0 auto 0 100px`}}>
        <Cascader menu={menu} observeNode={document.body}>
          click me(expand menu on hover)
        </Cascader>
      </div>

      <br/>

      <div
        style={{
          margin: `100px 0`,
        }}
      >
        <Cascader menu={menu} menuTrigger={`click`} observeNode={document.body}>
          <button onClick={log}>click me(expand menu on click)</button>
        </Cascader>
      </div>

      <br/>

      <div style={{alignSelf: `flex-end`}}>
        <Cascader menu={menu} observeNode={document.body}>
          click me
        </Cascader>
      </div>

      <div style={{alignSelf: `flex-end`, margin: `100px 200px`}}>
        <Cascader menu={menu} menuExpandIcon={`>`} observeNode={document.body}>
          <p style={{height: `50px`, width: `50px`, border: `1px solid`}}>big</p>
        </Cascader>
      </div>

      <div style={{margin: `100px 200px`}}>
        <Cascader menu={menuWithChildrenWrapper} menuExpandIcon={`>`} observeNode={document.body}>
          <p>children wrapper</p>
        </Cascader>
      </div>
    </div>
  );
};
