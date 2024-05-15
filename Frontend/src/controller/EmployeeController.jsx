import { useState } from 'react';

const useEmployeeController = () => {
    const [boxes, setBoxes] = useState([]);

    const addOrder = ( tableNumber, text) => {
        const timestamp = new Date().toLocaleTimeString();
        setBoxes(prevBoxes => [...prevBoxes, { tableNumber, text, timestamp }]);
    };

    const deleteBox = (status, index) => {
        status = 'done'
        setBoxes(prevBoxes => prevBoxes.filter((_, i) => i !== index));
    };

    const toggleInProgress = index => {
        setBoxes(prevBoxes =>
            prevBoxes.map((box, i) =>
                i === index ? { ...box, inProgress: !box.inProgress } : box
            )
        );
    };


    const cancelOrder = index => {
        setBoxes(prevBoxes => prevBoxes.filter((_, i) => i !== index));
    };

    return {
        boxes,
        addOrder,
        deleteBox,
        toggleInProgress,
        cancelOrder
    };
};

export default useEmployeeController;
