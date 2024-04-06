import React from "react";
import NavigationCard from "../../components/NavigationCard/NavigationCard";
import "./MainPage.scss";

import test_1 from "../../assets/monitor_loading.svg";
import test_2 from "../../assets/propusk.svg";
import test_3 from "../../assets/list_monitor.svg";
import test_4 from "../../assets/sistema_poiska.svg";
import test_5 from "../../assets/lichnyj_kabinet.svg";
import test_6 from "../../assets/software_po.svg";
import { useSelector } from "react-redux";

const NavigationCardList = [
  {
    access: ["admin", "security"],
    imageUrl: test_1,
    title: "Карта",
    link: "/maps",
  },
  {
    access: ["security"],
    imageUrl: test_2,
    title: "Работа с пропусками",
    link: "/accesseditor",
  },
  {
    access: ["admin", "security"],
    imageUrl: test_3,
    title: "Журнал посещений",
    link: "/accesslog",
  },
  {
    access: ["admin", "security"],
    imageUrl: test_4,
    title: "Поиск",
    link: "/search",
  },
  {
    access: ["admin", "security"],
    imageUrl: test_5,
    title: "Пользователи",
    link: "/users",
  },
  {
    access: ["admin"],
    imageUrl: test_6,
    title: "Настройки",
    link: "/settings",
  },
];

const MainPage: React.FC = () => {
  const access: string = useSelector((state) => state.user.role);
  return (
    <>
      <h1>Main Page</h1>
      <div className="navigation-cards-container">
        {access &&
          NavigationCardList.map((navigationCard, i) => {
            if (navigationCard.access.indexOf(access) !== -1) {
                return (
                    <NavigationCard
                      key={i}
                      imageUrl={navigationCard.imageUrl}
                      title={navigationCard.title}
                      link={navigationCard.link}
                    />
                  );
            }
          })}
      </div>
    </>
  );
};

export default MainPage;
