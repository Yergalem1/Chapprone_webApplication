import React from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import CSV from './components/csv.component.js'
import Recharts from './components/rechart.component.js'


function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container">
          
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link className="nav-link" to={'/csv'}>
                   Generate 
                  </Link>
                </li>
              
                <li >
                  <Link className="nav-link" to={'/rechart'}>
                 Chart 
                  </Link>
                </li>
           
              </ul>
            </div>
          </div>
        </nav>
        <div className="auth-wrapper">
     
          <div className="auth-inner">
            <Routes>
              <Route exact path="/" element={<CSV />} />
              <Route path="/csv" element={<CSV />} />
             
          
            </Routes>
          </div>
          <div><Routes>  <Route path="/rechart" element={<Recharts />} /></Routes></div>
          
        </div>
      </div>
    </Router>
  )
}
export default App