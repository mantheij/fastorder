import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, Button } from '@mui/material';
import useEmployeeController from '../Controller/EmployeeController';

const EmployeeView = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const { boxes, addOrder } = useEmployeeController();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ paddingBottom: '56px', minHeight: 'calc(100vh - 56px)', overflowY: 'auto' }}>
            <Typography variant="h5" align="center" gutterBottom>
                {currentTime.toLocaleTimeString()}
            </Typography>
            <Typography>
                <Button onClick={() => addOrder(5, "-Cola (250ml) x3  . . . . . . . . -Fanta (250ml) x1 . . . . . . . ")}>Add Order</Button>
            </Typography>

            <Grid container spacing={2} justifyContent="center">
                {boxes.map((item, index) => (
                    <Grid item key={index}>
                        <Box
                            sx={{
                                width: 200,
                                bgcolor: 'primary.main',
                                color: 'white',
                                textAlign: 'center',
                                padding: '10px',
                                wordWrap: 'break-word', // Wrap long text
                            }}
                        >
                            <Typography variant="h6" gutterBottom>{item.tableNumber}</Typography> {/* Table number as heading */}
                            <Typography>{item.text}</Typography>
                            <Typography>{item.timestamp}</Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default EmployeeView;
