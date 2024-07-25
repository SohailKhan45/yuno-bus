import { Row, Col, message } from 'antd';
import React from 'react'
import '../resources/bus.css';

function SeatSelection({ selectedSeats, setSelectedSeats, bus }) {
    const capacity = bus.capacity;
    const selectOrUnselectSeats = (seatNumber) => {
        if (selectedSeats.includes(seatNumber)) {
            setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
        } else {
            selectedSeats.length < 6 ? 
                setSelectedSeats([...selectedSeats, seatNumber]) : 
                message.warning('Can select only 6 seats at a time')
        }
    };


    return (

        <div className='mx-5'>
            <div className='bus-container' >
                <Row gutter={[10, 10]}>
                    {Array.from(Array(capacity).keys()).map((seat) => {
                        let seatClass = ''
                        if (selectedSeats.includes(seat + 1)) {
                            seatClass = 'selected-seat'
                        }  else if (bus.seatsBooked.includes(seat+1)){
                            seatClass = 'booked-seat'
                        }
                            return (
                                <Col key={seat + 1} span={6}>
                                    <div className={`seat ${seatClass}`} onClick={() => selectOrUnselectSeats(seat + 1)}>{seat + 1}</div>
                                </Col>
                            );
                        
                    })}
                </Row>

            </div>
        </div>
    );
}

export default SeatSelection
