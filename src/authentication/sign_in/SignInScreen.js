import "./SignInScreen.css"
import { useNavigate } from "react-router-dom";
import { Typography, Input, Button, Row, Col, Form, notification} from "antd";
import { LockOutlined, UserOutlined} from "@ant-design/icons";

const { Title } = Typography

function SignInScreen() {
    const navigate = useNavigate();
    const [api, contextHolder] = notification.useNotification();

    const openNotification = (placement, type) => {
        api.info({
        message: (<div style={{ color: "black" }}>{placement}</div>),
            description: (<div style={{ color: "black" }}>{type === "error" ? "Your gmail or password is wrong. Please try again!" : "Now you can enjoy our website. Have a nice day <3"}</div>),
            placement,
        style: { backgroundColor: type === "error" ? "#FF8A8A" : "#8AFF8A" },
        });
    };

    const postSignIn = async (values) => {
        await fetch('http://localhost:8000/v1/auth/login', {
            method: 'POST',

            body: JSON.stringify({
                username: values.username,
                password: values.password
            }),

            headers: {
                'Content-type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((response) => {
            if (Object.keys(response).length !== 0 && response !== "Incorrect password") {
                storeToken(response);
                checkSignIn(response);       
            } else {
                openNotification('Sign in fail', "error"); 
            }    
        })        
        .catch (err => console.log(err))     
    }

    const storeToken = (response) => {
        localStorage.setItem('token', JSON.stringify(response.accessToken));
        localStorage.setItem('userId', JSON.stringify(response._id));
        localStorage.setItem('isAdmin', JSON.stringify(response.isAdmin));   
        localStorage.setItem('where', JSON.stringify("dashboard"));      
    }

    const checkSignIn = (response) => {
            if (response.accessToken !== undefined) {
                let userId = JSON.parse(localStorage.getItem("userId"));
                if (response.isAdmin === true) {
                    openNotification("Sign in suceessfully, welcome admin", "success")
                    setTimeout(() => {
                        navigate(`/admin/${userId}/dashboard`);
                    }, 2000)                   
                } else {
                    openNotification("Sign in suceessfully", "success")
                    setTimeout(() => {
                        navigate(`/user/${userId}/dashboard`);
                    }, 2000)         
                }
            } else {
                openNotification('Sign in fail',"error")
            }        
    }

    const onFinish = (values) => {
        postSignIn(values);
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return ( 
        <Row id="signin_bg" align={"middle"}>
            {contextHolder}
            <Col span={8}></Col>
            <Col span={8} id="signin_ctn">
                <Title style={{textAlign: "center", marginBottom:"24px"}} level={2}>Sign In</Title>
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
                        <Title style={{ textAlign: "center", margin:"auto 0" }} level={5}>Don't have an account yet? <a href="./signup">Sign up</a></Title>
                    </Form.Item>
                </Form>
            </Col>
            <Col span={8}></Col>
        </Row>
     );
}

export default SignInScreen;