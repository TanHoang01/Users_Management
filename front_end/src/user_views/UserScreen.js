import "./UserScreen.css"
import React, { useEffect, useState } from "react";
import { Layout, Menu, theme, Typography, Image, Modal} from "antd";

import { 
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    LogoutOutlined,
    HomeOutlined,
 } from "@ant-design/icons";
import {useNavigate, Routes, Route} from "react-router-dom";
import DashBoard from "./dasboard/DashBoard"
import Profile from "./profile/Profile";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

function UserScreen() {
    let token = JSON.parse(localStorage.getItem("token"));
    let userId = JSON.parse(localStorage.getItem("userId"));
    let isAdmin = JSON.parse(localStorage.getItem("isAdmin"));
    let where = JSON.parse(localStorage.getItem("where"));

    const navigate = useNavigate();
    const [userWithId, setUserWithId] = useState();
    const [collapsed, setCollapsed] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    //Redirect when missing token
    useEffect(() => {
        if (token === null) {
            navigate("/signin");     
        }
        if (isAdmin !== false) {
            navigate("/")
        }
    }, [])

    //Get user by id
    const fetchUserById = async () => {
        try {
            fetch("http://localhost:8000/v1/user/" + userId, {
                method: "GET",
                headers: {
                    "token": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
                .then((response) => response.json())
                .then((response) => { setUserWithId(response)})
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchUserById()  
    }, [])

    //Log out
    const logOut = async () => {
        try {
            await fetch("http://localhost:8000/v1/auth/logout", {
                method: "POST",

                body: JSON.stringify({
                    userId: userId
                }),

                headers: {
                    "token": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }).then((response) => {
                if (response.ok) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("userId"); 
                    localStorage.removeItem("isAdmin"); 
                    localStorage.removeItem("where"); 
                    navigate("/signin")
                }
            })
        } catch (err) {
            console.log(err)
        }
    }
    
    //Modal func
    const showModal= () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        logOut();
        setIsModalOpen(false);
    };
    const handleCancel= () => {
        setIsModalOpen(false);
    };
    
    return ( 
        <Layout style={{ height: '100vh' }}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
            <div className="logo">
                <Title style={{color: "white",textAlign:'center',padding:'15px',display: collapsed ? "none" : "block"}} level={4}>Welcome</Title>        
            </div>
                <Menu       
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['dashboard']}    
                items={[
                {
                    key: 'dashboard',
                    icon: <HomeOutlined />,
                    label: 'Dashboard',
                },
                {
                    key: 'profile',
                    icon: <UserOutlined />,
                    label: 'My Profile',
                },
                {
                    key: 'logout',
                    icon: <LogoutOutlined />,
                    label: 'Logout',
                },
                ]}
                    onClick={({ key }) => {
                        if (key === "logout") {
                            showModal()
                        } else {
                            navigate(key);
                            localStorage.setItem('where', JSON.stringify(key));
                        }       
                }}     
            />
        </Sider>
        <Layout className="site-layout">
            <Header 
                style={{
                    padding: "0 20px",
                    background: colorBgContainer,
                    display: "flex",
                    justifyContent: "space-between"
                }}
                >
                <div style={{display:"flex"}}>
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: () => setCollapsed(!collapsed),
                    })}
                        <Title style={{ margin: "auto 0", paddingLeft: "20px" }} level={5}>{where.charAt(0).toUpperCase() + where.slice(1)}</Title>
                </div>
                <div style={{ display: "flex" }}>
                    {userWithId !== undefined && <Title style={{ margin: "auto 0", paddingRight: "10px" }} level={5}>Hello, {userWithId.username}</Title>}        
                    <Image style={{borderRadius:'50%'}} width={30} height={30} src={"https://as1.ftcdn.net/v2/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg"} />
                </div>
            </Header>
                <Content   
                style={{
                    margin: '24px 16px',
                    padding: 24,
                    minHeight: 500,
                    background: colorBgContainer,
                }}
                >
                <Routes>
                    <Route path="/dashboard" element={<DashBoard />} /> 
                    <Route path="/profile" element={<Profile />}/>    
                </Routes>
                </Content>
            </Layout>
            <Modal title="Log out" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>Do you want to log out?</p>
            </Modal>
        </Layout>
        );
}

export default UserScreen;