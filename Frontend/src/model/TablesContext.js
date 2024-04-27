// src/contexts/TablesContext.js
import React, { createContext, useState, useContext } from 'react';
import Table from '../model/Table'; // Pfad überprüfen


const TablesContext = createContext();


export const useTables = () => useContext(TablesContext);

export const TablesProvider = ({ children }) => {


    const [tables] = useState([
        new Table(1, 1, true, 200, 125),
        new Table(2, 1, false, 200, 125),
        new Table(3, 1, false, 125, 200),
        //{ id: 'placeholder3-4', area: 1, placeholder: true },
        new Table(4, 1, true, 225, 125),
        new Table(5, 1, false, 125, 225),
        //{ id: 'placeholder5-6', area: 1, placeholder: true },
        new Table(6, 1, false, 325, 125),
        new Table(7, 1, false, 125, 200),
        new Table(8, 1, true, 200, 100),
        new Table(9, 1, true, 200, 100),

        new Table(10, 2, false, 200, 125),
        new Table(11, 2, true, 200, 125),
        new Table(12, 2, false, 125, 200),
        //{ id: 'placeholder12-13/1', area: 2, placeholder: true },
        //{ id: 'placeholder12-13/2', area: 2, placeholder: true },
        new Table(13, 2, false, 125, 250),
        //{ id: 'placeholder13-14/1', area: 2, placeholder: true },
        //{ id: 'placeholder13-14/2', area: 2, placeholder: true },
        new Table(14, 2, true, 225, 125),
        new Table(15, 2, false, 125, 125),
        new Table(16, 2, false, 225, 125),
        new Table(17, 2, false, 200, 125),
    ]);

    const area1Grid = [
        [   new Table(1, 1, true, 200, 125),
            new Table(2, 1, false, 200, 125),
            new Table(3, 1, false, 150, 225),
        ],

        [   { id: 'placeholder', area: 1, placeholder: true },
            new Table(4, 1, true, 225, 125),
            new Table(5, 1, false, 150, 225),
        ],

        [
            { id: 'placeholder', area: 1, placeholder: true },

            new Table(6, 1, false, 440, 125),
        ],

        [
            new Table(7, 1, false, 125, 125),
            new Table(8, 1, true, 200, 125),
            new Table(9, 1, true, 150, 125),
        ]
    ];

    const area2Grid = [
        [
            new Table(10, 2, false, 200, 125),
            new Table(11, 2, true, 200, 125),
            new Table(12, 2, false, 125, 200),
        ],

        [
            { id: 'placeholder', area: 2, placeholder: true },
            { id: 'placeholder', area: 2, placeholder: true },
            new Table(13, 2, false, 125, 250),
        ],

        [
            { id: 'placeholder', area: 2, placeholder: true },
            { id: 'placeholder', area: 2, placeholder: true },
            new Table(14, 2, true, 225, 125),
        ],

        [
            new Table(15, 2, false, 125, 125),
            new Table(16, 2, false, 225, 125),
            new Table(17, 2, false, 200, 125),
        ],
    ];

    const [grids] = useState({1: area1Grid, 2: area2Grid});





    const [selectedTable, setSelectedTable] = useState('');

    return (
        <TablesContext.Provider value={{ tables,selectedTable, setSelectedTable, grids}}>
            {children}
        </TablesContext.Provider>
    );
};
