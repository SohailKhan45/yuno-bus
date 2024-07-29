/* eslint-disable react-hooks/exhaustive-deps */
import { message, Row, Col } from 'antd';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import Bus from '../components/Bus';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';
import axios from 'axios';

function Home() {
  const [filters, setFilters] = useState({});
  const dispatch = useDispatch();
  const [buses, setBuses] = useState([]);

  const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1).toLowerCase();

  const getBuses = async () => {
    const tempFilters = {};
    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          tempFilters[key] = filters[key];
        }
      });
    }
    try {
      dispatch(ShowLoading());
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/buses/get-all-buses`,
       { filters: tempFilters },
       {
        headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`,
        },
       }
       );
      dispatch(HideLoading());
      if (response.data.success) {
        setBuses(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };
  useEffect(() => {
    getBuses();
  }, []);

  return (
    <div>
      <div className='my-3 py-1'>
        <Row gutter={10} align='center'>
          <Col lg={6} sm={24}>
            <input type="text"
              placeholder="from"
              value={filters.from}
              onChange={(e) => setFilters({ ...filters, from: capitalize(e.target.value) })}
            />

          </Col>
          <Col lg={6} sm={24}>
            <input type="text"
              placeholder='To'
              value={filters.to}
              onChange={(e) => setFilters({ ...filters, to: capitalize(e.target.value) })}
            ></input>
          </Col>

          <Col lg={6} sm={24}>
            <input type="date"
              placeholder='Date'
              value={filters.journeyDate}
              onChange={(e) => setFilters({ ...filters, journeyDate: e.target.value })
              }
            >
            </input>
          </Col>
          <Col lg={6} sm={24}>
            <div className='d-flex gap-2'>
              <button className="primary-btn" onClick={() => getBuses()}>
                Filter
              </button>
              <button className="outlined px-3" onClick={() => setFilters({
                from: "",
                to: "",
                journeyDate: "",
              })}>
                Clear
              </button>
            </div>
          </Col>
        </Row>
      </div>
      <div>
        <Row gutter={[15, 15]}>

          {buses.filter((bus) => bus.status === "Yet To Start").map((bus) => (
            <Col key={bus._id} lg={12} xs={24} sm={24}>
              <Bus bus={bus} />
            </Col>
          ))}

        </Row>

      </div>
    </div>
  )
}

export default Home
