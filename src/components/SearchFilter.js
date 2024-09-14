// SearchFilter.js
import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { FiFilter } from 'react-icons/fi'
import { LiaSortSolid } from 'react-icons/lia'

const SearchFilter = ({
  searchQuery,
  setSearchQuery,
  filterAmount,
  setFilterAmount,
  filterType,
  setFilterType,
  sortColumn,
  handleSortChange,
  sortOrder,
  handleSortOrderChange,
}) => {
  return (
    <div className="search-filter-container">
      {/* Sort dropdown */}
      <div className="filter-bar">
        <LiaSortSolid className="search-icon" />
        <label>Sort By: </label>
        <select
          onChange={(e) => handleSortChange(e.target.value)}
          value={sortColumn}
        >
          <option value="">Default</option>
          <option value="name">Name</option>
          <option value="phoneNumber">Phone Number</option>
          <option value="address">Address</option>
          <option value="city">City</option>
          <option value="state">State</option>
          <option value="amountReceived">Amount Received</option>
          <option value="username">Received by</option>
          <option value="dateTime">Date & Time</option>
        </select>
        {'  '}
        {/* Dropdown for selecting sorting order */}
        <select
          onChange={(e) => handleSortOrderChange(e.target.value)}
          value={sortOrder}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {/* Search bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FaSearch className="search-icon" />
      </div>

      {/* Filter by amount */}
      <div className="filter-bar">
        <span>
          <FiFilter />
        </span>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="greater">Greater than</option>
          <option value="less">Less than</option>
          <option value="equals">Equals</option>
        </select>
        <input
          type="number"
          placeholder="Filter by amount..."
          value={filterAmount}
          onChange={(e) => setFilterAmount(e.target.value)}
        />
      </div>
    </div>
  )
}

export default SearchFilter
