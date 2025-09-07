import React from "react";
import { Tabs } from "antd";
import TheatreList from "./TheatreList";

export default function Partner() {
  const tabItems = [
    {
      key: "1",
      label: "Theatres",
      children: <TheatreList />,
    },
  ];
  return (
    <div>
      <h1>Partner Page</h1>
      <Tabs items={tabItems} />
    </div>
  );
}
