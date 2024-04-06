import React from "react";
import HeaderLink from "../HeaderLink/HeaderLink";
import logo from "../../assets/react.svg";
import "./Header.scss";
import Button from "../../UI/Button/Button";
import { useDispatch } from "react-redux";
import { setAdminState, setSecurityState } from "../../store/Slices/userSlice";
import { useSelector } from "react-redux";

export const Header: React.FC = () => {
  const dispatch = useDispatch();
  const role = useSelector(state => state.user.role);
  const setAdmin = React.useCallback(() => {
    dispatch(setAdminState())

  }, [])
  const setSecurity = React.useCallback(() => {
    dispatch(setSecurityState())
  }, [])

  return (
    <>
      <header>
        <div className="header">
          {/* <div className="back-button">
            <BackButton />
          </div> */}
          <Button 
            text="security"
            onClick={setSecurity}
            disabled={role === "security"}
          />
          <div className="header-logo">
            <HeaderLink image={logo} path="/" />
          </div>
          <Button
            text="admin"
            onClick={setAdmin}
            disabled={role === "admin"}
          />
        </div>
      </header>
    </>
  );
};
