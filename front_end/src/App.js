import { Route, Routes, Navigate} from "react-router-dom";
import SignInScreen from "./authentication/sign_in/SignInScreen";
import SignUpScreen from "./authentication/sign_up/SignUpScreen";
import ForgotPasswordScreen from "./authentication/forgot_password/ForgotPasswordScreen";
import AdminScreen from "./admin_views/AdminScreen";
import UserScreen from "./user_views/UserScreen";

function App() {
  let token = JSON.parse(localStorage.getItem("token"));
  let isAdmin = JSON.parse(localStorage.getItem("isAdmin"));
  let userId = JSON.parse(localStorage.getItem("userId"));
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={
          token === null ? <Navigate to={"/signin"} /> : isAdmin === true ? <Navigate to={`/admin/${userId}`} /> : <Navigate to={`/user/${userId}`}/>
        } />
        <Route path="/signin" element={<SignInScreen />} />
        <Route path="/signup" element={<SignUpScreen />} />
        <Route path="/forgotpassword" element={<ForgotPasswordScreen />} />
        <Route path="/admin/:id/*" element={<AdminScreen />} />
        <Route path="/user/:id/*" element={<UserScreen/>}/>
      </Routes>
    </div>
  );
}

export default App;
