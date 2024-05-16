import React from "react";
import {FormControl, InputLabel, Select, MenuItem, Button} from "@mui/material";
import {useTables} from "../model/TablesContext";
import {useNavigate} from "react-router-dom"; // Importieren Sie useNavigate

const TableSelectionView = () => {
    const { tables, selectedTable, setSelectedTable } = useTables();
    const navigate = useNavigate(); // Erstellen Sie eine Instanz von navigate

    const handleSelectTable = (event) => {
        setSelectedTable(event.target.value);
    };

    // Funktion zur Navigation, wenn ein Tisch ausgewählt und bestätigt wird
    const handleConfirmTableSelection = () => {
        if (selectedTable) {
            navigate(`/customerStart/${selectedTable}`); // Navigieren zur customerStart mit der ausgewählten tableId
        } else {
            alert("Please select a table first."); // Einfache Fehlerbehandlung, wenn keine Tisch ausgewählt wurde
        }
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
            <h1 style={{ color: '#FFFFFF', fontSize: "5vh" }}>Select table</h1>
            <FormControl variant="outlined" sx={{
                width: '30vw',
                marginBottom: '10vh',
                '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#FFFFFF' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#FFFFFF' },
                },
                '& .MuiInputLabel-root': {
                    color: '#FFFFFF',
                    '&.Mui-focused': { color: '#FFFFFF' },
                    '&.MuiInputLabel-shrink': { color: '#FFFFFF' },
                },
                '& .MuiSelect-select': {
                    color: '#FFFFFF',
                    backgroundColor: 'rgba(255, 255, 255, 0)',
                },
                '& .MuiSvgIcon-root': { color: '#FFFFFF' }
            }}>
                <InputLabel id="table-select-label">Table...</InputLabel>
                <Select
                    labelId="table-select-label"
                    id="table-select"
                    value={selectedTable}
                    onChange={handleSelectTable}
                    label="Tisch..."
                >
                    {tables.map((table) => (
                        <MenuItem key={table.id} value={table.id}>{table.id}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button
                variant="contained"
                onClick={handleConfirmTableSelection} // Aktualisieren Sie das onClick-Event
                sx={{
                    backgroundColor: '#FFFFFF',
                    color: '#5DADF0',
                    fontSize: '2.0vh',
                    padding: '10px 20px',
                    '&:hover': {
                        backgroundColor: '#e0f0ff',
                        boxShadow: '0 3px 5px 2px rgba(0, 0, 0, 0.2)'
                    }
                }}
            >
                confirm
            </Button>
        </div>
    );
};

export default TableSelectionView;
