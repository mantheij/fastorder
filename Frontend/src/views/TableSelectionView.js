import React from "react";
import {FormControl, InputLabel, Select, MenuItem, Button} from "@mui/material";
import {useTables} from "../model/TablesContext";

const TableSelectionView = () => {
    const { tables, selectedTable, setSelectedTable } = useTables();

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
            <h1 style={{ color: '#FFFFFF',fontSize:"5vh", }}>Select table</h1>
            <FormControl variant="outlined" sx={{
                width: '30vw',
                marginBottom: '10vh',
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: '#FFFFFF', // Weißer Rahmen
                    },
                    '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)', // Weißer Rahmen beim Hover mit etwas Transparenz
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#FFFFFF', // Weißer Rahmen, wenn fokussiert
                    },
                },
                '& .MuiInputLabel-root': {
                    color: '#FFFFFF', // Weißer Text für das Label
                    '&.Mui-focused': {
                        color: '#FFFFFF', // Weißer Text für das Label, auch wenn fokussiert
                    },
                    '&.MuiInputLabel-shrink': {
                        color: '#FFFFFF', // Weiß bleibt, selbst wenn das Select-Menü geöffnet ist
                    },
                },
                '& .MuiSelect-select': {
                    color: '#FFFFFF', // Weißer Text für den ausgewählten Wert
                    backgroundColor: 'rgba(255, 255, 255, 0)', // Vollständig transparenter Hintergrund
                },
                '& .MuiSvgIcon-root': {
                    color: '#FFFFFF', // Weißer Pfeil
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
                    {tables.map((table) => (
                        <MenuItem key={table.id} value={table.id}>{table.id}</MenuItem>
                    ))}
                </Select>
            </FormControl>
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