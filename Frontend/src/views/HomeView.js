// HomeView.js
import React, { useState } from "react";
import {Button, Container, Grid} from "@mui/material";
import Table from "../model/Table";


const HomeView = () => {
    const [selectedArea, setSelectedArea] = useState(1);


    const tables1 = [
        new Table(1, 1, true, 200, 125),
        new Table(2, 1, false, 200, 125),
        new Table(3, 1, false, 125, 200),
        { id: 'placeholder3-4', area: 1, placeholder: true },
        new Table(4, 1, true, 225, 125),
        new Table(5, 1, false, 125, 225),
        { id: 'placeholder5-6', area: 1, placeholder: true },
        new Table(6, 1, false, 325, 125),
        new Table(7, 1, false, 125, 200),
        new Table(8, 1, true, 200, 100),
        new Table(9, 1, true, 200, 100),
    ];

    const tables2 = [
        new Table(10, 2, false, 200, 125),
        new Table(11, 2, true, 200, 125),
        new Table(12, 2, false, 125, 200),
        { id: 'placeholder12-13/1', area: 2, placeholder: true },
        { id: 'placeholder12-13/2', area: 2, placeholder: true },
        new Table(13, 2, false, 125, 250),
        { id: 'placeholder13-14/1', area: 2, placeholder: true },
        { id: 'placeholder13-14/2', area: 2, placeholder: true },
        new Table(14, 2, true, 225, 125),
        new Table(15, 2, false, 125, 125),
        new Table(16, 2, false, 225, 125),
        new Table(17, 2, false, 200, 125),

    ];

    const handleAreaClick = (area) => {
        setSelectedArea(area);
    };


    return (
        <>

            {/* "Bereich 1" Button */}
            <Grid container spacing={2} justifyContent="space-between" sx={{marginBottom: 5}}>
                <Grid item xs={12} sm={6}>
                    <Button
                        variant ="contained"
                        color ="primary"
                        fullWidth
                        sx={{ height: 50, borderRadius: 0, fontSize: '150%',fontWeight: 'bold'}}
                        onClick={() => handleAreaClick(1)}
                    >
                        Bereich 1
                    </Button>
                </Grid>

                {/* "Bereich 2" Button */}
                <Grid item xs={12} sm={6}>
                    <Button
                        variant ="contained"
                        color ="success"
                        fullWidth
                        sx={{ height: 50, borderRadius: 0, fontSize: '150%', fontWeight: 'bold'}}
                        onClick={() => handleAreaClick(2)}
                    >
                        Bereich 2
                    </Button>
                </Grid>
            </Grid>

            <Container>
            {/* Tables  */}
            <Grid container spacing={0}>
                {(selectedArea === 1 ? tables1 : tables2).map((table) =>  (
                    table.placeholder ?

                        <Grid item xs={4} key={table.id}></Grid> : // Rendering an empty item

                        <Grid item xs={4} key={table.id} sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: 5}}>

                            <Button
                                variant="contained"
                                sx={{
                                    width: table.width,
                                    height: table.height,
                                    bgcolor: table.getColor(),
                                    color: table.occupied ? 'white' : 'black',
                                    fontSize: '2rem',
                                    '&:hover': {
                                        bgcolor: table.getColor(),
                                    },
                                }}
                            >
                                {table.id}
                            </Button>
                        </Grid>
                ))}
            </Grid>
            </Container>
        </>
    );
};

export default HomeView;
