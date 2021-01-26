import * as React from 'react';
import Cascader from './Cascader';

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
  },
];

export const Primary = () => {
    const log = () => {
      console.log(new Date().toLocaleString());
    };

    return <div
      style={{
        display: `flex`,
        flexDirection: `column`,
        justifyContent: `center`,
        alignItems: `center`,
      }}
    >
      <Cascader menu={menu}>
        click me(expand menu on hover)
      </Cascader>

      <br/>

      <div
        style={{
          margin: `100px 0`,
        }}
      >
        <Cascader menu={menu} menuTrigger={`click`}>
          <button onClick={log}>click me(expand menu on click)</button>
        </Cascader>
      </div>

      <br/>

      <div style={{alignSelf: `flex-end`}}>
        <Cascader menu={menu}>
          click me
        </Cascader>
      </div>

      <div style={{alignSelf: `flex-end`, margin: `100px 200px`}}>
        <Cascader menu={menu} menuExpandIcon={`>`}>
          sm
        </Cascader>
      </div>
    </div>;
  }
;
;
