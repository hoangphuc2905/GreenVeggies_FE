import { Dropdown, ConfigProvider, Button } from "antd";
import { useState } from "react";
import ColumnFilterMenu from "./ColumnFilterMenu";
import FilterTableMenu from "./FilterTableMenu";
import { FilterOutlined } from "@ant-design/icons";

const FilterButton = ({
  columnsVisibility,
  handleColumnVisibilityChange,
  columnNames,
  filters,
  setFilters,
  title,
  typeFilter,
}) => {
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = (flag) => {
    setVisible(flag);
  };

  console.log("Filters in FilterButton:", filters);
  console.log("setFilters in FilterButton:", setFilters);

  const getMenu = () => {
    if (typeFilter === "column") {
      return (
        <ColumnFilterMenu
          columnsVisibility={columnsVisibility}
          handleColumnVisibilityChange={handleColumnVisibilityChange}
          columnNames={columnNames}
        />
      );
    } else if (typeFilter === "filter") {
      return (
        <FilterTableMenu
          columnNames={columnNames}
          filters={filters}
          setFilters={setFilters}
        />
      );
    }
    return null;
  };

  return (
    <ConfigProvider>
      <Dropdown
        overlay={getMenu()} // 🛠 Đã sửa lỗi gọi hàm ngay lập tức
        trigger={["click"]}
        visible={visible}
        onVisibleChange={handleVisibleChange}
      >
        <Button
          icon={<FilterOutlined />}
          className="font-bold text-base px-6 p-0 h-7 bg-[#eff2f5] border-"
          type="default"
        >
          <span className="text-xs">{title}</span>
        </Button>
      </Dropdown>
    </ConfigProvider>
  );
};

export default FilterButton;
