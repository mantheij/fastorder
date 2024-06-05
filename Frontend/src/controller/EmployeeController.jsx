import { useState } from 'react';
import axios from "axios";

const EmployeeController = () => {
    const [boxes, setBoxes] = useState([]);

    const addOrder = (orderTime, tableNumber, text, orderId) => {
        setBoxes(prevBoxes => {
            const orderExists = prevBoxes.some(box => box.tableNumber === tableNumber && box.orderTime === orderTime && box.text === text);
            if (orderExists) {
                return prevBoxes;
            }
            return [...prevBoxes, { tableNumber, text, orderTime, orderId }];
        });
    };

    const deleteBox = (orderId, index) => {
        axios.patch(`http://localhost:8080/api/orders/${orderId}/status`, { status: 'completed' })
            .then(response => {
                console.log('PATCH erfolgreich:', response.data);
                setBoxes(prevBoxes => prevBoxes.filter((_, i) => i !== index));
            })
            .catch(error => {
                console.error('Fehler beim PATCH:', error);
            });
    };

    const toggleInProgress = index => {
        setBoxes(prevBoxes =>
            prevBoxes.map((box, i) =>
                i === index ? { ...box, inProgress: !box.inProgress } : box
            )
        );

        localStorage.setItem('boxes', JSON.stringify(boxes));
    };

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
