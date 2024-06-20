import axios from "axios";
import config from "../../config";

export const updateOrdersToPaid = async (tableId, navigate) => {
    try {
        const response = await axios.get(`${config.apiBaseUrl}/api/orders`);
        const completedOrders = response.data.filter(order => order.status === 'completed' && order.tableId === parseInt(tableId));
        const updatePromises = completedOrders.map(order =>
            axios.patch(`${config.apiBaseUrl}/api/orders/${order.orderId}/status`, { status: 'paid' })
        );
        await Promise.all(updatePromises);
        navigate('/chef');
    } catch (error) {
        console.error('Error updating orders:', error);
    }
};
