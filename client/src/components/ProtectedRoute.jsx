import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  HomeOutlined,
  LogoutOutlined,
  ProfileOutlined,
  UserOutlined,
  PlaySquareOutlined,
} from "@ant-design/icons";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { GetCurrentUser } from "../apicalls/user";
import { SetUser } from "../redux/userSlice";
import { Layout, Menu, message } from "antd";
import { Header } from "antd/es/layout/layout";


const ProtectedRoute = ({ children }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const navItems = [
    {
      label: "Home",
      icon: <HomeOutlined />,
      key: "home",
      onClick: () => navigate("/"),
    },
    {
      label: `${user ? user.name : ""}`,
      icon: <UserOutlined />,
      children: [
        {
          label: (
            <span
              onClick={() => {
                if (user.role === "admin") {
                  navigate("/admin");
                } else if (user.role === "partner") {
                  navigate("/partner");
                } else {
                  navigate("/profile");
                }
              }}
            >
              My Profile
            </span>
          ),
          icon: <ProfileOutlined />,
        },
        {
          label: (
            <Link
              to="/login"
              onClick={() => {
                localStorage.removeItem("token");
              }}
            >
              Logout
            </Link>
          ),
          icon: <LogoutOutlined />,
        },
      ],
    },
  ];


  const getValidUser = async () => {
    try {
      dispatch(showLoading());
      const response = await GetCurrentUser();
      if (response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
      dispatch(SetUser(response.data));
      dispatch(hideLoading());
    } catch (err) {
      dispatch(SetUser(null));
      messageApi.open({
        type: "error",
        content: err?.response?.data?.message || err.message,
      });
    }
  };


  useEffect(() => {
    if (localStorage.getItem("token")) {
      getValidUser();
    } else {
      navigate("/login");
    }
  }, []);


  return (
    <div>
      {contextHolder}
      {user && (
        <Layout>
          <Header
            className="d-flex justify-content-between"
            style={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              width: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <h3 className="demo-logo text-white m-0" style={{
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <PlaySquareOutlined style={{
                fontSize: "24px",
                color: "#1890ff"
              }} />
              Book My Movie
            </h3>
            <Menu theme="dark" mode="horizontal" items={navItems} />
          </Header>
          <div style={{ padding: 24, minHeight: "100vh", background: "#fff" }}>
            {children}
          </div>
        </Layout>
      )}
    </div>
  );
};


export default ProtectedRoute;




