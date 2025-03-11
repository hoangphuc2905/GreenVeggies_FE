import { Menu, Input, Select, Slider } from "antd";
import React from "react";

const { Option } = Select;

const FilterTableMenu = ({ columnNames, filters, setFilters }) => {
  if (!Array.isArray(columnNames)) {
    console.error("columnNames is not an array", columnNames);
    return null;
  }

  if (typeof setFilters !== "function") {
    console.error("setFilters is not a function", setFilters);
    return null;
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Menu>
      {columnNames.map((column) => {
        if (column.typeCol === "none") return null;

        return (
          <Menu.Item key={column.key}>
            <div className="p-2">
              <span className="block font-medium mb-1">{column.title}</span>
              {column.typeCol === "text" && (
                <Input
                  placeholder={`Nhập ${column.title}`}
                  value={filters?.[column.key] || ""}
                  onChange={(e) =>
                    handleFilterChange(column.key, e.target.value)
                  }
                />
              )}
              {column.typeCol === "select" && (
                <Select
                  placeholder={`Chọn ${column.title}`}
                  style={{ width: "100%" }}
                  value={filters?.[column.key] || null}
                  onChange={(value) => handleFilterChange(column.key, value)}
                >
                  {(column.options || []).map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              )}
              {column.typeCol.includes("Range") && (
                <Slider
                  range
                  min={0}
                  max={column.typeCol === "priceRange" ? 10000000 : 1000}
                  value={filters?.[column.key] || [0, 0]}
                  onChange={(value) => handleFilterChange(column.key, value)}
                />
              )}
            </div>
          </Menu.Item>
        );
      })}
    </Menu>
  );
};

export default FilterTableMenu;