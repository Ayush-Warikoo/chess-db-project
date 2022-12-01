import React, { useState } from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
} from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import ChessBoardPage from './components/ChessBoardPage';
import DataTablePage from './components/DataTablePage';
import AddGamePage from './components/AddGamePage';
import Header from "./components/Header";
import ProfilePage from "./components/ProfilePage";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#161512',
        },
        text: {
            primary: '#ffffff',
            secondary: '#b6b1b5',
        },
    },
});

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: '#eaeded',
        }
    },
});

function App() {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
                <CssBaseline />
                <Router>
                    <Header setTheme={setTheme}/>
                    <Routes>
                        <Route path="/" element={<ChessBoardPage theme={theme}/>} />
                        <Route path="/datatable" element={<DataTablePage theme={theme}/>} />
                        <Route path="/addgame" element={<AddGamePage theme={theme}/>} />
                        <Route path="/profile/:name" element={<ProfilePage theme={theme}/>} />
                    </Routes>
                </Router>
            </ThemeProvider>
        </LocalizationProvider>
    );
}

export default App;