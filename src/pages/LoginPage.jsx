// src/pages/LoginPage.js
import { Button, Checkbox, Form, Input, message } from 'antd';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import loginSchema from '../schemas/LoginSchema';
import axios from 'axios';
import { TOKEN } from '../constants';

const LoginPage = ({setIsLogin}) => {
  let navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: true,
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try{
        let res=await axios.post('https://reqres.in/api/login',values);
        navigate("/teachers");
        localStorage.setItem(TOKEN,res.data.token);
        setIsLogin(true);
      }catch(err){
        console.log(err);
        message.error(err.response.data.error)
      }
    },
  });

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Form
        name="login"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        style={{ maxWidth: 600 }}
        onFinish={formik.handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          validateStatus={formik.touched.email && formik.errors.email ? 'error' : ''}
          help={formik.touched.email && formik.errors.email ? formik.errors.email : null}
        >
          <Input
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          validateStatus={formik.touched.password && formik.errors.password ? 'error' : ''}
          help={formik.touched.password && formik.errors.password ? formik.errors.password : null}
        >
          <Input.Password
            name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{ span: 24 }}
        >
          <Checkbox
            name="remember"
            onChange={formik.handleChange}
            checked={formik.values.remember}
          >
            Remember me
          </Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ span: 24 }}>
          <Button style={{ width: "100%" }} type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
