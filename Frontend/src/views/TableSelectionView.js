import React from "react";
import {FormControl, InputLabel, Select, MenuItem, Button} from "@mui/material";
import {useTables} from "../model/TablesContext";

/**
 * The TableSelectionView component provides a user interface for selecting a table.
 * It utilizes context to fetch table data and allows the user to pick from available tables.
 * This selection updates the context's selectedTable state.
 */
const TableSelectionView = () => {

    /**
     * Destructures tables, selectedTable, and setSelectedTable from the context provided by useTables hook.
     * - tables: Array of table data
     * - selectedTable: ID of the currently selected table
     * - setSelectedTable: Function to update the selected table
     */
    const { tables, selectedTable, setSelectedTable } = useTables();

    /**
     * Handles changes to the table selection from the dropdown menu.
     * Updates the selectedTable state with the new table ID.
     * @param {React.ChangeEvent<HTMLSelectElement>} event - The event triggered on selecting a table.
     */
    const handleSelectTable = (event) => {
        setSelectedTable(event.target.value);
    };

    return (
        <div style={{
            padding: 0,
            margin: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: "linear-gradient(to top, #0383E2, #5DADF0)"
        }}>
            {/* Title of the view */}
            <h1 style={{ color: '#FFFFFF',fontSize:"5vh", }}>Select table</h1>

            {/* Form control for table selection */}
            <FormControl variant="outlined" sx={{
                width: '30vw',
                marginBottom: '10vh',
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: '#FFFFFF', // White border
                    },
                    '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)', // White border with transparency on hover
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#FFFFFF', // White border when focused
                    },
                },
                '& .MuiInputLabel-root': {
                    color: '#FFFFFF', // White text for the label
                    '&.Mui-focused': {
                        color: '#FFFFFF', // White text when label is focused
                    },
                    '&.MuiInputLabel-shrink': {
                        color: '#FFFFFF', // White text remains even when the Select menu is open
                    },
                },
                '& .MuiSelect-select': {
                    color: '#FFFFFF', // White text for the selected item
                    backgroundColor: 'rgba(255, 255, 255, 0)', // Fully transparent background
                },
                '& .MuiSvgIcon-root': {
                    color: '#FFFFFF', // White icon for the dropdown arrow
                }
            }}>
                <InputLabel id="table-select-label">Table...</InputLabel>
                <Select
                    labelId="table-select-label"
                    id="table-select"
                    value={selectedTable}
                    onChange={handleSelectTable}
                    label="Tisch..."
                >
                    {/* Map each table to a MenuItem for selection */}
                    {tables.map((table) => (
                        <MenuItem key={table.id} value={table.id}>{table.id}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            {/* Confirmation button */}
            <Button
                variant="contained"
                href="/customerStart"
                sx={{
                    backgroundColor: '#FFFFFF', // Setzt die Hintergrundfarbe auf Weiß
                    color: '#5DADF0',           // Setzt die Textfarbe auf Blau
                    fontSize: '2.0vh',         // Größere Schriftgröße
                    padding: '10px 20px',       // Größere Padding-Werte für größere Button-Größe
                    '&:hover': {               // Stile für den Hover-Zustand
                        backgroundColor: '#e0f0ff', // Leichtes Blau beim Hover
                        boxShadow: '0 3px 5px 2px rgba(0, 0, 0, 0.2)' // Leichter Schatten für den Hover-Effekt
                    }
                }}
            >
                confirm
            </Button>
        </div>
    );
};

export default TableSelectionView;