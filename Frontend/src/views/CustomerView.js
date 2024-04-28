import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

const ImageButton = styled(ButtonBase)(({ theme }) => ({
    position: 'relative',
    height: 250,
    width: 250,
    [theme.breakpoints.down('sm')]: {
        width: '100% !important',
        height: 150,
    },
}));

const Image = styled('span')(({ theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
}));

const ImageMarked = styled('span')(({ theme }) => ({
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 9px)',
    transition: theme.transitions.create('opacity'),
}));

const LanguageMenu = styled(Menu)(({ theme }) => ({
    '& .MuiPaper-root': {
        boxShadow: '0px 8px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        maxHeight: '300px',
        overflowY: 'auto',
    },
}));

const CustomerStartUpButton = () => {
    const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState('Deutsch');

    const getLanguages = () => {
        return {
            Deutsch: {
                flagClosed: 'images/language/de_flag_rnd.png',
                flagOpen: 'images/language/de_flag.png',
                text: 'Deutsch',
            },
            English: {
                flagClosed: 'images/language/us_flag_rnd.png',
                flagOpen: 'images/language/us_flag.png',
                text: 'English',
            },
            Español: {
                flagClosed: 'images/language/esp_flag_rnd.png',
                flagOpen: 'images/language/esp_flag.png',
                text: 'Español',
            },
            Français: {
                flagClosed: 'images/language/fra_flag_rnd.png',
                flagOpen: 'images/language/fra_flag.png',
                text: 'Français',
            },
            中国人: {
                flagClosed: 'images/language/chn_flag_rnd.png',
                flagOpen: 'images/language/chn_flag.png',
                text: '中国人',
            },
        };
    };

    const handleLanguageMenuOpen = (event) => {
        setLanguageAnchorEl(event.currentTarget);
    };

    const handleLanguageMenuClose = () => {
        setLanguageAnchorEl(null);
    };

    const handleLanguageSelect = (language) => {
        setSelectedLanguage(language);
        setLanguageAnchorEl(null);
    };

    return (
        <Box sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh'
        }}>
            <Link to="/card">
                <ImageButton>
                    <Image className={"imagineContainer"}>
                        <Typography
                            component="span"
                            variant="subtitle1"
                            color="inherit"
                            sx={{
                                position: 'relative',
                                p: 4,
                                pt: 2,
                                pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
                            }}
                        >
                            <img src={"images/logo/logo.png"}
                                 alt={"businessIcon"}
                                 style={{
                                     maxWidth: '300px',
                                     maxHeight: '300px',
                                     border: '1px solid black',
                                     borderRadius: '300px',
                                     overflow: 'hidden'
                                 }}
                            />
                            <ImageMarked className="MuiImageMarked-root" />
                        </Typography>
                    </Image>
                </ImageButton>
            </Link>

            <Box sx={{ position: 'absolute', bottom: 80, right: 32 }}>
                <ButtonBase onClick={handleLanguageMenuOpen}>
                    <img src={languageAnchorEl ? getLanguages()[selectedLanguage].flagOpen : getLanguages()[selectedLanguage].flagClosed} alt={selectedLanguage}
                         style={{ width: '30px', height: 'auto', marginRight: '8px' }} />
                    <Typography variant="body2">{getLanguages()[selectedLanguage].text}</Typography>
                </ButtonBase>
                <LanguageMenu
                    anchorEl={languageAnchorEl}
                    open={Boolean(languageAnchorEl)}
                    onClose={handleLanguageMenuClose}
                >
                    {Object.keys(getLanguages()).map((language) => (
                        <MenuItem key={language} onClick={() => handleLanguageSelect(language)}>
                            <img src={languageAnchorEl ? getLanguages()[language].flagOpen : getLanguages()[language].flagClosed} alt={language} style={{
                                width: '30px',
                                height: 'auto',
                                marginRight: '8px'
                            }} /> {getLanguages()[language].text}
                        </MenuItem>
                    ))}
                </LanguageMenu>
            </Box>
        </Box>
    );
}

export default CustomerStartUpButton;
