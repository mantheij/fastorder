import React, { useState} from "react";
import {Button, Grid} from "@mui/material";
import {useTables} from "../model/TablesContext";

/**
 * The HomeView component is responsible for displaying area selection options and the corresponding grids of tables.
 * Users can select an area, and the UI updates to show tables in that area using Material-UI components.
 */
const HomeView = () => {
    /**
     * State to manage the currently selected area, initialized to area 1.
     */
    const [selectedArea, setSelectedArea] = useState(1);

    /**
     * Retrieves the grids data from the useTables context hook, which manages the state of tables and areas.
     */
    const { grids } = useTables();

    /**
     * Handles click events on area selection buttons, updating the selectedArea state.
     * @param {number} area - The area number that was clicked.
     */
    const handleAreaClick = (area) => {
        setSelectedArea(area);
    };


    return (
        <>

            {/* Grid container for area selection buttons */}
            <Grid container spacing={0.5} justifyContent="space-between" sx={{marginBottom: 5}}>

                {/* Button for selecting Area 1 */}
                <Grid item xs={6} sm={6}>
                    <Button
                        variant ="contained"
                        color ="primary"
                        fullWidth
                        sx={{ height: "5vh", borderRadius: 0, fontSize: '2.5vh',fontWeight: 'bold', boxShadow: '0 3px 5px 2px rgba(0, 0, 0, 0.3)'}}
                        onClick={() => handleAreaClick(1)}
                    >
                        Area 1
                    </Button>
                </Grid>


                {/* Button for selecting Area 2 */}
                <Grid item xs={6} sm={6}>
                    <Button
                        variant ="contained"
                        color ="success"
                        fullWidth
                        sx={{ height: "5vh", borderRadius: 0, fontSize: '2.5vh', fontWeight: 'bold', boxShadow: '0 3px 5px 2px rgba(0, 0, 0, 0.3)'}}
                        onClick={() => handleAreaClick(2)}
                    >
                        Area 2
                    </Button>
                </Grid>
            </Grid>


            {/* Main grid container for displaying grids based on the selected area */}
                <Grid container spacing={"4vh"} alignItems="center" justifyContent="flex-start">
                    {grids[selectedArea].map((row, rowIndex) => (
                        <Grid item xs={12} key={rowIndex}>
                            <Grid container justifyContent="flex-start" spacing={2}>
                                {row.map((item, itemIndex) => (
                                    <Grid item key={itemIndex} xs={4} sx={{  justifyContent: 'center', alignItems: 'center' }}>
                                        {item.placeholder ? (
                                            // Placeholder for visual alignment
                                            <div style={{ height: item.height, visibility: 'hidden' }}>Platzhalter</div>
                                        ) : (
                                            // Button for each item, colored based on occupation status
                                            <Button
                                                href="/customerStart"
                                                sx={{
                                                    width: item.width,
                                                    height: item.height,
                                                    backgroundColor: item.occupied ? "#EA6E6E" : "#DCEDFB",
                                                    color: item.occupied ? 'white' : 'black',
                                                    fontSize:"2.5vh",
                                                    boxShadow: '0 4px 6px 2px rgba(0, 0, 0, 0.25)',
                                                    '&:hover': {
                                                        backgroundColor: item.occupied ? "#EA6E6E" : "#DCEDFB",
                                                        boxShadow: '0 4px 6px 2px rgba(0, 0, 0, 0.25)'
                                                    }
                                                }}
                                            >
                                                {`${item.id}`}
                                            </Button>
                                        )}
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    ))}
                </Grid>


        </>
    );
};

export default HomeView;
