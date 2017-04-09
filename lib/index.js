import React from 'react';
import ReactDOM from 'react-dom';
import DpDataTable from './dpDataTable';

function RenderDpDataTable(options, selector) {
  if (selector) {
    options.selector = selector;
  }
  ReactDOM.render(
    React.createElement(DpDataTable, options, null),
    document.querySelectorAll(options.selector)[0]
  );
}
window.RenderDpDataTable = RenderDpDataTable;
export default DpDataTable;
