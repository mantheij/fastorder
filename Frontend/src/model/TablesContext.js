import React, { createContext, useState, useContext } from 'react';
import Table from '../model/Table'; // Pfad überprüfen

/** Helper class to properly visualize the tables in the selection list and on the grid layout
 *
 * @type {React.Context<unknown>}
 */
const TablesContext = createContext();

/**
 * Custom hook to utilize the TablesContext.
 * Provides easy access to context values within functional components.
 *
 * @returns {*} Context values including tables, selectedTable, and functions to manipulate these values.
 */
export const useTables = () => useContext(TablesContext);

/**
 * Provider component that wraps its children with TablesContext.Provider.
 * This allows nested components to access the context's values such as tables, selected table, and grid layouts.
 *
 * @param {{ children: React.ReactNode }} props - Component's children elements to be wrapped by the context provider.
 * @returns {JSX.Element} The provider wrapped children components.
 */
export const TablesProvider = ({ children }) => {

    /**
     * State holding the array of tables. Each table is an instance of the Table class,
     * which includes properties like ID, area, occupancy status, and dimensions.
     * For the selection list
     */
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

    /**
     * Defines the layout of tables in area 1, structured as an array of rows.
     * Each row is an array that may include table objects or placeholders for layout consistency.
     */
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

    /**
     * Defines the layout of tables in area 2, similar to area 1 but with its own specific table arrangements.
     */
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


    /**
     * State to keep track of the currently selected table.
     */
    const [selectedTable, setSelectedTable] = useState('');

    return (
        <TablesContext.Provider value={{ tables,selectedTable, setSelectedTable, grids}}>
            {children}
        </TablesContext.Provider>
    );
};
