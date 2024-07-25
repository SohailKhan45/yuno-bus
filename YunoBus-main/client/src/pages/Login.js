import React from 'react';
import { Form } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';
import '../resources/auth.css';
import { SetUser } from '../redux/usersSlice';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/login`, values);
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        dispatch(SetUser(response.data.user))
        localStorage.setItem('token', response.data.data);
        navigate('/', { replace: true }); // Navigate to homepage
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.log('error', error)
      message.error(error.message);
    }
  };

  return (
    <div className='h-screen d-flex justify-content-center align-items-center bg-blur'>
      <div className='w-400 card p-3'>
        <h1 className='text-lg'>YunoBus: Login</h1>
        <hr />
        <Form layout='vertical' onFinish={onFinish}>
          <Form.Item label='Email' name='email'>
            <input type="email" required />
          </Form.Item>
          <Form.Item label='Password' name='password'>
            <input type="password" required />
          </Form.Item>
          <div className="d-flex justify-content-between align-items-center my-3">
            <Link to="/register">Click here to Register</Link>
            <button className='secondary-btn' type="submit">Login</button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Login;