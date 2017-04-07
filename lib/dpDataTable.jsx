import React, {Component, PropTypes} from 'react';
import map from 'lodash/map';
import kebabCase from 'lodash/kebabCase';
import ceil from 'lodash/ceil';
import keys from 'lodash/keys';
import times from 'lodash/times';
import chunk from 'lodash/chunk';
import filter from 'lodash/filter';
import some from 'lodash/some';
import toString from 'lodash/toString';
import toLower from 'lodash/toLower';
import startsWith from 'lodash/startsWith';
import size from 'lodash/size';
import classNames from 'classnames';

import './dpDataTable.scss';

class DpDataTable extends Component {
  DEFAULT_PAGE_ITEM_COUNT = 15;

  static get propTypes() {
    return {
      headers: PropTypes.object,
      items: PropTypes.array.isRequired,
      filterableFields: PropTypes.array,
      onEditing: PropTypes.func,
      onDeleting: PropTypes.func,
      onPagination: PropTypes.func,
      itemsPerPage: PropTypes.number,
      showFilter: PropTypes.bool,
      hidePagination: PropTypes.bool,
      loading: PropTypes.bool
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
      filter: ''
    };
  }

  render() {
    const {headers, hidePagination, showFilter, loading} = this.props;
    return (
      <div className="row data-table-component">
        {loading && (<div className="loading-container"><i className="glyphicon glyphicon-refresh"></i></div>)}
        {!loading && showFilter && this._renderFilter()}
        {!loading && !hidePagination && this._renderHeaderPagination()}
        {!loading && (<div className="table-responsive col-xs-12">
          <table className="table table-bordered table-striped">
            <thead className={'c'+size(headers)} >
            <tr>
              {map(headers, (header, headerKey) => <th key={'header-' + kebabCase(headerKey)}>{header}</th>)}
              <th className="action">
              </th>
            </tr>
            </thead>
            <tbody>
            {this._renderRow()}
            </tbody>
          </table>
        </div>)}
        {!loading && !hidePagination && this._renderFooterPagination()}
      </div>
    );
  }

  _renderRow() {
    const {headers, onEditing, itemsPerPage = this.DEFAULT_PAGE_ITEM_COUNT, hidePagination, onDeleting} = this.props;
    const currentPage = !hidePagination ? this.state.currentPage : 0;
    const filteredItems = this._filterItems();
    const pagedItems = !hidePagination ? chunk(filteredItems, itemsPerPage) : [filteredItems];
    return map(pagedItems[currentPage], (item, index) => {
      const {popover} = item;
      return (
        <tr key={index}>
          {map(keys(headers), (header) => <td key={'item-' + index + '-' + kebabCase(header)}>{item[header]}</td>)}
          <td className="action-buttons">
            {onEditing && <a onClick={() => onEditing(item, index)}><i className="glyphicon glyphicon-pencil"/></a>}
            {onDeleting && <a onClick={() => onDeleting(item, index)}><i className="glyphicon glyphicon-trash"/></a>}
            {popover && <a onClick={() => onDeleting(item, index)} data-toggle="popover" data-trigger="hover"
                           data-placement="left" data-html="true" data-content={popover}>
              <i className="glyphicon glyphicon-search"/>
            </a>}
          </td>
        </tr>
      );
    })
  }

  componentDidMount() {
    this.triggerPopover();
  }

  componentDidUpdate() {
    this.triggerPopover();
  }

  triggerPopover() {
    window && window.$ && window.$('.data-table-component a[data-toggle=popover]').popover && window.$('.data-table-component a[data-toggle=popover]').popover({container: 'body'});
  }

  _filterItems() {
    const {items, filterableFields, headers} = this.props;
    const filterString = this.state.filter || '';
    const filterKeys = (filterableFields && filterableFields.length) ? filterableFields : keys(headers);
    const filteredItems = filter(items, (item) => {
      return some(filterKeys, (filterKey) => {
        return item && item[filterKey] && startsWith(toLower(toString(item[filterKey])), toLower(filterString));
      })
    });
    return (filterString !== '') ? filteredItems : items;
  }

  _renderFilter() {
    return <div className="form-group col-xs-12 col-sm-6 col-md-4">
      <label className="sr-only" htmlFor="exampleInputAmount">Amount (in dollars)</label>
      <div className="input-group">
        <div className="input-group-addon"><i className="glyphicon glyphicon-search"/></div>
        <input type="text" className="form-control" id="exampleInputAmount" placeholder="Filter" ref="txtFilter"
               onChange={() => this._onFilterChange()}/>
      </div>
    </div>
  }

  _renderHeaderPagination() {
    const {itemsPerPage = this.DEFAULT_PAGE_ITEM_COUNT, showFilter} = this.props;
    const items = this._filterItems();
    const currentPage = this.state.currentPage;
    const paginationClass = classNames('form-group col-xs-12 col-sm-4 col-md-2', {
      'col-sm-offset-2 col-md-offset-6': showFilter,
      'col-sm-offset-8 col-md-offset-10': !showFilter
    });
    const numberOfPages = ceil(items.length / itemsPerPage);
    const previousPage = currentPage > 0 ? currentPage - 1 : undefined;
    const nextPage = (currentPage + 1) < numberOfPages ? currentPage + 1 : undefined;
    return (<nav className={paginationClass}>
      <ul className="pagination pull-right">
        <li className={classNames({'disabled': previousPage === undefined})}><a
          onClick={() => this._onPageClick(previousPage)}><span>&laquo;</span></a></li>
        <li className={classNames({'disabled': nextPage === undefined})}><a
          onClick={() => this._onPageClick(nextPage)}><span>&raquo;</span></a></li>
      </ul>
    </nav>);
  }

  _renderFooterPagination() {
    const {itemsPerPage = this.DEFAULT_PAGE_ITEM_COUNT} = this.props;
    const items = this._filterItems();
    const currentPage = this.state.currentPage;
    const numberOfPages = ceil(items.length / itemsPerPage);
    return (<nav className="col-xs-12">
      <ul className="pagination pull-right">
        {times(numberOfPages, (index) => <li key={index} className={classNames({'active': index === currentPage})}><a
          onClick={() => this._onPageClick(index)}>{index + 1}</a></li>)}
      </ul>
    </nav>);
  }

  _onPageClick(page) {
    if (page !== undefined) {
      this.setState({currentPage: page});
    }
  }

  _onFilterChange() {
    const filterString = this.refs.txtFilter.value;
    this.setState({currentPage: 0, filter: filterString});
  }

}

export default DpDataTable;
