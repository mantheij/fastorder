import React from "react";
import { FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material";
import { useTables } from "../../model/TablesContext";
import { useNavigate } from "react-router-dom";

const TableSelectionView = () => {
    const { tables, selectedTable, setSelectedTable } = useTables();
    const navigate = useNavigate();

    const handleSelectTable = (event) => {
        setSelectedTable(event.target.value);
    };

    const handleConfirmTableSelection = () => {
        if (selectedTable) {
            navigate(`/customerStart/${selectedTable}`);
        } else {
            alert("Please select a table first.");
        }
    };

    // Sort tables by tableId
    const sortedTables = tables.filter(table => table.tableId !== 18).sort((a, b) => a.tableId - b.tableId);

    return (
        <div style={{
            padding: 0,
            margin: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: "linear-gradient(to top, #0383E2, #5DADF0)",
            position: 'relative'
        }}>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '92%',
                backgroundImage: "url('/background2.png')",
                backgroundRepeat: 'repeat',
                opacity: 0.06,
                zIndex: 1
            }}></div>
            <div style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%'
            }}>
                <h1 style={{ color: '#FFFFFF', fontSize: "5vh" }}>Select table</h1>
                <FormControl variant="outlined" sx={{
                    width: '30vw',
                    marginBottom: '10vh',
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#FFFFFF', borderWidth: '2px' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)', borderWidth: '2px' },
                        '&.Mui-focused fieldset': { borderColor: '#FFFFFF', borderWidth: '2px' },
                    },
                    '& .MuiInputLabel-root': {
                        color: '#FFFFFF',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        '&.Mui-focused': { color: '#FFFFFF' },
                        '&.MuiInputLabel-shrink': { color: '#FFFFFF' },
                    },
                    '& .MuiSelect-select': {
                        color: '#FFFFFF',
                        backgroundColor: 'rgba(255, 255, 255, 0)',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                    },
                    '& .MuiSvgIcon-root': { color: '#FFFFFF' }
                }}>
                    <InputLabel id="table-select-label">Table...</InputLabel>
                    <Select
                        labelId="table-select-label"
                        id="table-select"
                        value={selectedTable}
                        onChange={handleSelectTable}
                        label="Table..."
                    >
                        {sortedTables.map((table) => (
                            <MenuItem key={table.tableId} value={table.tableId}>{table.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button
                    variant="contained"
                    onClick={handleConfirmTableSelection}
                    sx={{
                        backgroundColor: '#FFFFFF',
                        color: '#5DADF0',
                        fontSize: '2.0vh',
                        fontWeight: 'bold',
                        padding: '10px 20px',
                        '&:hover': {
                            backgroundColor: '#e0f0ff',
                            boxShadow: '0 3px 5px 2px rgba(0, 0, 0, 0.2)'
                        }
                    }}
                >
                    Confirm
                </Button>
            </div>
        </div>
    );
};

export default TableSelectionView;
