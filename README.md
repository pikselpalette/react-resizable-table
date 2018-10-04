# React Resizable Table

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![npm version](https://badge.fury.io/js/react-resizable-table.svg)](https://badge.fury.io/js/react-resizable-table)
[![Build Status](https://travis-ci.org/pikselpalette/react-resizable-table.svg?branch=master)](https://travis-ci.org/pikselpalette/react-resizable-table)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/ad6e5f09853d45acbf9aa76b9afc2b2c)](https://www.codacy.com/app/samboylett/react-resizable-table?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=pikselpalette/react-resizable-table&amp;utm_campaign=Badge_Grade)
[![devDependencies Status](https://david-dm.org/pikselpalette/react-resizable-table/dev-status.svg)](https://david-dm.org/pikselpalette/react-resizable-table?type=dev)
[![peerDependencies Status](https://david-dm.org/pikselpalette/react-resizable-table/peer-status.svg)](https://david-dm.org/pikselpalette/react-resizable-table?type=peer)
[![codecov](https://codecov.io/gh/pikselpalette/react-resizable-table/branch/master/graph/badge.svg)](https://codecov.io/gh/pikselpalette/react-resizable-table)
[![Mutation testing badge](https://badge.stryker-mutator.io/github.com/pikselpalette/react-resizable-table/master)](https://stryker-mutator.github.io) [![Greenkeeper badge](https://badges.greenkeeper.io/pikselpalette/react-resizable-table.svg)](https://greenkeeper.io/)

## Installation

```sh
npm i --save react-resizable-table
```

## Usage

```jsx
import ResizableTable, { ResizingIcon } from 'react-resizable-table';

const MyTable = ({ onColumnResize }) => (
  <ResizableTable onColumnResize={onColumnResize}>
    <table>
      <thead>
        <tr>
          <th>Foo <ResizingIcon /></th>
          <th>Bar <ResizingIcon /></th>
          <th>No resizing </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>foo</td>
          <td>bar</td>
          <td>yep</td>
        </tr>
        <tr>
          <td>whizz</td>
          <td>woop</td>
          <td>hi</td>
        </tr>
      </tbody>
    </table>
  </ResizableTable>
);

export default MyTable;
```
