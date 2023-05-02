import "@fontsource/metropolis";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Navbar } from "./components/Navbar/Navbar";
import { SearchForm } from "./components/SearchForm/SearchForm";

function App() {
  return (
    <div className="App">
      <Navbar />
      <small className="message">made with ❤️ by <a href="https://anikethirpara.com/" rel="noreferrer" target="_blank">Aniket Hirpara</a> (CS MEng Fall '23)</small>
      <SearchForm />
    <span className='d-flex justify-content-center align-items-start flex-column p-3' style={{backgroundColor: "rgba(0,0,0,1)", color: "white", position: "sticky", bottom: "0", width: "100%"}}>
    <small className="message">the data is sourced from VT ISA off-campus form responses <a  rel="noreferrer" href="https://docs.google.com/spreadsheets/d/13wTnFW3UOzIliJEMKB792XO-J4kdRHOXgCojJA8ExFg/edit?resourcekey#gid=404965889" target="_blank">found here</a>  </small>
      <small className="message">There's still some issue with the data parsing from excel to JSON, The project is opensource and code is available at <a href="https://github.com/gdg4dev/buddyfinder" rel="noreferrer" target="_blank">github</a></small>
    </span>
    </div>
  );
}

export default App;
