

import { BrowserRouter as Router,Routes,Route } from "react-router-dom";

import Nhap_File from './page/Nhap_File';

function App() {
  return (
    <div className="App">
        <Router>
          <Routes>
          
              <Route path="/" element={<Nhap_File/>} />
              
          </Routes>
       </Router>
    </div>
  );
}

export default App;
