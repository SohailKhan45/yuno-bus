import React from 'react'
import {Form} from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios";
import {message} from "antd";
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';
import'../resources/auth.css'
function Register() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const onFinish = async(values)=>{
        try{
          dispatch(ShowLoading());
          const response= await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/register`, values);
          dispatch(HideLoading());
          if(response.data.success){
            message.success(response.data.message);
            navigate("/login");  // navigate the user to login page after registration.
          }else{
            message.error(response.data.message);
          }
        }catch(error){
          dispatch(HideLoading());
          message.error(error.message);
        }
    };
  return (
    <div className='h-screen d-flex justify-content-center align-items-center bg-blur'>
      <div className='w-400 card p-3'>
        <h1 className='text-lg'>YunoBus: Register</h1>
        <hr></hr>
      <Form layout ='vertical' onFinish={onFinish}>   
        <Form.Item label='Name' name='name'>  
            <input type="text" required />
        </Form.Item>
        <Form.Item label='Email' name='email'>
            <input type="email" required />
        </Form.Item>
        <Form.Item label='Password' name='password'>
            <input type="password" required />
        </Form.Item>
        <div className="d-flex justify-content-between align-items-center my-3">
        <Link to="/login">Click here to Login</Link>
        <button className='secondary-btn'type="submit">Register</button>
        </div>
      </Form>

      
      </div>
    </div>
  ); // form from antd
}

export default Register