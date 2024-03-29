import React from "react";
import HeaderLink from "../HeaderLink/HeaderLink";
import logo from "../../assets/react.svg";
import "./Header.scss";
import BackButton from "../BackButton/BackButton";

export const Header: React.FC = () => {
  return (
    <>
      <header>
        <div className="header">
          {/* <div className="back-button">
            <BackButton />
          </div> */}
          <div className="header-logo">
            <HeaderLink image={logo} path="/" />
          </div>
        </div>
      </header>
    </>
  );
};
