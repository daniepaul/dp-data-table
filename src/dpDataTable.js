import React, { Component } from "react";
import PropTypes from "prop-types";
import map from "lodash/map";
import kebabCase from "lodash/kebabCase";
import ceil from "lodash/ceil";
import keys from "lodash/keys";
import times from "lodash/times";
import chunk from "lodash/chunk";
import filter from "lodash/filter";
import some from "lodash/some";
import toString from "lodash/toString";
import toLower from "lodash/toLower";
import startsWith from "lodash/startsWith";
import size from "lodash/size";
import includes from "lodash/includes";
import extend from "lodash/extend";
import sortBy from "lodash/sortBy";
import reverse from "lodash/reverse";
import isFunction from "lodash/isFunction";
import isNumber from "lodash/isNumber";
import classNames from "classnames";

import "./dpDataTable.scss";

class DpDataTable extends Component {
  DEFAULT_PAGE_ITEM_COUNT = 15;

  static get propTypes() {
    return {
      headers: PropTypes.object,
      items: PropTypes.array.isRequired,
      filterableFields: PropTypes.array,
      sortableFields: PropTypes.array,
      defaultSort: PropTypes.string,
      onEditing: PropTypes.func,
      onDeleting: PropTypes.func,
      onView: PropTypes.func,
      itemsPerPage: PropTypes.number,
      showFilter: PropTypes.bool,
      showSort: PropTypes.bool,
      hidePagination: PropTypes.bool,
      isLoading: PropTypes.bool,
      iconClasses: PropTypes.object,
      onSorting: PropTypes.func,
      onFiltering: PropTypes.func,
      onItemsChange: PropTypes.func,
      showContextColor: PropTypes.bool,
      className: PropTypes.string,
    };
  }

  constructor(props) {
    super(props);
    const headerKeys =
      size(props.headers) > 0
        ? keys(props.headers)
        : keys(props.items ? props.items[0] : {});
    this.state = {
      currentPage: 0,
      filter: "",
      sortKey: props.showSort
        ? props.defaultSort
          ? props.defaultSort
          : headerKeys[0]
        : "",
      sortOrder: props.showSort ? "ASC" : "NONE",
      changeReason: "INITIALIZED",
    };
  }

  render() {
    const { hidePagination, showFilter, isLoading, iconClasses, className } =
      this.props;
    const filteredItems = this._filterItems();
    const icons = extend({ LOADING: "bi bi-arrow-clockwise" }, iconClasses);
    return (
      <div
        className={classNames(className, "row", "gy-2", "data-table-component")}
        data-toggle="table"
      >
        {isLoading && (
          <div className="isLoading-container">
            <i className={icons.LOADING} />
          </div>
        )}
        {!isLoading && showFilter && this._renderFilter()}
        {!isLoading &&
          !hidePagination &&
          this._renderHeaderPagination(filteredItems)}
        {!isLoading && (
          <div className="table-responsive col-xs-12">
            <table className="table table-bordered table-striped">
              {this._renderHeader()}
              <tbody>{this._renderRow(filteredItems)}</tbody>
            </table>
          </div>
        )}
        {!isLoading &&
          !hidePagination &&
          this._renderFooterPagination(filteredItems)}
      </div>
    );
  }

  _renderHeader() {
    const { headers, items, showSort, sortableFields, iconClasses } =
      this.props;
    const sortClasses = extend(
      {
        SORT_NONE: "bi bi-filter",
        SORT_ASC: "bi bi-sort-down-alt",
        SORT_DESC: "bi bi-sort-down",
      },
      iconClasses
    );
    const { sortKey, sortOrder } = this.state;
    const itemHeaders = size(headers) > 0 ? headers : keys(items[0]);
    return (
      <thead className={"c" + size(headers)}>
        <tr>
          {map(itemHeaders, (header, headerKey) => {
            if (isNumber(headerKey)) {
              headerKey = header;
            }
            const isSortable =
              showSort &&
              (size(sortableFields) === 0 ||
                includes(sortableFields, headerKey));
            const solSortOrder = headerKey === sortKey ? sortOrder : "NONE";
            return (
              <th
                key={"header-" + kebabCase(headerKey)}
                data-sortable={isSortable}
                data-sort-key={headerKey}
                data-sort-order={solSortOrder}
                onClick={() => this._onSortChange(headerKey, isSortable)}
              >
                {header}
                {isSortable && (
                  <i
                    className={classNames(
                      "pull-right",
                      sortClasses["SORT_" + solSortOrder]
                    )}
                  />
                )}
              </th>
            );
          })}
          <th className="action" />
        </tr>
      </thead>
    );
  }

