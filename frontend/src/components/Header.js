import { AppBar, Box, Toolbar, Typography, Switch } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import React from 'react'
import { Link } from 'react-router-dom';

function Header({ setTheme }) {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography
                    variant="h4"
                    component="div"
                    sx={{ paddingRight: '2rem' }}
                >
                    BU381 Chess Project
                </Typography>
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
                        <Typography variant="h5" component="div" sx={{ flexGrow: 1, paddingRight: '1rem' }}>
                            Chessboard
                        </Typography>
                    </Link>
                    <Link to="/datatable" style={{ textDecoration: 'none', color: 'white' }}>
                        <Typography variant="h5" component="div" sx={{ flexGrow: 1, paddingRight: '1rem' }}>
                            Data Table
                        </Typography>
                    </Link>
                    {/* <Link to="/opening" style={{ textDecoration: 'none', color: 'white' }}>
                        <Typography variant="h5" component="div" sx={{ flexGrow: 1, paddingRight: '1rem' }}>
                            Opening Explorer
                        </Typography>
                    </Link> */}
                    <Link to="/addgame" style={{ textDecoration: 'none', color: 'white' }}>
                        <Typography variant="h5" component="div" sx={{ flexGrow: 1, paddingRight: '1rem' }}>
                            Add Game
                        </Typography>
                    </Link>
                </Box>
                
                <LightModeIcon />
                <Switch
                    checked={localStorage.getItem('theme') === 'dark'}
                    onChange={() => setTheme((theme) => {
                      const newTheme = theme === 'light' ? 'dark' : 'light';
                      localStorage.setItem('theme', newTheme);
                      return newTheme;
                    })}
                />
                <DarkModeIcon />
                
            </Toolbar>
        </AppBar>
    )
};

export default Header;