import "./App.scss";
import { Header } from "./components/Header/Header";
import { Outlet } from "react-router-dom";
import { store, useAppDispatch } from "./store/store";
import { Provider } from "react-redux";
import { useMeQuery } from "./api/authApi";
import { setUser } from "./store/Slices/userSlice";
import { useEffect } from "react";


function App() {
  const dispatch = useAppDispatch();
  const { data, isError, isLoading, isSuccess } = useMeQuery();
  if (isError) {

  }
  if (isLoading) {
  }
  useEffect(() => {
    if (isSuccess) {
      console.log(data)
      dispatch(setUser({ phone: data.phone, role: data.role }));
    }
  }, [data]);

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
