import "./SignUpScreen.css"
import { useNavigate } from "react-router-dom";
import { Typography, Input, Button, Row, Col, Form, notification } from "antd";
import { LockOutlined, UserOutlined, MailOutlined} from "@ant-design/icons";

const { Title } = Typography;

function SignUpScreen() {
    const navigate = useNavigate();
    const [api, contextHolder] = notification.useNotification();

    const openNotification = (placement, type) => {
        api.info({
        message: (<div style={{ color: "black" }}>{placement}</div>),
            description: (<div style={{ color: "black" }}>{type === "error" ? "Your username or email is already existed, please try again." : "Now you can enjoy our website. Have a nice day <3"}</div>),
            placement,
        style: { backgroundColor: type === "error" ? "#FF8A8A" : "#8AFF8A" },
        });
    };

    const openNotificationPass = (placement) => {
        api.info({
            message: (<div style={{ color: "black" }}>{placement}</div>),
            description: (<div style={{ color: "black" }}>{"Your passwords do not match, please check again."}</div>),
            placement,
        style: { backgroundColor:"#FF8A8A" },
        });
    };

    const postSignUp = async (values) => {
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

        })
        .then((response) => {
            if (response.ok === true) {
                openNotification('Create account successfully', "success");
                setTimeout(() => {
                    navigate("/signin");
                }, 2000) 
            } else {
                openNotification('Create account fail', "error");                
            }    
        })
        .catch(err => console.log(err))
    }

    const onFinish = (values) => {
        if (values.password === values.repassword) {
            postSignUp(values);
        } else {
            openNotificationPass("Password do not match");
        }
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Row id="signup_bg" align={"middle"}>
            {contextHolder}
            <Col span={8}></Col>
            <Col span={8} id="signup_ctn">
                <Title style={{ textAlign: "center", marginBottom:"24px" }} level={2}>Sign Up</Title>
                <Form
                    name="basic"
                    wrapperCol={{
                    span: 24,
                    }}
                    style={{
                    maxWidth: "100%",
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
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

                    <Form.Item
                    name="repassword"
                    rules={[
                        {
                        required: true,
                        message: 'Please retype your password!',
                        },
                    ]}
                    >
                    <Input.Password prefix={<LockOutlined className="icon"/>} placeholder="Retype your password"/>
                    </Form.Item>

                    <Form.Item style={{textAlign:"right"}}
                    >
                        <a href="./forgotpassword">Forgot password?</a>
                    </Form.Item>

                    <Form.Item>
                        <Button style={{ width: "100%" }} type="primary" htmlType="submit">
                        LOGIN
                    </Button>
                    </Form.Item>

                    <Form.Item>
                        <Title style={{ textAlign: "center", margin:"auto 0" }} level={5}>Already have a account? <a href="./signin">Sign in</a></Title>
                    </Form.Item>
                </Form>
            </Col>
            <Col span={8}></Col>
        </Row>
     );
}

export default SignUpScreen;