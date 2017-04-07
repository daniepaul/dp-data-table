# dp-data-table

dp Data Table is a simple ready to integrate component made in React using bootstrap styling.

#### Screenshot
![dp Data Table](https://raw.githubusercontent.com/daniepaul/dp-data-table/master/screenshots/with-filter-and-pagination.png)

Get the AMD module located at `index.js` and include it in your project.

Here is a sample integration:

```js
require.config({
  paths: {
    'react': 'vendor/bower_components/react/react',
    'DpDataTable': 'dpDataTable'
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
