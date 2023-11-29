import React, { useState } from "react";
import { Button, Checkbox, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";

import Bmob from "hydrogen-js-sdk";
Bmob.initialize(
  import.meta.env.VITE_BMOB_SECRET_KEY,
  import.meta.env.VITE_BMOB_API_KEY,
);

type FieldType = {
  username?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  email?: string;
  remember?: boolean;
};

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const onLoginFinish = (values: any, isSignUp: boolean) => {
    if (isSignUp) {
      const signUpParams = {
        username: values.username,
        password: values.password,
        email: values.email,
        phone: values.phone,
      };

      Bmob.User.register(signUpParams)
        .then(() => {
          messageApi.open({
            type: "success",
            content: "Register success!",
          });
          setIsSignUp(false);
        })
        .catch((err) => {
          messageApi.open({
            type: "error",
            content: "Register failed: " + err.error,
          });
        });
    } else {
      Bmob.User.login(values.username, values.password)
        .then(() => {
          messageApi.open({
            type: "success",
            content: "Login success! Welcome back!",
          });
          navigate(`/user/${values.username}`);
        })
        .catch((err) => {
          messageApi.open({
            type: "error",
            content: "Login failed: " + err.error,
          });
        });
    }
  };

  const onLoginFinishFailed = (errorInfo: any) => {
    messageApi.open({
      type: "error",
      content: "Login failed: " + errorInfo,
    });
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <>
      {contextHolder}
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={(values) => onLoginFinish(values, isSignUp)}
        onFinishFailed={onLoginFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        {isSignUp && (
          <>
            <Form.Item<FieldType>
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The two passwords that you entered do not match!",
                      ),
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item<FieldType>
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Phone"
              name="phone"
              rules={[
                { required: true, message: "Please input your phone number!" },
              ]}
            >
              <Input />
            </Form.Item>
          </>
        )}

        <Form.Item<FieldType>
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>
          <Button type="link" onClick={toggleForm}>
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default LoginForm;
