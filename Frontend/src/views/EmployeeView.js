import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress, Checkbox } from '@mui/material';
import useEmployeeController from '../controller/EmployeeController';
import { createTheme } from '@mui/material/styles';
import { blue, green, red } from '@mui/material/colors';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import TableBarIcon from '@mui/icons-material/TableBar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { format } from "date-fns";
// import io from 'socket.io-client';  // For real-time updates

/**
 * Displays the current time in a fixed header bar.
 * @param {Object} props - React props
 * @param {Date} props.currentTime - The current time to display
 */
const ClockBar = ({ currentTime }) => {
    return (
        <Box sx={{ background: "linear-gradient(to top, #0383E2, #5DADF0)", height: '56px', width: '100%', position:
                'fixed', top: 0, left: 0, zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h5" align="center" sx={{ color: 'white', textShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)' }}>
                    {currentTime.toLocaleTimeString()}
                </Typography>
                <Typography variant="subtitle1" align="center" sx={{ color: 'white', textShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', marginLeft: 1 }}>
                    {currentTime.toLocaleDateString()}
                </Typography>
            </Box>
        </Box>
    );
};

/**
 * The EmployeeView component manages the display and interactions for employee orders.
 */
const EmployeeView = () => {
    /**
     * State to manage the current time for the clock bar.
     */
    const [currentTime, setCurrentTime] = useState(new Date());

    /**
     * State to manage the visibility of the confirmation dialog.
     */
    const [dialogOpen, setDialogOpen] = useState(false);

    /**
     * State to manage the index of the order being acted upon.
     */
    const [actionIndex, setActionIndex] = useState(null);

    /**
     * State to manage the type of action being confirmed ('delete' or 'cancel').
     */
    const [actionType, setActionType] = useState(null);

    /**
     * State to manage the visibility of the progress spinner.
     */
    const [progressVisible, setProgressVisible] = useState(false);

    /**
     * State to manage the list of order boxes.
     */
    const { boxes, addOrder, deleteBox, toggleInProgress, cancelOrder, setBoxes } = useEmployeeController();

    /**
     * State to track if the user has interacted with the page.
     */
    const [userInteracted, setUserInteracted] = useState(false);

    /**
     * State to track previous orders.
     */
    const [prevOpenOrders, setPrevOpenOrders] = useState([]);

    /**
     * State to manage the checked items.
     */
    const [checkedItems, setCheckedItems] = useState({});

    /**
     * State to manage help requests.
     */
    const [helpRequests, setHelpRequests] = useState([]);

    /**
     * Navigation hook.
     */
    const navigate = useNavigate();

    /**
     * Effect to handle user interaction.
     */
    useEffect(() => {
        const handleUserInteraction = () => {
            setUserInteracted(true);
            window.removeEventListener('click', handleUserInteraction);
        };

        window.addEventListener('click', handleUserInteraction);

        return () => {
            window.removeEventListener('click', handleUserInteraction);
        };
    }, []);

    /**
     * Effect to update the current time every second.
     */
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    /**
     * Effect to fetch orders from the server every 20 seconds.
     * Includes notification logic to alert the user of new orders.
     */
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                if (Notification.permission !== 'granted') {
                    Notification.requestPermission();
                }
                const response = await axios.get('http://localhost:8080/api/orders');
                const openOrders = response.data
                    .filter(order => order.status === 'in_work' || order.status === 'open')
                    .map(order => ({
                            orderStatus: order.status,
                            tableNumber: order.tableId,
                            orderId: order.orderId,
                            orderTimeReal: new Date(order.datetime),
                            orderTime: `${format(new Date(order.datetime), 'HH:mm')} Uhr`,
                            orderDate: `${format(new Date(order.datetime), 'dd.MM.yyyy')}`,
                            text: order.orderDetails.map((detail, index) => ({
                                id: `${order.orderId}-${index}`,
                                content: `-(x${detail.quantity}) ${detail.productName} ${detail.productSize}`
                            }))
                    }))
                    .sort((a, b) => a.orderTimeReal - b.orderTimeReal);

                if (openOrders.length > prevOpenOrders.length && userInteracted) {
                    if (Notification.permission === 'granted') {
                        new Notification('New Order', { body: 'You have new orders' });
                    }
                }

                setPrevOpenOrders(openOrders);
                setBoxes(openOrders);
            } catch (error) {
                console.error('Error loading completed orders:', error);
            }
        };

        fetchOrders();
        const interval = setInterval(fetchOrders, 15000);

        return () => clearInterval(interval);
    }, [setBoxes, userInteracted, prevOpenOrders]);

    /**
     * Effect to fetch help requests from the server every 10 seconds.
     */
    useEffect(() => {
        const fetchHelpRequests = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/help-requests');
                const newHelpRequests = response.data.map(request => request.tableId);
                if (newHelpRequests.length > helpRequests.length) {
                    newHelpRequests.forEach(tableId => {
                        if (!helpRequests.includes(tableId)) {
                            if (Notification.permission === 'granted') {
                                new Notification('Help Request', { body: `Table ${tableId} needs help` });
                            }
                            setHelpRequests(prevRequests => [...prevRequests, tableId]);
                        }
                    });
                }
            } catch (error) {
                console.error('Error fetching help requests:', error);
            }
        };

        fetchHelpRequests();
        const interval = setInterval(fetchHelpRequests, 10000);

        return () => clearInterval(interval);
    }, [helpRequests]);

    /**
     * Effect to handle real-time updates using WebSocket (currently commented out).
     */
    /* ToDo: Benutzen von Websockets für bessere Benachrichtigung? Ebenfalls für Kellner rufen.
    useEffect(() => {
        const socket = io('http://localhost:8080');  // Verbindungsaufbau zum Server
        socket.on('newOrder', (order) => {
            setBoxes(prevBoxes => [...prevBoxes, {
                tableNumber: order.tableId,
                orderTime: order.datetime,
                text: order.orderDetails.map(detail => `-${detail.productName} (x${detail.quantity})`).join('<br/>')
            }]);
            // Benachrichtigung?
            if (Notification.permission === 'granted') {
                new Notification('New Order', { body: `New order from table ${order.tableId}` });
            }
        });

        // Check ob Berechtigung vorhanden, ansonsten Frage um Berechtigung falls nicht vorhanden
        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }

        return () => {
            socket.disconnect();
        };
    }, [setBoxes, userInteracted]);
    */

    /**
     * Opens the confirmation dialog.
     * @param {number} index - The index of the order being acted upon
     * @param {string} type - The type of action ('delete' or 'cancel')
     */
    const handleDialogOpen = (index, type) => {
        setActionIndex(index);
        setActionType(type);
        setDialogOpen(true);
    };

    /**
     * Closes the confirmation dialog.
     */
    const handleDialogClose = () => {
        setDialogOpen(false);
        setActionIndex(null);
        setActionType(null);
    };

    /**
     * Handles the action confirmed in the dialog (delete or cancel).
     */
    const handleAction = () => {
        if (actionIndex !== null && actionType !== null) {
            if (actionType === 'delete') {
                const orderId = boxes[actionIndex].orderId;
                deleteBox(orderId, actionIndex);
            } else if (actionType === 'cancel') {
                const orderId = boxes[actionIndex].orderId;
                cancelOrder(orderId, actionIndex);
            }
            setDialogOpen(false);
            setActionIndex(null);
            setActionType(null);
        }
    };

    const toggleProgressVisibility = (index) => {
        const orderId = boxes[index].orderId;
        const newStatus = boxes[index].orderStatus === 'open' ? 'in_work' : 'open';
        axios.patch(`http://localhost:8080/api/orders/${orderId}/status`, { status: newStatus })
            .then(response => {
                console.log('PATCH erfolgreich:', response.data);
                setBoxes(prevBoxes => prevBoxes.map((box, i) => i === index ? { ...box, orderStatus: newStatus } : box));
            })
            .catch(error => {
                console.error('Fehler beim PATCH:', error);
            });

    /**
     * Toggles the visibility of the progress spinner.
     */
    const toggleProgressVisibility = (index) => {
        const orderId = boxes[index].orderId;
        const newStatus = boxes[index].orderStatus === 'open' ? 'in_work' : 'open';
        axios.patch(`http://localhost:8080/api/orders/${orderId}/status`, { status: newStatus })
            .then(response => {
                console.log('PATCH erfolgreich:', response.data);
                setBoxes(prevBoxes => prevBoxes.map((box, i) => i === index ? { ...box, orderStatus: newStatus } : box));
            })
            .catch(error => {
                console.error('Fehler beim PATCH:', error);
            });

        setProgressVisible(!progressVisible);
    };

    const theme = createTheme({
        palette: {
            primary: {
                light: blue[300],
                main: blue[500],
                dark: blue[700],
                darker: blue[900],
            },
            green: {
                light: green[300],
                main: green[500],
            },
            red: {
                light: red[300],
                main: red[500],
            },
            grey: {
                dark: '#333333',
                hover: '#666666',
            },
        },
    });

    const handleCheckboxChange = (orderId, productId) => {
        setCheckedItems(prev => ({
            ...prev,
            [orderId]: {
                ...prev[orderId],
                [productId]: !prev[orderId]?.[productId]
            }
        }));
    };

    return (
        <div style={{ paddingBottom: '56px', minHeight: 'calc(100vh - 56px)', overflowY: 'auto' }}>
            <ClockBar currentTime={currentTime} />

            <Box style={{ marginTop: '56px' }}>
                <Grid container spacing={2} justifyContent="center">
                    {boxes.length === 0 ? (
                        <Typography variant="h6" align="center" sx={{ marginTop: '20px' }}>
                            No orders
                        </Typography>
                    ) : (
                        boxes.map((item, index) => (
                            <Grid item key={index}>
                                <Box key={item.orderStatus}
                                     sx={{
                                         bgcolor: item.orderStatus === 'in_work' ? 'lightgrey' : 'white',
                                         color: 'black',
                                         textAlign: 'center',
                                         padding: '10px',
                                         borderRadius: '8px',
                                         marginTop: '5px',
                                         wordWrap: 'break-word',
                                         display: 'flex',
                                         flexDirection: 'column',
                                         alignItems: 'center',
                                         maxWidth: '100%',
                                         boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.2)'
                                     }}>

                                    <Typography variant="h3" gutterBottom sx={{ color: theme.palette.primary.main,
                                        padding: '5px', borderRadius: '4px', textShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)' }}>
                                        <Box component="span" sx={{ fontSize: '3rem', display: 'inline-flex',
                                            position: 'relative', top: '8px', padding: '5px', borderRadius: '4px', }}>
                                            <TableBarIcon sx={{ fontSize: 'inherit', filter:
                                                    'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.2))' }} />
                                        </Box>
                                        {item.tableNumber}</Typography>

                                    <Typography sx={{ fontSize: '0.9rem', marginBottom: '8px', textShadow:
                                            '0px 2px 4px rgba(0, 0, 0, 0.2)' }}>{item.orderTime}</Typography>

                                    <Typography sx={{ fontSize: '0.7rem', marginBottom: '8px', textShadow:
                                        '0px 2px 4px rgba(0, 0, 0, 0.2)' }}>{item.orderDate}</Typography>

                                    {item.text.map((product) => (
                                        <Box key={product.id} sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Checkbox
                                                checked={checkedItems[item.orderId]?.[product.id] || false}
                                                onChange={() => handleCheckboxChange(item.orderId, product.id)}
                                            />
                                            <Typography
                                                sx={{
                                                    textDecoration: checkedItems[item.orderId]?.[product.id] ? 'line-through' : 'none',
                                                    textShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'
                                                }}
                                                dangerouslySetInnerHTML={{ __html: product.content }}
                                            />
                                        </Box>
                                    ))}

                                    <Box sx={{ marginTop: '20px' }}>
                                        <Button variant="contained" size="small" onClick={() => handleDialogOpen(index, 'delete')} sx={{
                                            color: theme.palette.green.main,
                                            bgcolor: item.orderStatus === 'in_work' ? 'lightgrey' : 'white',
                                            border: `2px solid ${theme.palette.green.main}`,
                                            '&:hover': { bgcolor: theme.palette.green.light }
                                        }}><CheckIcon /></Button>

                                        <Button variant="contained" size="small" onClick={() => toggleProgressVisibility(index)} sx={{
                                            marginLeft: '8px',
                                            marginRight: '8px',
                                            color: 'black',
                                            bgcolor: item.orderStatus === 'in_work' ? 'lightgrey' : 'white',
                                            border: '2px solid black',
                                            '&:hover': { bgcolor: 'lightgrey' }
                                        }}>{item.orderStatus === 'in_work' ? (
                                            <CircularProgress size={20} sx={{ color: 'black' }} />) : (<AccessTimeIcon />)}
                                        </Button>

                                    <Button variant="contained" size="small" onClick={() => handleDialogOpen(index,
                                        'cancel')} sx={{ color: theme.palette.red.main, bgcolor: item.inProgress ?
                                            'lightgrey' : 'white', border: `2px solid ${theme.palette.red.main}`,
                                        '&:hover': { bgcolor: theme.palette.red.light} }}><CloseIcon /></Button>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Button variant="contained" color="primary" onClick={() => navigate('/orders/completed')}>
                    Completed Orders
                </Button>
            </Box>

            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Confirmation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {actionType === 'delete' ? 'Are you sure this order is completed?' :
                            'Are you sure you want to cancel this order?'}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAction}>Yes</Button>
                    <Button onClick={handleDialogClose}>No</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default EmployeeView;
