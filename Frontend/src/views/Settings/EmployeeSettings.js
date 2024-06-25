import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import config from '../../config';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function EmployeeSettings() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('ROLE_ADMIN'); // Default to ROLE_ADMIN
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [editType, setEditType] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditTypeDialog, setOpenEditTypeDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [isEditRoleDisabled, setIsEditRoleDisabled] = useState(true); // Initial state can be true or false based on your logic

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${config.apiBaseUrl}/api/user/all`);
            setUsers(response.data);
        } catch (error) {
            setError('Failed to fetch users');
            setOpenSnackbar(true);
        }
    };

    const handleAddEmployee = async () => {
        if (!username || !email || !password || !role) {
            setError('All fields are required');
            setOpenSnackbar(true);
            return;
        }
        if (username.length > 20) {
            setError('Username must be 20 characters or less');
            setOpenSnackbar(true);
            return;
        }
        try {
            const response = await axios.post(`${config.apiBaseUrl}/api/auth/signup`, {
                username,
                email,
                password,
                role: [role], // Ensure role is sent as an array
            }, { timeout: 5000 });

            if (response.status === 200) {
                setOpenAddDialog(false);
                setUsername('');
                setEmail('');
                setPassword('');
                setRole('ROLE_ADMIN'); // Reset to default ROLE_ADMIN
                setSuccessMessage('User added successfully');
                setOpenSnackbar(true);
                fetchUsers(); // Reload the user list
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                const errorMessage = error.response.data.message;
                if (errorMessage.includes('Username')) {
                    setError('Username already exists');
                } else if (errorMessage.includes('Email')) {
                    setError('Email already exists');
                } else {
                    setError('Failed to add employee');
                }
            } else {
                setError('Failed to add employee');
            }
            setOpenSnackbar(true);
        }
    };

    const handleEditUser = async () => {
        try {
            if (editType === 'username' && username) {
                if (username.length > 20) {
                    setError('Username must be 20 characters or less');
                    setOpenSnackbar(true);
                    return;
                }
                await axios.put(`${config.apiBaseUrl}/api/user/changeUsername/${selectedUserId}`, username, {
                    headers: { 'Content-Type': 'text/plain' },
                });
            } else if (editType === 'role' && role) {
                await axios.put(`${config.apiBaseUrl}/api/user/changeRole/${selectedUserId}`, role, {
                    headers: { 'Content-Type': 'text/plain' },
                });
            } else if (editType === 'password' && oldPassword && newPassword) {
                await axios.put(`${config.apiBaseUrl}/api/user/changePassword/${selectedUserId}`, {
                    oldPassword,
                    newPassword,
                });
            }
            setOpenEditDialog(false);
            setOldPassword('');
            setNewPassword('');
            setUsername('');
            setRole(''); // Reset to default ROLE_ADMIN
            setEditType('');
            fetchUsers(); // Reload the user list
        } catch (error) {
            if (editType === 'password' && error.response && error.response.status === 400) {
                setError('Old password is incorrect');
            } else {
                setError('Failed to update user');
            }
            setOpenSnackbar(true);
        }
    };

    const handleDeleteUser = async () => {
        try {
            await axios.delete(`${config.apiBaseUrl}/api/user/delete/${selectedUserId}`);
            setOpenDeleteDialog(false);
            setSuccessMessage('User deleted successfully');
            setOpenSnackbar(true);
            fetchUsers(); // Reload the user list
        } catch (error) {
            setError('Failed to delete user');
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
        setError('');
        setSuccessMessage('');
    };

    const handleOpenAddDialog = () => {
        setOpenAddDialog(true);
    };

    const handleCloseAddDialog = () => {
        setOpenAddDialog(false);
    };

    const handleOpenEditTypeDialog = (userId) => {
        setSelectedUserId(userId);
        setOpenEditTypeDialog(true);
    };

    const handleCloseEditTypeDialog = () => {
        setOpenEditTypeDialog(false);
    };

    const handleOpenEditDialog = (type) => {
        setEditType(type);
        setOpenEditTypeDialog(false);
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
    };

    const handleOpenDeleteDialog = (userId) => {
        setSelectedUserId(userId);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    return (
        <Container component="main">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <h1 style={{ color: "#0383E2", fontSize: "3vh" }}> Employee Settings </h1>
                <IconButton
                    color="primary"
                    aria-label="add employee"
                    onClick={handleOpenAddDialog}
                    sx={{ alignSelf: 'flex-end', marginTop: 2 }}
                >
                    <AddIcon />
                </IconButton>
                <TableContainer component={Paper} sx={{ mt: 4, boxShadow: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Username</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Roles</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.roles.map((role) => role.name).join(', ')}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            color="primary"
                                            aria-label="edit user"
                                            onClick={() => handleOpenEditTypeDialog(user.id)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            aria-label="delete user"
                                            onClick={() => handleOpenDeleteDialog(user.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
                <DialogTitle>Add Employee</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Select
                        margin="normal"
                        required
                        fullWidth
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <MenuItem value="ROLE_ADMIN">ROLE_ADMIN</MenuItem>
                        <MenuItem value="ROLE_USER">ROLE_USER</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddDialog} sx={{ color: 'secondary' }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddEmployee}
                        sx={{ background: 'linear-gradient(to top, #0383E2, #5DADF0)', color: 'white' }}
                    >
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openEditTypeDialog} onClose={handleCloseEditTypeDialog}>
                <DialogTitle>Choose Edit Type</DialogTitle>
                <DialogContent>
                    <Button
                        onClick={() => handleOpenEditDialog('username')}
                        fullWidth
                        variant="outlined"
                        sx={{ mt: 2 }}
                    >
                        Edit Username
                    </Button>
                    <Button
                        onClick={() => handleOpenEditDialog('role')}
                        fullWidth
                        variant="outlined"
                        sx={{ mt: 2 }}
                        disabled={isEditRoleDisabled}
                    >
                        Edit Role
                    </Button>
                    <Button
                        onClick={() => handleOpenEditDialog('password')}
                        fullWidth
                        variant="outlined"
                        sx={{ mt: 2 }}
                    >
                        Edit Password
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditTypeDialog} sx={{ color: 'secondary' }}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
                <DialogTitle>Edit {editType.charAt(0).toUpperCase() + editType.slice(1)}</DialogTitle>
                <DialogContent>
                    {editType === 'username' && (
                        <TextField
                            margin="normal"
                            fullWidth
                            id="edit-username"
                            label="New Username"
                            name="edit-username"
                            autoComplete="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    )}
                    {editType === 'role' && (
                        <Select
                            margin="normal"
                            fullWidth
                            id="edit-role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <MenuItem value="ROLE_ADMIN">ROLE_ADMIN</MenuItem>
                            <MenuItem value="ROLE_USER">ROLE_USER</MenuItem>
                        </Select>
                    )}
                    {editType === 'password' && (
                        <>
                            <TextField
                                margin="normal"
                                fullWidth
                                name="old-password"
                                label="Old Password"
                                type="password"
                                id="old-password"
                                autoComplete="current-password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                name="new-password"
                                label="New Password"
                                type="password"
                                id="new-password"
                                autoComplete="new-password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditDialog} sx={{ color: 'secondary' }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleEditUser}
                        sx={{ background: 'linear-gradient(to top, #0383E2, #5DADF0)', color: 'white' }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this user?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} sx={{ color: 'secondary' }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteUser}
                        sx={{ background: 'linear-gradient(to top, #0383E2, #5DADF0)', color: 'white' }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={successMessage ? "success" : "error"}>
                    {successMessage || error}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default EmployeeSettings;
