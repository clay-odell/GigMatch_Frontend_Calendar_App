import {BrowserRouter as Router} from 'react-router-dom';
import './App.css'
import NavBar from './components/navbar/NavBar'
import 'bootstrap/dist/css/bootstrap.min.css';
import GigMatchRouter from './components/routes/GigMatchRoutes';

function App() {
  

  return (
    <>
    <Router basename={import.meta.VITE_REACT_APP_BASE_URL}>
      <NavBar />
      <GigMatchRouter />
    </Router>
    </>
  )
}

export default App
