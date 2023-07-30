import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import Player from './components/Player';
import './App.css';

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/player/:songId" component={Player} />
            </Switch>
        </Router>
    );
}

export default App;
