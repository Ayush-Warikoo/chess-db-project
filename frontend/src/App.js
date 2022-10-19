

import {
    BrowserRouter as Router,
    Route,
    Routes,
} from 'react-router-dom';
import ChessBoardPage from './components/ChessBoardPage';
import DataTablePage from './components/DataTablePage';

import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ChessBoardPage />} />
                <Route path="/datatable" element={<DataTablePage />} />
            </Routes>
        </Router>
    );
}

export default App;
