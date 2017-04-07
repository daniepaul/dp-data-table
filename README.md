# dp-data-table

Get the AMD module located at `dp-data-table.js` and include it in your project.

Here is a sample integration:

```js
require.config({
  paths: {
    'react': 'vendor/bower_components/react/react',
    'DpDataTable': 'dp-data-table'
  }
});

require(['react', 'DpDataTable'], function(React, DpDataTable) {

  React.render(React.createElement(DpDataTable), document.getElementById('widget-container'));

});
```

## Development

* Development server `npm start`.
* Continuously run tests on file changes `npm run watch-test`;
* Run tests: `npm test`;
* Build `npm run build`;