  _renderRow(filteredItems) {
    const {
      headers,
      onEditing,
      itemsPerPage = this.DEFAULT_PAGE_ITEM_COUNT,
      hidePagination,
      onDeleting,
      iconClasses,
      items,
      showContextColor,
      onView,
    } = this.props;
    const currentPage = !hidePagination ? this.state.currentPage : 0;
    const pagedItems = !hidePagination
      ? chunk(filteredItems, itemsPerPage)
      : [filteredItems];
    const icons = extend(
      {
        DELETE: "bi bi-trash",
        EDIT: "bi bi-pencil",
        VIEW: "bi bi-window-plus",
        POPOVER_VIEW: "bi bi-search",
      },
      iconClasses
    );
    const itemHeaders = size(headers) > 0 ? keys(headers) : keys(items[0]);
    return map(pagedItems[currentPage], (item, index) => {
      const { popover } = item;
      const contextCss = showContextColor ? item["__dp__contextCss"] : "";
      return (
        <tr key={index} className={contextCss}>
          {map(itemHeaders, (header) => (
            <td key={"item-" + index + "-" + kebabCase(header)}>
              {item[header]}
            </td>
          ))}
          <td className="action-buttons">
            {onEditing && (
              <a onClick={() => this._onEditing(item, index)}>
                <i className={icons.EDIT} />
              </a>
            )}
            {onDeleting && (
              <a onClick={() => this._onDeleting(item, index)}>
                <i className={icons.DELETE} />
              </a>
            )}
            {onView && (
              <a onClick={() => this._onViewing(item, index)}>
                <i className={icons.VIEW} />
              </a>
            )}
            {popover && (
              <a
                data-toggle="popover"
                data-trigger="hover"
                data-placement="left"
                data-html="true"
                data-content={popover}
              >
                <i className={icons.POPOVER_VIEW} />
              </a>
            )}
          </td>
        </tr>
      );
    });
  }

  componentDidMount() {
    this.triggerPopover();
  }

  componentDidUpdate() {
    const { filter } = this.state;
    this.triggerPopover();
    if (this.refs && this.refs.txtFilter) {
      this.refs.txtFilter.value = filter || "";
    }
  }

  triggerPopover() {
    if (
      window &&
      window.$ &&
      window.$(".data-table-component a[data-toggle=popover]").popover
    ) {
      window
        .$(".data-table-component a[data-toggle=popover]")
        .popover({ container: "body" });
    }
  }

  _filterItems() {
    const { items, filterableFields, headers, onSorting, onFiltering } =
      this.props;
    const headerKeys = size(headers) > 0 ? keys(headers) : keys(items[0] || {});
    const { sortKey, sortOrder } = this.state;
    const filterString = this.state.filter || "";
    const filterKeys =
      filterableFields && filterableFields.length
        ? filterableFields
        : headerKeys;
    let processedItems = items;
    if (filterString !== "") {
      if (isFunction(onFiltering)) {
        processedItems = onFiltering({ items: processedItems, filterString });
      } else {
        processedItems = filter(items, (item) => {
          return some(filterKeys, (filterKey) => {
            return (
              item &&
              item[filterKey] &&
              startsWith(
                toLower(toString(item[filterKey])),
                toLower(filterString)
              )
            );
          });
        });
      }
    }
    if (sortKey !== "") {
      if (isFunction(onSorting)) {
        processedItems = onSorting({
          items: processedItems,
          sortKey,
          sortOrder,
        });
      } else {
        processedItems = sortBy(processedItems, [sortKey]);
        if (sortOrder === "DESC") {
          processedItems = reverse(processedItems);
        }
      }
    }
    this._onItemsChange({ items: processedItems });
    return processedItems;
  }

  _renderFilter() {
    const { iconClasses } = this.props;
    const icons = extend(
      {
        FILTER: "bi bi-search",
      },
      iconClasses
    );
    return (
      <div className="form-group col-xs-12 col-sm-6">
        <div className="input-group">
          <div className="input-group-prepend">
            <span class="input-group-text">
              <i className={icons.FILTER} />
            </span>
          </div>
          <input
            type="text"
            className="form-control"
            id="filterTextInput"
            placeholder="Filter"
            aria-label="Filter text"
            onChange={(e) => this._onFilterChange(e)}
          />
        </div>
      </div>
    );
  }

