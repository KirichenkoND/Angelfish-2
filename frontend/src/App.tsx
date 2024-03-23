import './App.scss';
import { Header } from "./components/Header/Header";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <Header />
      <div className='app-container'>
        <Outlet />
      </div>
    </>
  )
}

export default App
