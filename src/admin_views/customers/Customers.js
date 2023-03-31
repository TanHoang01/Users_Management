import { Table, Image, Button, notification, Modal, Form, Input, Select, Tooltip, DatePicker } from "antd";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    EditOutlined,
    DeleteOutlined,
    UserAddOutlined,
    MailOutlined,
    UserOutlined,
    LockOutlined,
    CloseOutlined,
    SearchOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
 
import("./Customers.css");

function Customers() {
    const navigate = useNavigate();
    const [user, setUser] = useState([]);
    const [userWithId, setUserWithId] = useState();
    const [id, setId] = useState("");
    const [isChange, setIsChange] = useState(false);
    const [select, setSelect] = useState("newest");
    const [search, setSearch] = useState("");
    const [date, setDate] = useState("");
    let token = JSON.parse(localStorage.getItem("token"));
    let userId = JSON.parse(localStorage.getItem("userId"));

    //Form
    const [formCreateUser] = Form.useForm();

    //Modal
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
    const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);

    //Notifile
    const [api, contextHolder] = notification.useNotification();

    //Notifile delete user
    const openNotificationDelete = (placement, type) => {
        api.info({
        message: (<div style={{ color: "black" }}>{placement}</div>),
            description: (<div style={{ color: "black" }}>{type === "error" ? "Something went wrong." : "This user has been removed."}</div>),
            placement,
        style: { backgroundColor: type === "error" ? "#FF8A8A" : "#8AFF8A" },
        });
    };

    //Notifile create user
    const openNotificationCreate = (placement, type) => {
        api.info({
        message: (<div style={{ color: "black" }}>{placement}</div>),
            description: (<div style={{ color: "black" }}>{type === "error" ? "Something went wrong." : "User has been created."}</div>),
            placement,
        style: { backgroundColor: type === "error" ? "#FF8A8A" : "#8AFF8A" },
        });
    };

    //Notifile update user
    const openNotificationUpdate = (placement, type) => {
        api.info({
        message: (<div style={{ color: "black" }}>{placement}</div>),
            description: (<div style={{ color: "black" }}>{type === "error" ? "Something went wrong." : "User's information has been updated."}</div>),
            placement,
        style: { backgroundColor: type === "error" ? "#FF8A8A" : "#8AFF8A" },
        });
    };

    //Modal for delete user
    const showModalDelete = (id) => {
        setIsModalOpenDelete(true);
        setId(id);
    };
    const handleOkDelete = () => {
        deleteUser(id);
        setIsModalOpenDelete(false);
        if (id === userId) navigate("/signin");
    };
    const handleCancelDelete = () => {
        setIsModalOpenDelete(false);
    };

    //Modal for create user
    const showModalCreate = (id) => {
        setIsModalOpenCreate(true);
    };

    //Modal for update user
    const showModalUpdate = (id) => {
        fetchUserById(id);
        setIsModalOpenUpdate(true);
        setId(id);
    };

    //Get User
    const fetchUser = async () => {
        try {
            await fetch("http://localhost:8000/v1/user/", {
                method: "GET",
                headers: {
                    "token": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
                .then((response) => response.json())
                .then((response) => {
                    if (date !== "" && search === "") {
                        const final_res = response.filter(res => {
                            if (res.createdAt.includes(date) || res.updatedAt.includes(date)) {
                                return res;
                            }
                        });
                        if (select === "newest") setUser(final_res.reverse());
                        else setUser(final_res);
                    }else if (date === "" && search !== "") {
                        const final_res = response.filter(res => {
                            if (res.username.includes(search) || res.email.includes(search)) {
                                return res;
                            }
                        })
                        if (select === "newest") setUser(final_res.reverse());
                        else setUser(final_res);
                    } else if (date !== "" && search !== "") { 
                        const final_res = response.filter(res => {
                            if ((res.createdAt.includes(date) || res.updatedAt.includes(date)) && (res.username.includes(search) || res.email.includes(search))) {
                                return res;
                            }
                        })
                        if (select === "newest") setUser(final_res.reverse());
                        else setUser(final_res);
                    } else {
                        if (select === "newest") setUser(response.reverse());
                        else setUser(response);
                    }
                })
        } catch (err) {
            console.log(err)
        }
    }

    //Delete user
    const deleteUser = async (userId) => {
        await fetch('http://localhost:8000/v1/user/' + userId +"/delete", {
            method: 'DELETE',
            headers: {
                "token": `Bearer ${token}`,
                'Content-type': 'application/json'
            }
        }).then((response) => {
            if (response.ok === true) {
                openNotificationDelete("Delete user succesfully", "success");
                if (isChange === false) setIsChange(true);
                else setIsChange(false);
            }
            else openNotificationDelete("Delete user fail", "error")
        }).catch((err) => console.log(err))          
    }

    // Create user
    const createUser = async (values) => {
        await fetch('http://localhost:8000/v1/auth/register', {
            method: 'POST',

            body: JSON.stringify({
                email: values.email,
                username: values.username,
                password: values.password
            }),

            headers: {
                'Content-type': 'application/json'
            }

        }).then((response) => {
            if (response.ok === true) {
                openNotificationCreate("Create user succesfully", "success");
                if (isChange === false) setIsChange(true);
                else setIsChange(false);
            }
            else openNotificationCreate("Create user fail", "error")
        }).catch((err) => console.log(err))
    }

    //Get user by id
    const fetchUserById = async (userId) => {
        try {
            fetch("http://localhost:8000/v1/user/" + userId, {
                method: "GET",
                headers: {
                    "token": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
                .then((response) => response.json())
                .then((response) => { setUserWithId([
                    {
                        name: ['email'],
                        value: response.email,
                    },
                    {
                        name: ['username'],
                        value: response.username,
                    }
                    ])})
        } catch (err) {
            console.log(err)
        }
    }

    //Update user
    const updateUser = async (values) => {
        await fetch('http://localhost:8000/v1/user/' + id + '/update', {
            method: "PUT",
            
            body: JSON.stringify({
                email: values.email,
                username: values.username
            }),

            headers: {
                "token": `Bearer ${token}`,
                'Content-type': 'application/json'
            }
        }).then((response) => {
            if (response.ok === true) {
                openNotificationUpdate("Update user succesfully", "success");
                if (isChange === false) setIsChange(true);
                else setIsChange(false);
            }
            else openNotificationUpdate("Update user fail", "error")
        }).catch((err) => console.log(err))
    }

    useEffect(() => {
        fetchUser();
    }, [])

    useEffect(() => {
        fetchUser();
    },[isChange])

    //Table column
    const columns = [
    {
        title: 'Avatar',
        width: 80,
        align: 'center',
        fixed: 'left',
        render: () => <Image style={{borderRadius:'50%'}} width={80} height={80} src="https://as1.ftcdn.net/v2/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg">action</Image>,
    },
    {
        title: 'Full Name',
        width: 120,
        render: (text, record) => <b>{record.username}</b>
    },
    {
        title: 'Email',
        width: 120,
        render: (text, record) => <b>{record.email}</b>
    },
    {
        title: 'Admin',
        width: 120,
        render: (text, record) => <b>{record.isAdmin === true ? "Admin" : "User"}</b> 
        },
    {
        title: 'Created Time',
        width: 120,
        render: (text, record) => <b>{record.createdAt.substring(0, 10)}</b> 
        },
    {
        title: 'Last Updated',
        width: 120,
        render: (text, record) => <b>{record.updatedAt.substring(0, 10)}</b> 
    },
    {
        key: 'func',
        fixed: 'right',
        width: 50,
        render: (text, record) => <div style={{ display: "flex", justifyContent: "center" }}>
            <Button onClick={()=>showModalUpdate(record._id)} style={{ marginRight: '10px', display: userId === record._id ? "block" : "none" }} type="primary" shape="circle" icon={<EditOutlined />} />
            <Button onClick={()=>showModalDelete(record._id)} type="primary" shape="circle" icon={<DeleteOutlined />} danger />
        </div>,
    },
    ];
    
    //Submit create user
    const onFinishCreate = (values) => {
        createUser(values);
        formCreateUser.resetFields();
        setIsModalOpenCreate(false);
    }

    const onFinishFailedCreate = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    //Submit update user
    const onFinishUpdate = (values) => {
        updateUser(values);
        setIsModalOpenUpdate(false);
    }

    const onFinishFailedUpdate = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    //filter
    const onChangeFilter = (value) => {
        setSelect(value);
        if (isChange === false) setIsChange(true);
        else setIsChange(false);
    }

    //search
    const onChangeSearch = (e) => {
        setSearch(e.target.value);
        if (isChange === false) setIsChange(true);
        else setIsChange(false);
    }

    //date
    const onChangeDate = (date, dateString) => {
        setDate(dateString);
        if (isChange === false) setIsChange(true);
        else setIsChange(false);
    }

    return ( 
        <>
            {contextHolder}
            <div id="func_bar" style={{ marginBottom: "20px", display:"flex", justifyContent:"space-between" }}>
                <DatePicker style={{marginBottom:"10px"}} onChange={onChangeDate} />
                <div id="func_bar_right">
                    <Input style={{ width: 350, marginBottom:"10px"}}
                        onChange={onChangeSearch}
                        placeholder="Search user here..."
                        prefix={<SearchOutlined />}
                        suffix={
                            <Tooltip title="Search user by name or email address">
                            <InfoCircleOutlined
                                style={{
                                color: 'rgba(0,0,0,.45)',
                                }}
                            />
                            </Tooltip>
                        }
                    />
                    <Select
                        defaultValue="newest"
                        style={{
                            width: 120,
                            marginLeft: 10,
                        }}
                        onChange={onChangeFilter}
                        options={[
                            {
                            value: 'oldest',
                            label: 'Oldest',
                            },
                            {
                            value: 'newest',
                            label: 'Newest',
                            },
                        ]}
                    />
                    <Button onClick={showModalCreate} style={{ backgroundColor: "black", marginLeft: "10px" }} type="primary" icon={<UserAddOutlined style={{ fontSize: "20px" }} />} />
                    </div>
            </div>
                {user.length > 0 && user.map(user => {
                    return (
                        <div>{user.name}</div>
                    )        
                })}
                <Table
                    columns={columns}
                    dataSource={user}
                    scroll={{
                        x: 1500,
                        y: 450,
                    }}
            />
            {/* Modal delete */}
            <Modal title="Delete User" open={isModalOpenDelete} onOk={handleOkDelete} onCancel={handleCancelDelete}>
                <p>Do you want to remove this user?</p>
            </Modal>
            {/* Modal create */}
            <Modal title="Create User" open={isModalOpenCreate} footer={null} closeIcon={<CloseOutlined onClick={()=>setIsModalOpenCreate(false)}/>}>
                <Form
                    name="basic"
                    form={formCreateUser}
                    wrapperCol={{
                    span: 24,
                    }}
                    style={{
                    maxWidth: "100%",
                    }}
                    initialValues={{
                    remember: true,
                    }}
                    onFinish={onFinishCreate}
                    onFinishFailed={onFinishFailedCreate}
                    autoComplete="off"                
                >   
                    <Form.Item
                    name="email"
                    rules={[
                        {
                        required: true,
                        message: 'Please input your email!',
                        },
                    ]}
                    >
                    <Input placeholder="Type your email" prefix={<MailOutlined className="icon"/>}/>
                    </Form.Item>

                    <Form.Item
                    name="username"
                    rules={[
                        {
                        required: true,
                        message: 'Please input your username!',
                        },
                    ]}
                    >
                    <Input placeholder="Type your username" prefix={<UserOutlined className="icon"/>}/>
                    </Form.Item>

                    <Form.Item
                    name="password"
                    rules={[
                        {
                        required: true,
                        message: 'Please input your password!',
                        },
                    ]}
                    >
                    <Input.Password prefix={<LockOutlined className="icon"/>} placeholder="Type your password"/>
                    </Form.Item>
                    <Form.Item>
                        <Button style={{ width: "100%" }} type="primary" htmlType="submit">
                        SUBMIT
                    </Button>
                    </Form.Item>
                </Form>
            </Modal>
            {/* Modal Update */}
            <Modal title="Update User" open={isModalOpenUpdate} footer={null} closeIcon={<CloseOutlined onClick={()=>setIsModalOpenUpdate(false)}/>}>
                <Form
                    name="basic"
                    wrapperCol={{
                    span: 24,
                    }}
                    style={{
                    maxWidth: "100%",
                    }}
                    fields = {userWithId}
                    onFinish={onFinishUpdate}
                    onFinishFailed={onFinishFailedUpdate}
                    autoComplete="off"
                >   
                    <Form.Item
                    name="email"
                    >
                    <Input prefix={<MailOutlined className="icon"/>}/>
                    </Form.Item>

                    <Form.Item
                    name="username"
                    >
                    <Input prefix={<UserOutlined className="icon"/>}/>
                    </Form.Item>

                    <Form.Item>
                        <Button style={{ width: "100%" }} type="primary" htmlType="submit">
                        UPDATE
                    </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default Customers;