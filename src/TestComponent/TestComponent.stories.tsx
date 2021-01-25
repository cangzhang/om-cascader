import * as React from 'react';
import Cascader from './Cascader';

export default {
  title: 'Cascader',
};

const menu = [
  {
    label: `Item 1`,
    value: `item1`,
    onClick: (_, i) => console.log(i),
  },
  {
    label: `Item 2`,
    value: `item2`,
    onClick: (_, i) => console.log(i),
    children: [
      {
        label: `Child Item 1`,
        value: `child item1`,
        onClick: (_, i) => console.log(i),
        children: [
          {
            label: `Grandchild Item 1`,
            value: `grandchild item1`,
            onClick: (_, i) => console.log(i),
          },
        ]
      },
      {
        label: `Child Item 2`,
        value: `child item2`,
        onClick: (_, i) => console.log(i),
      },
    ],
  },
];

export const Primary = () => {
  const log = () => {
    console.log(new Date().toLocaleString());
  };

  return <div style={{display: `flex`, justifyContent: `center`}}>
    <Cascader menu={menu}>
      <button onClick={log}>click me</button>
    </Cascader>
  </div>;
};
