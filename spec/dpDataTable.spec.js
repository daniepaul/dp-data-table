import Unexpected from 'unexpected';
import UnexpectedReact from 'unexpected-react';
import React from 'react';
import DpDataTable from '../src/dpDataTable';
import * as TestUtils from 'react/lib/ReactTestUtils';

const unexpect = Unexpected.clone().use(UnexpectedReact);

describe('Data table basic component', function () {
  var component;
  var items = [{name: 'Test Name 1', type: 'Type 1'}, {name: 'Test Name 2', type: 'Type 1'}];

  beforeEach(function () {
    component = TestUtils.renderIntoDocument(
      <DpDataTable items={items}/>
    );
  });

  it('should exist', function () {
    expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
  });

  it('should render component', function () {
    unexpect(component, 'to have rendered', (<div className="data-table-component"></div>));
  });

  it('should render two columns and one action column', function () {
    unexpect(component, 'to have rendered', (<div className="data-table-component">
      <div>
        <table>
          <thead>
          <tr>
            <th></th>
            <th></th>
            <th></th>
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
          <tr></tr>
          <tr></tr>
          </tbody>
        </table>
      </div>
    </div>));
  });

  it('should render pagination', function () {
    unexpect(component, 'to have rendered', (<div className="data-table-component">
      <nav>
        <ul className="pagination">
          <li className="active"></li>
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
      <DpDataTable items={items} showFilter={true}/>
    );
  });

  it('should exist', function () {
    expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
  });

  it('should render component', function () {
    unexpect(component, 'to have rendered', (<div className="data-table-component"></div>));
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
          <tr></tr>
          <tr></tr>
          </tbody>
        </table>
      </div>
    </div>));
  });
});
