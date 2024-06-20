import { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';

const useTableOccupancy = (grids) => {
    const [updatedGrids, setUpdatedGrids] = useState(grids);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${config.apiBaseUrl}/api/orders`);
            const orders = response.data;

            const newGrids = { ...grids };

            orders.forEach(order => {
                const { tableId, status } = order;

                // Check if any order for this table is not 'paid'
                const tableOrders = orders.filter(o => o.tableId === tableId);
                const isOccupied = tableOrders.some(o => o.status !== 'paid');

                for (let area in newGrids) {
                    newGrids[area].forEach(row => {
                        row.forEach(item => {
                            if (item && item.tableId === tableId) {
                                item.occupied = isOccupied;
                            }
                        });
                    });
                }
            });

            setUpdatedGrids(newGrids);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 20000); // Update every 20 seconds

        return () => clearInterval(interval);
    }, [grids]);

    return updatedGrids;
};

export default useTableOccupancy;
