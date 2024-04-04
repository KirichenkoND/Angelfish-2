import "./App.scss";
import { Header } from "./components/Header/Header";
import { Outlet } from "react-router-dom";
import { store } from "./store/store";
import { Provider } from "react-redux";

function App() {
  return (
    <>
      <Provider store={store}>
        <Header />
        <div className="app-container">
          <Outlet />
        </div>
      </Provider>
    </>
  );
}

export default App;
