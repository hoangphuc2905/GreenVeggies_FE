import { Checkbox, Menu } from "antd";

const ColumnFilterMenu = ({
  columnsVisibility,
  handleColumnVisibilityChange,
  columnNames,
}) => {
  const handleMenuClick = (e) => {
    e.domEvent.stopPropagation();
  };

  return (
    <Menu>
      {columnNames.map((column) => (
        <Menu.Item key={column.key} onClick={handleMenuClick}>
          <Checkbox
            checked={columnsVisibility[column.key]}
            onChange={() => handleColumnVisibilityChange(column.key)}
          >
            {column.title}
          </Checkbox>
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default ColumnFilterMenu;