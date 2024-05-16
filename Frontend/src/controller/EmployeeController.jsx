import { useState } from 'react';
import axios from "axios";

const EmployeeController = () => {
    const [boxes, setBoxes] = useState([]);

    const addOrder = (orderTime, tableNumber, text) => {
        //Todo: red color depending on time
        //const timestamp = new Date().toLocaleTimeString();
        setBoxes(prevBoxes => [...prevBoxes, { tableNumber, text, orderTime }]);
    };


    //todo: set completed orders to closed and save them for "completed" view
    const deleteBox = (index) => {
        setBoxes(prevBoxes => prevBoxes.filter((_, i) => i !== index));
    };

    const toggleInProgress = index => {
        setBoxes(prevBoxes =>
            prevBoxes.map((box, i) =>
                i === index ? { ...box, inProgress: !box.inProgress } : box
            )
        );
    };


    //delete canceled orders from the system
    const cancelOrder = (orderId, index) => {
        axios.delete(`http://localhost:8080/api/orders/${orderId}`)
            .then(response => {
                console.log("Order deleted successfully");
                setBoxes(prevBoxes => prevBoxes.filter((_, i) => i !== index));
            })
            .catch(error => {
                console.error('Error deleting order:', error);
            });
    };

    return {
        boxes,
        setBoxes,
        addOrder,
        deleteBox,
        toggleInProgress,
        cancelOrder
    };
};

export default EmployeeController;
