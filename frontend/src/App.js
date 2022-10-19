import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
} from 'react-router-dom';
import ChessBoardPage from './components/ChessBoardPage';
import DataTablePage from './components/DataTablePage';
import AddGame from './AddGame';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ChessBoardPage />} />
                <Route path="/datatable" element={<DataTablePage />} />
                <Route path="/addgame" element={<AddGame />} />
            </Routes>
        </Router>
    );
}

export default App;
