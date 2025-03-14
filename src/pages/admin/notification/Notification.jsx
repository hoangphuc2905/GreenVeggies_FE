import React from "react";
import { List, Avatar } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
export const notifies = [
  {
    title: "Thông báo 1",
    description: "Nội dung thông báo 1",
  },
  {
    title: "Thông báo 2",
    description: "Nội dung thông báo 2",
  },
  {
    title: "Thông báo 3",
    description: "Nội dung thông báo 3",
  },
  {
    title: "Thông báo 4",
    description: "Nội dung thông báo 4",
  },
];

const Notification = () => {
  return (
    <div className="w-[300px]">
      <List
        className="hover:cursor-pointer"
        itemLayout="horizontal"
        dataSource={notifies}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar icon={<FontAwesomeIcon icon={faBell} />} />}
              title={item.title}
              description={item.description}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default Notification;
