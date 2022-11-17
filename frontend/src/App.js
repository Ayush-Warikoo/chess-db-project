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
import AddGame from './components/AddGame';
import Header from "./components/Header";
import ProfilePage from "./components/ProfilePage";

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
    const [theme, setTheme] = useState('light');

    return (
        <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
            <CssBaseline />
            <Router>
                <Header setTheme={setTheme}/>
                <Routes>
                    <Route path="/" element={<ChessBoardPage theme={theme}/>} />
                    <Route path="/datatable" element={<DataTablePage />} />
                    <Route path="/addgame" element={<AddGame />} />
                    <Route path="/profile/:name" element={<ProfilePage />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
