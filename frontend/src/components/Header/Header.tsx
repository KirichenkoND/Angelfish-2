import React, { useCallback } from "react";
import HeaderLink from "../HeaderLink/HeaderLink";
import logo from "../../../public/logo.svg";
import "./Header.scss";
import Button from "../../UI/Button/Button";
import { useDispatch } from "react-redux";
import { logoutUser, setAdminState, setSecurityState } from "../../store/Slices/userSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../api/authApi";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const role = useSelector((state) => state.user.role);
  const [logoutFetch] = useLogoutMutation({});

  const setAdmin = React.useCallback(() => {
    dispatch(setAdminState());
  }, []);
  const setSecurity = React.useCallback(() => {
    dispatch(setSecurityState());
  }, []);

  const handleAuthNavigate = React.useCallback(() => {
    navigate("/auth");
  }, [navigate]);

  const logout = useCallback(() => {
    logoutFetch({});
    dispatch(logoutUser());
  }, []);
  
  return (
    <>
      <header>
        <div className="header">
          {/* <div className="back-button">
            <BackButton />
          </div> */}
          <span style={{ color: "white" }}>{role}</span>
          <div className="header-logo">
            <HeaderLink image={logo} path="/" />
          </div>
          {/* <Button
            text="admin"
            onClick={setAdmin}
            disabled={role === "admin"}
          /> */}
          {!role && <Button text="Auth" onClick={handleAuthNavigate} />}
          {role && <Button text={"Выйти"} onClick={logout} />}
        </div>
      </header>
    </>
  );
};
