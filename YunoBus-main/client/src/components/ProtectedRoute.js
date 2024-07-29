/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { SetUser } from '../redux/usersSlice';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';
import DefaultLayout from './DefaultLayout';
function ProtectedRoute({children}) {
    const dispatch = useDispatch();
    //const [loading, setLoading] = useState(true);
    //const {loading} =useSelector((state)=>state.alerts);
    const {user} = useSelector(state => state.users);
    const navigate = useNavigate();
    const validateToken = async ()=>{
        try{
            dispatch(ShowLoading());
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/get-user-by-id`,{userId: user?._id},{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            dispatch(HideLoading());
            if(response.data.success){
                
                dispatch(SetUser(response.data.data));
            }else{
                //setLoading(false);
               
                localStorage.removeItem("token");
                message.error(response.data.message);
                navigate('/login');
            }
        }catch(error){
            dispatch(HideLoading());
            localStorage.removeItem("token");
            
            message.error(error.message);
            //setLoading(false);
            navigate('/login');
        }

    };
    useEffect(()=>{
        if(localStorage.getItem('token')){
            validateToken();
        }else{
            navigate('/login');
        }
    },[]);
  return (
    <div>
      {user &&  <DefaultLayout>{children}</DefaultLayout>} 
      
    </div>
  )
}

export default ProtectedRoute;
