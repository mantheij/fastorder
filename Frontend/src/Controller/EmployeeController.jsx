import { useState } from 'react';

const useEmployeeController = () => {
    const [boxes, setBoxes] = useState([]);

    const addOrder = (tableNumber, text) => {
        const timestamp = new Date().toLocaleTimeString();
        setBoxes(prevBoxes => [...prevBoxes, { tableNumber, text, timestamp }]);
    };

    return {
        boxes,
        addOrder
    };
};

export default useEmployeeController;
