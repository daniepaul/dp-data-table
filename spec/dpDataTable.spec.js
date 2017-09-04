import Unexpected from 'unexpected';
import ShallowRenderer from 'react-test-renderer/shallow';
import UnexpectedReact from 'unexpected-react';
import React from 'react';
import TestUtils from 'react-dom/test-utils';
import DpDataTable from '../src/dpDataTable';

const unexpect = Unexpected.clone().use(UnexpectedReact);

describe('Data table basic component', function () {
  var component;
  var items = [{name: 'Test Name 1', type: 'Type 1'}, {name: 'Test Name 2', type: 'Type 1'}];

  beforeEach(function () {
    const renderer = new ShallowRenderer();
    renderer.render(<DpDataTable items={items}/>);
    component = renderer.getRenderOutput();
  });

  it('should exist', function () {
    expect(TestUtils.isDOMComponent(component));
  });

  it('should render component', function () {
    unexpect(component, 'to have rendered', (<div className="data-table-component" />));
  });

  it('should render two columns and one action column', function () {
    unexpect(component, 'to have rendered', (<div className="data-table-component">
      <div>
        <table>
          <thead>
          <tr>
            <th />
            <th />
            <th />
          </tr>
          </thead>
        </table>
      </div>
    </div>));
  });

  it('should render two rows', function () {
    unexpect(component, 'to have rendered', (<div className="data-table-component">
      <div>
        <table>
          <tbody>
          <tr />
          <tr />
          </tbody>
        </table>
      </div>
    </div>));
  });

  it('should render pagination', function () {
    unexpect(component, 'to have rendered', (<div className="data-table-component">
      <nav>
        <ul className="pagination">
          <li className="active" />
        </ul>
      </nav>
    </div>));
  });
});

describe('Data table basic component with filter', function () {
  var component;
  var items = [{name: 'Test Name 1', type: 'Type 1'}, {name: 'Test Name 2', type: 'Type 1'}];

  beforeEach(function () {
    component = TestUtils.renderIntoDocument(
      <DpDataTable items={items} showFilter/>
    );
  });

  it('should exist', function () {
    expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
  });

  it('should render component', function () {
    unexpect(component, 'to have rendered', (<div className="data-table-component" />));
  });

  it('should render filter input', function () {
    unexpect(component, 'to have rendered', (<div className="data-table-component">
      <div>
        <div className="input-group">
          <input id="filterTextInput"/>
        </div>
      </div>
    </div>));
  });

  it('should render two rows', function () {
    unexpect(component, 'to have rendered', (<div className="data-table-component">
      <div>
        <table>
          <tbody>
          <tr />
          <tr />
          </tbody>
        </table>
      </div>
    </div>));
  });
});
