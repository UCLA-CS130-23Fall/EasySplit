import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./form";
import "./index.css";

import Bmob from "hydrogen-js-sdk";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const current = Bmob.User.current();

  useEffect(() => {
    if (current) {
      navigate(`/user/${current.username}`);
    }
  }, [current, navigate]);

  return (
    <div className="login-container">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
