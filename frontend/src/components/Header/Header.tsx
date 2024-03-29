import React from 'react';
import HeaderLink from "../HeaderLink/HeaderLink";
import logo from "../../assets/react.svg";
import "./Header.scss"

const HeaderLinks = [
    {
        text: "Главная",
        path: "/",
    },
    {
        text: "Редактор",
        path: "/editor",
    },
    {
        text: "Попуски",
        path: "/editor",
    },
    {
        text: "Журнал Посещений",
        path: "/editor",
    },
    {
        text: "Поиск",
        path: "/editor",
    },
    {
        text: "Пользователи",
        path: "/editor",
    },
    {
        text: "Настройки",
        path: "/editor",
    },
];

export const Header: React.FC = () => {
    return (
        <>
            <header>
                <div className="header">
                    <div className="header-logo">
                        <HeaderLink image={logo} path="/" />
                    </div>
                    <div className="header-links">
                        {HeaderLinks.map((headerLink, i) => {
                            return (
                                <HeaderLink
                                    key={i}
                                    text={headerLink.text}
                                    path={headerLink.path}
                                />
                            );
                        })}
                    </div>
                </div>
            </header>
        </>
    )
}