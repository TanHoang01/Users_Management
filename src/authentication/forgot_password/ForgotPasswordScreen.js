import "./ForgotPasswordScreen.css"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Input, Button, Row, Col } from "antd";
import { MailOutlined} from "@ant-design/icons";

const {Title} = Typography

function ForgotPasswordScreen() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const checkForgotPassword = () => {
        
    }

    return ( 
        <Row id="forgotpassword_bg" align={"middle"}>
            <Col span={8}></Col>
            <Col span={8} id="forgotpassword_ctn">
                <Title style={{textAlign: "center"}} level={2}>Reset Your Password</Title>
                <Input onChange={(e) => { setEmail(e.target.value) }} style={{ width: "100%", marginBottom: "20px", height: '40px' }} placeholder="Type your email" prefix={<MailOutlined className="icon"/>} />
                <Button onClick={checkForgotPassword} type="primary" style={{ width: "100%",marginBottom:"15px", height: '40px' }}>OK</Button>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Title style={{ textAlign: "center", margin:"auto 0" }} level={5}>Remember your password?</Title>
                    <Button style={{ padding: '0', fontSize: '16px', marginLeft: "5px" }} type="link" onClick={() => navigate("/signin")}>Sign in</Button>
                </div>
            </Col>
            <Col span={8}></Col>
        </Row>
     );
}

export default ForgotPasswordScreen;