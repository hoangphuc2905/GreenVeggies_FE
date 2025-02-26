import { Tag } from "antd";

const userRender = (props) => {
  const { label, closable, onClose } = props;
  const onPreventMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Tag
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      className="me-1"
      style={{
        marginInlineEnd: 4,
      }}
    >
      {label}
    </Tag>
  );
};

export default userRender;
