import React from 'react';
import NavigationCard from "../../components/NavigationCard/NavigationCard";
import './MainPage.scss';

import test_1 from "../../assets/monitor_loading.svg";
import test_2 from "../../assets/propusk.svg";
import test_3 from "../../assets/list_monitor.svg";
import test_4 from "../../assets/sistema_poiska.svg";
import test_5 from "../../assets/lichnyj_kabinet.svg";
import test_6 from "../../assets/software_po.svg";

const NavigationCardList = [
    {
        imageUrl: test_1,
        title: "Загрузка...",
        link: "/",
    },
    {
        imageUrl: test_2,
        title: "Работа с пропусками",
        link: "/",
    },
    {
        imageUrl: test_3,
        title: "Журнал посещений",
        link: "/accesslog",
    },
    {
        imageUrl: test_4,
        title: "Поиск",
        link: "/",
    },
    {
        imageUrl: test_5,
        title: "Пользователи",
        link: "/users",
    },
    {
        imageUrl: test_6,
        title: "Настройки",
        link: "/",
    }
];

const MainPage: React.FC = () => {
    return (
        <>
            <h1>Main Page</h1>
            <div className='navigation-cards-container'>
                {NavigationCardList.map((navigationCard, i) => {
                    return (
                        <NavigationCard
                            key={i}
                            imageUrl={navigationCard.imageUrl}
                            title={navigationCard.title}
                            link={navigationCard.link}
                        />
                    );
                })}
            </div>
        </>
    );
};

export default MainPage;