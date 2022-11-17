import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
} from 'react-router-dom';
import ChessBoardPage from './components/ChessBoardPage';
import DataTablePage from './components/DataTablePage';
import AddGame from './components/AddGame';
import Header from "./components/Header";
import ProfilePage from "./components/ProfilePage";

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<ChessBoardPage />} />
                <Route path="/datatable" element={<DataTablePage />} />
                <Route path="/addgame" element={<AddGame />} />
                <Route path="/profile/:name" element={<ProfilePage />} />
            </Routes>
        </Router>
    );
}

export default App;
