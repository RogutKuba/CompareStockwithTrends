import React,{useState} from 'react';
import Stock_Page from './views/Stock_Page';
import Header from './components/Header';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home_Page from './views/Home_Page';



function App(){

  return (
    <div className="mainapp">
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@500;900&display=swap" rel="stylesheet"></link>
      
      <link href="https://fonts.googleapis.com/css2?family=Catamaran:wght@900&display=swap" rel="stylesheet"></link>
      <Router>
        <Header/>
        <Switch>
          <Route exact path="/">
            <Home_Page/>
          </Route>
          <Route path="/analyze/:stock_name/:length">
              <Stock_Page/>
          </Route>
        </Switch>
      </Router>

      
    </div>
  );
}

export default App;