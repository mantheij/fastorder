// src/views/HomeView.js

import React, { useState, useEffect } from "react";
import { Tabs, Tab, Grid, Button, Box } from "@mui/material";
import { useTables } from "../../model/TablesContext";
import { useNavigate } from "react-router-dom";
import useTableOccupancy from "../../model/useTableOccupancy";

const HomeView = () => {
    const [selectedArea, setSelectedArea] = useState(1);
    const { grids } = useTables();
    const updatedGrids = useTableOccupancy(grids);
    const navigate = useNavigate();

    const handleTabChange = (event, newValue) => {
        setSelectedArea(newValue);
    };

    const handleTableClick = (tableId) => {
        navigate(`tableDetails/${tableId}`);
    };

    const getBackgroundColor = () => {
        return selectedArea === 1 ? '#f0f4f8' : '#E0F2F1';
    };

    const getTableColor = (occupied) => {
        return occupied ? (selectedArea === 1 ? "#ff4a4a" : "#ff4a4a") : (selectedArea === 1 ? "#d6edff" : "#DCEDC8");
    };

    return (
        <Box sx={{ width: '100vw', height: '100vh', backgroundColor: getBackgroundColor(), overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Tabs
                value={selectedArea}
                onChange={handleTabChange}
                variant="fullWidth"
                centered
                sx={{ marginBottom: 0 }}
                TabIndicatorProps={{
                    style: {
                        backgroundColor: selectedArea == 1 ? '#aadef8' : '#b5f6b7',
                        height: '5px'
                    }
                }}
            >
                <Tab
                    label="Area 1"
                    value={1}
                    sx={{
                        fontSize: '2.5vh',
                        fontWeight: 'bold',
                        backgroundColor: selectedArea === 1 ? 'rgba(2, 136, 209, 0.2)' : 'transparent',
                        color: selectedArea === 1 ? '#FFFFFF' : '#0288D1',
                        '&.Mui-selected': {
                            color: '#FFFFFF',
                            backgroundColor: '#20a9fa'
                        }
                    }}
                />
                <Tab
                    label="Area 2"
                    value={2}
                    sx={{
                        fontSize: '2.5vh',
                        fontWeight: 'bold',
                        backgroundColor: selectedArea === 2 ? 'rgba(56, 142, 60, 0.2)' : 'transparent',
                        color: selectedArea === 2 ? '#FFFFFF' : '#388E3C',
                        '&.Mui-selected': {
                            color: '#FFFFFF',
                            backgroundColor: '#3fc143'
                        }
                    }}
                />
            </Tabs>

            <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{ flexGrow: 1, overflow: 'auto', paddingTop: '1vh', paddingBottom: '10vh' }}>
                {updatedGrids[selectedArea]?.map((row, rowIndex) => (
                    <Grid item xs={12} key={rowIndex}>
                        <Grid container justifyContent="center" spacing={2}>
                            {row.map((item, itemIndex) => (
                                item && (
                                    <Grid item key={itemIndex} xs={4} sx={{ justifyContent: 'center', alignItems: 'center' }}>
                                        {item.tableId !== 18 ? (
                                            <Button
                                                onClick={() => handleTableClick(item.tableId)}
                                                sx={{
                                                    width: `${item.width / 768 * 100}vw`,
                                                    height: `${item.height / 1024 * 100}vh`,
                                                    backgroundColor: getTableColor(item.occupied),
                                                    color: item.occupied ? 'white' : 'black',
                                                    fontSize: "3vh",
                                                    boxShadow: '0 4px 6px 2px rgba(0, 0, 0, 0.25)',
                                                    '&:hover': {
                                                        backgroundColor: getTableColor(item.occupied),
                                                        boxShadow: '0 4px 6px 2px rgba(0, 0, 0, 0.25)'
                                                    }
                                                }}
                                            >
                                                {`${item.name}`}
                                            </Button>
                                        ) : (
                                            <div
                                                style={{
                                                    width: `${item.width / 768 * 100}vw`,
                                                    height: `${item.height / 1024 * 100}vh`,
                                                    visibility: 'hidden'
                                                }}
                                            />
                                        )}
                                    </Grid>
                                )
                            ))}
                        </Grid>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default HomeView;
