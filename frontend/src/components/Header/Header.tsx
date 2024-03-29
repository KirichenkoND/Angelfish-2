import React from 'react';
import HeaderLink from "../HeaderLink/HeaderLink";
import logo from "../../assets/react.svg";
import "./Header.scss"

export const Header: React.FC = () => {
    return (
        <>
            <header>
                <div className="header">
                    <div className="header-logo">
                        <HeaderLink image={logo} path="/" />
                    </div>
                </div>
            </header>
        </>
    )
}