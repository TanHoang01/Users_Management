import { Row, Col, Image, Form, Input, Button, notification } from "antd";
import { useState, useEffect } from "react";
import { 
    MailOutlined,
    UserOutlined,
 } from "@ant-design/icons";

function Profile() {
    let token = JSON.parse(localStorage.getItem("token"));
    let userId = JSON.parse(localStorage.getItem("userId"));

    const [api, contextHolder] = notification.useNotification();

    const [userWithId, setUserWithId] = useState();
    const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);

    //Notifile update user
    const openNotificationUpdate = (placement, type) => {
        api.info({
        message: (<div style={{ color: "black" }}>{placement}</div>),
            description: (<div style={{ color: "black" }}>{type === "error" ? "Something went wrong." : "User's information has been updated."}</div>),
            placement,
        style: { backgroundColor: type === "error" ? "#FF8A8A" : "#8AFF8A" },
        });
    };

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
        await fetch('http://localhost:8000/v1/user/' + userId + '/update', {
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
            if (response.ok === true)
            openNotificationUpdate("Update user succesfully", "success")
            else openNotificationUpdate("Update user fail", "error")
        }).catch((err) => console.log(err))
    }


    useEffect(() => {
        fetchUserById()
    }, [])
    
    //Submit update user
    const onFinishUpdate = (values) => {
        updateUser(values);
        setIsModalOpenUpdate(false);
    }

    const onFinishFailedUpdate = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return ( 
        <Row>
            {contextHolder}
            <Col span={6}></Col>
            <Col span={12}>
                <div style={{display:"flex", justifyContent:"center", marginBottom:"40px"}}>
                    <Image style={{ borderRadius: '50%' }} width={120} height={120} src={"https://as1.ftcdn.net/v2/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg"} />
                </div>
                <Form
                    name="basic"
                    wrapperCol={{
                    span: 24,
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
            </Col>
            <Col span={6}></Col>
        </Row>
    );
}

export default Profile;