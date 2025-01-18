import {BrowserRouter as Router} from 'react-router-dom';
import './App.css'
import NavBar from './components/navbar/NavBar'
import 'bootstrap/dist/css/bootstrap.min.css';
import GigMatchRouter from './components/routes/GigMatchRoutes';

function App() {
  

  return (
    <>
    <Router basename={ "https://gigmatch-frontend-calendar-app.onrender.com"|| "/"}>
      <NavBar />
      <GigMatchRouter />
    </Router>
    </>
  )
}

export default App
