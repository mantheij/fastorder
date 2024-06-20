import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import config from '../config'; // Pfad zu deiner Konfigurationsdatei überprüfen

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
     * State holding the array of tables. Each table includes properties like ID, area, occupancy status, and dimensions.
     */
    const [tables, setTables] = useState([]);

    /**
     * State to keep track of the currently selected table.
     */
    const [selectedTable, setSelectedTable] = useState('');

    /**
     * Fetch tables data from the backend and update the state.
     */
    useEffect(() => {
        const fetchTables = async () => {
            try {
                const response = await axios.get(`${config.apiBaseUrl}/api/tables`);
                const tablesData = response.data;
                console.log("Loaded tables:", tablesData); // Logging the loaded tables
                setTables(tablesData);
            } catch (error) {
                console.error('Error fetching tables:', error);
            }
        };

        fetchTables();
    }, []);

    const getTableById = (id) => {
        return tables.find(table => table.tableId === id) || null;
    };

    /**
     * Defines the layout of tables in area 1, structured as an array of rows.
     * Each row is an array that may include table objects.
     */
    const area1Grid = [
        [getTableById(1), getTableById(2), getTableById(3)],
        [getTableById(18), getTableById(4), getTableById(5)],
        [getTableById(18), getTableById(6)],
        [getTableById(7), getTableById(8), getTableById(9)]
    ];

    /**
     * Defines the layout of tables in area 2, similar to area 1 but with its own specific table arrangements.
     */
    const area2Grid = [
        [getTableById(10), getTableById(11), getTableById(12)],
        [getTableById(18), getTableById(18), getTableById(13)],
        [getTableById(18), getTableById(18), getTableById(14)],
        [getTableById(15), getTableById(16), getTableById(17)]
    ];

    const grids = {1: area1Grid, 2: area2Grid};

    return (
        <TablesContext.Provider value={{ tables, selectedTable, setSelectedTable, grids }}>
            {children}
        </TablesContext.Provider>
    );
};
