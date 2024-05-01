/**
 * This component represents a button that serves as the starting point for the customer.
 * It allows the customer to select a language and navigate to another page.
 */
import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

/**
 * Styled button that displays an image.
 * It adjusts its size based on the screen width.
 */
const ImageButton = styled(ButtonBase)(({theme}) => ({
    position: 'relative',
    height: 250,
    width: 250,
    [theme.breakpoints.down('sm')]: {
        width: '100% !important',
        height: 150,
    },
}));

/**
 * Styled component for the image within the button.
 * It positions the image within the button and adjusts its color.
 */
const Image = styled('span')(({theme}) => ({
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

/**
 * Styled component for the marking below the image.
 * It adds a visual marker below the image.
 */
const ImageMarked = styled('span')(({theme}) => ({
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 9px)',
    transition: theme.transitions.create('opacity'),
}));

/**
 * Styled menu for language selection.
 * It customizes the appearance of the language selection menu.
 */
const LanguageMenu = styled(Menu)(({theme}) => ({
    '& .MuiPaper-root': {
        boxShadow: '0px 8px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        maxHeight: '300px',
        overflowY: 'auto',
    },
}));

/**
 * Functional component representing the Customer Startup Button.
 * It allows the customer to select a language and navigate to another page.
 */
const CustomerStartUpButton = () => {
    // State variables for language selection menu
    const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState('Deutsch');

    /**
     * Retrieves available languages with their respective flags and texts.
     * @returns {object} An object containing language options with flags and texts.
     */
    const getLanguages = () => {
        return {
            German: {
                flagClosed: 'images/language/de_flag_rnd.png',
                flagOpen: 'images/language/de_flag.png',
                text: 'Deutsch',
            },
            English: {
                flagClosed: 'images/language/us_flag_rnd.png',
                flagOpen: 'images/language/us_flag.png',
                text: 'English',
            },
            Spanish: {
                flagClosed: 'images/language/esp_flag_rnd.png',
                flagOpen: 'images/language/esp_flag.png',
                text: 'Español',
            },
            French: {
                flagClosed: 'images/language/fra_flag_rnd.png',
                flagOpen: 'images/language/fra_flag.png',
                text: 'Français',
            },
            Chinese: {
                flagClosed: 'images/language/chn_flag_rnd.png',
                flagOpen: 'images/language/chn_flag.png',
                text: '中国人',
            },
        };
    };

    /**
     * Opens the language selection menu.
     * @param {object} event The event object.
     */
    const handleLanguageMenuOpen = (event) => {
        setLanguageAnchorEl(event.currentTarget);
    };

    /**
     * Closes the language selection menu.
     */
    const handleLanguageMenuClose = () => {
        setLanguageAnchorEl(null);
    };

    /**
     * Handles the selection of a language.
     * @param {string} language The selected language.
     */
    const handleLanguageSelect = (language) => {
        setSelectedLanguage(language);
        setLanguageAnchorEl(null);
    };

    // JSX for the component
    return (
        <Box sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh'
        }}>
            {/* Link to card page */}
            <Link to="/card">
                {/* Image button */}
                <ImageButton>
                    {/* Image */}
                    <Image className={"imagineContainer"}>
                        {/* Text */}
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
                            {/* Logo */}
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
                            {/* Image marker */}
                            <ImageMarked className="MuiImageMarked-root"/>
                        </Typography>
                    </Image>
                </ImageButton>
            </Link>

            {/* Language selection button */}
            <Box sx={{position: 'absolute', bottom: 80, right: 32}}>
                <ButtonBase onClick={handleLanguageMenuOpen}>
                    {/* Flag icon */}
                    <img
                        src={languageAnchorEl ? getLanguages()[selectedLanguage].flagOpen : getLanguages()[selectedLanguage].flagClosed}
                        alt={selectedLanguage}
                        style={{width: '30px', height: 'auto', marginRight: '8px'}}/>
                    {/* Language text */}
                    <Typography variant="body2">{getLanguages()[selectedLanguage].text}</Typography>
                </ButtonBase>
                {/* Language selection menu */}
                <LanguageMenu
                    anchorEl={languageAnchorEl}
                    open={Boolean(languageAnchorEl)}
                    onClose={handleLanguageMenuClose}
                >
                    {/* Menu items for each language */}
                    {Object.keys(getLanguages()).map((language) => (
                        <MenuItem key={language} onClick={() => handleLanguageSelect(language)}>
                            {/* Flag icon */}
                            <img
                                src={languageAnchorEl ? getLanguages()[language].flagOpen : getLanguages()[language].flagClosed}
                                alt={language} style={{
                                width: '30px',
                                height: 'auto',
                                marginRight: '8px'
                            }}/> {getLanguages()[language].text}
                        </MenuItem>
                    ))}
                </LanguageMenu>
            </Box>
        </Box>
    );
}

export default CustomerStartUpButton;