  _renderHeaderPagination(items) {
    const {
      itemsPerPage = this.DEFAULT_PAGE_ITEM_COUNT,
      showFilter,
      iconClasses,
    } = this.props;
    const currentPage = this.state.currentPage;
    const paginationClass = classNames(
      "form-group col-xs-12 col-sm-6 d-flex justify-content-end"
    );
    const icons = extend(
      {
        PAGE_PREV: "bi bi-chevron-double-left",
        PAGE_NEXT: "bi bi-chevron-double-right",
      },
      iconClasses
    );
    const numberOfPages = ceil(items.length / itemsPerPage);
    const previousPage = currentPage > 0 ? currentPage - 1 : undefined;
    const nextPage =
      currentPage + 1 < numberOfPages ? currentPage + 1 : undefined;
    return (
      <nav className={paginationClass}>
        <ul className="pagination pull-right">
          <li
            className={classNames("page-item", {
              disabled: previousPage === undefined,
            })}
          >
            <a
              className="page-link"
              aria-label="Previous"
              onClick={() => this._onPageClick(previousPage)}
            >
              <span aria-hidden="true">
                <i className={icons.PAGE_PREV} />
              </span>
            </a>
          </li>
          <li className={classNames({ disabled: nextPage === undefined })}>
            <a
              className="page-link"
              aria-label="Next"
              onClick={() => this._onPageClick(nextPage)}
            >
              <span aria-hidden="true">
                <i className={icons.PAGE_NEXT} />
              </span>
            </a>
          </li>
        </ul>
      </nav>
    );
  }

  _renderFooterPagination(items) {
    const { itemsPerPage = this.DEFAULT_PAGE_ITEM_COUNT } = this.props;
    const currentPage = this.state.currentPage;
    const numberOfPages = ceil(items.length / itemsPerPage);
    return (
      <nav className="col-xs-12">
        <ul className="pagination pull-right">
          {times(numberOfPages, (index) => (
            <li
              key={index}
              className={classNames("page-item", {
                active: index === currentPage,
              })}
            >
              <a class="page-link" onClick={() => this._onPageClick(index)}>
                {index + 1}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  _onPageClick(page) {
    if (page !== undefined) {
      this.setState({ currentPage: page, changeReason: "PAGE_CHANGED" });
    }
  }

  _onEditing(item, index) {
    const { onEditing } = this.props;
    this._onItemsChange({ changeReason: "ROW_EDITING", index, item });
    if (isFunction(onEditing)) {
      onEditing({ item, index });
    }
  }

  _onViewing(item, index) {
    const { onView } = this.props;
    this._onItemsChange({ changeReason: "ROW_VIEWING", index, item });
    if (isFunction(onView)) {
      onView({ item, index });
    }
  }

  _onDeleting(item, index) {
    const { onDeleting } = this.props;
    this._onItemsChange({ changeReason: "ROW_DELETING", index, item });
    if (isFunction(onDeleting)) {
      onDeleting({ item, index });
    }
  }

  _onFilterChange(e) {
    const filterString = e.target.value;
    this.setState({
      currentPage: 0,
      filter: filterString,
      changeReason: "FILTER_CHANGED",
    });
  }

  _onSortChange(headerKey, isSortable) {
    if (isSortable) {
      const { sortKey, sortOrder } = this.state;
      if (headerKey !== sortKey) {
        this.setState({
          sortKey: headerKey,
          sortOrder: "ASC",
          changeReason: "SORT_CHANGED",
        });
      } else {
        switch (sortOrder) {
          case "NONE":
          case "DESC":
            this.setState({
              sortKey: headerKey,
              sortOrder: "ASC",
              changeReason: "SORT_CHANGED",
            });
            break;
          case "ASC":
          default:
            this.setState({
              sortKey: headerKey,
              sortOrder: "DESC",
              changeReason: "SORT_CHANGED",
            });
            break;
        }
      }
    }
  }

  _onItemsChange(options) {
    const { onItemsChange } = this.props;
    if (isFunction(onItemsChange)) {
      onItemsChange(extend({}, this.state, options));
    }
  }
}

export default DpDataTable;
