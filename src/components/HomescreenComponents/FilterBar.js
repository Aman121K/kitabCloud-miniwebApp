import React from 'react';
import './FilterBar.css';

const FilterBar = ({ filterData, selectedFilterTab, setSelectedFilterTab }) => {
  return (
    <div className="filter-bar">
      {filterData.map((item) => (
        <button
          key={item}
          className={`filter-tab${selectedFilterTab === item ? ' selected' : ''}`}
          onClick={() => setSelectedFilterTab(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default FilterBar; 