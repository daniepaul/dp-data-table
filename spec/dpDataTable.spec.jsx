import Unexpected from "unexpected";
import UnexpectedReact from "unexpected-react";
import React from 'react';
import DpDataTable from '../lib/dpDataTable.jsx';
import * as TestUtils from "react/lib/ReactTestUtils";

const unexpect = Unexpected.clone().use(UnexpectedReact);

describe('Data table component', function () {
  var component;
  var items = [{name: "Test Name 1", type: "Type 1"}, {name: "Test Name 2", type: "Type 1"}];

  beforeEach(function () {
    component = TestUtils.renderIntoDocument(
      <DpDataTable items={items}/>
    );
  });

  it('should exist', function () {
    expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
  });

  it('should render', function () {
    unexpect(component, 'to have rendered', (<div className="data-table-component"></div>));
  });
});
