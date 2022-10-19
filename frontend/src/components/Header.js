import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import React from 'react'
import { Link } from 'react-router-dom';

function Header() {
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
                            Chess Board
                        </Typography>
                    </Link>
                    <Link to="/datatable" style={{ textDecoration: 'none', color: 'white' }}>
                        <Typography variant="h5" component="div" sx={{ flexGrow: 1, paddingRight: '1rem' }}>
                            Data Table
                        </Typography>
                    </Link>
                    <Link to="/addgame" style={{ textDecoration: 'none', color: 'white' }}>
                        <Typography variant="h5" component="div" sx={{ flexGrow: 1, paddingRight: '1rem' }}>
                            Add Game
                        </Typography>
                    </Link>
                </Box>
            </Toolbar>
        </AppBar>
    )
};

export default Header;