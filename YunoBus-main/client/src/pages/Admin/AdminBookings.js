import { message, Modal, Table } from 'antd';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import PageTitle from '../../components/PageTitle'
import { axiosInstance } from '../../helpers/axiosInstance';
import { HideLoading, ShowLoading } from '../../redux/alertsSlice';
import moment from 'moment';
import {useReactToPrint} from 'react-to-print';

function AdminBookings() {
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [bookings, setBookings] = useState([]);
    const dispatch = useDispatch();
  

    const getBookings = async() =>{
        try{
          dispatch(ShowLoading());
          const response = await axiosInstance.post(`${process.env.REACT_APP_BACKEND_URL}/api/bookings/get-all-bookings`, {});
          dispatch(HideLoading());
          if(response.data.success){
            const mappedData = response.data.data.map((booking) =>{
                return{
                    ...booking,
                    ...booking.bus,
                    ...booking.user,
                    key: booking._id,
                };
            });

            setBookings(mappedData);
          }else{
            message.error(response.data.message);
          }
        } catch(error){
          dispatch(HideLoading());
          message.error(error.message);
        }
    };
  
    const cancelBooking = async (record) => {
      try {
          dispatch(ShowLoading());
          const bookingId = record.key; 
          const response = await axiosInstance.delete(`${process.env.REACT_APP_BACKEND_URL}/api/bookings/cancel-booking`, {
              data: { id: bookingId },
          });
          dispatch(HideLoading());
          if (response.data.success) {
              message.success(response.data.message);
              getBookings(); 
          } else {
              message.error(response.data.message);
          }
      } catch (error) {
          dispatch(HideLoading());
          message.error(error.message);
      }
  };

    const columns = [
        
        {
            title: "User Name",
            dataIndex: "name",
            key:"user",
        },
        {
            title: "Bus Number",
            dataIndex: "number",
            key:"bus",
        },
        {
            title: "Journey Date",
            dataIndex: "journeyDate",
            render: (journeyDate) => moment(journeyDate).format("DD-MM-YYYY"),
        },
        {
            title: "Journey Time",
            dataIndex: "departure",
        },
        {
            title: "Seats",
            dataIndex: "seats",
            render:(seats) => {
              return seats.join(",");
            },
        },
        {
          title: "Action",
          dataIndex: "action",
          render: (text, record) => (
              <div>
                  <p className='text-md underline' style={{color: "blue"}}
                      onClick={() => {
                          setSelectedBooking(record);
                          setShowPrintModal(true);
                      }}
                  >
                      Print Ticket
                  </p>
                  <p className='text-md underline' style={{color: "red"}}
                      onClick={() => cancelBooking(record)}
                  >
                      Cancel Booking
                </p>
              </div>
          ),
      },

    ];



    useEffect(()=>{
        getBookings();
      }, []);

      const componentRef = useRef();
      const handlePrint = useReactToPrint({
        content: () => componentRef.current,
      })
  return (
    <div style={{overflowX: "auto"}}>
      <PageTitle title="AdminBookings" />
      <div className="mt-2">
        <Table dataSource={bookings} columns={columns} />
      </div>
      {showPrintModal && (
        <Modal
          title="Print Ticket"
          onCancel={() => {
            setShowPrintModal(false);
            setSelectedBooking(null);
          }}
          visible={showPrintModal}
          okText="Print"
          onOk={handlePrint}
        >
          <h3>Yuno Bus</h3>
          <div className="d-flex flex-column p-5" ref={componentRef}>
            <p>Bus: {selectedBooking?.bus?.name}</p>
            <p>
              {selectedBooking.from}-{selectedBooking.to}
            </p>
            <hr />
            <p>
              <span>Journey date:</span>{" "}
              {moment(selectedBooking.journeyDate).format("DD-MM-YYYY")}
            </p>
            <p>
              <span>Journey Time:</span> {selectedBooking.departure}
            </p>
            <hr />
            <p>
              <span>Seat numbers:</span> <br />
              {selectedBooking.seats.join(", ")}
            </p>
            <hr />
            <p>
              <span>Total Amount:</span>{" "}
              {selectedBooking.fare * selectedBooking.seats.length}$
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default AdminBookings
