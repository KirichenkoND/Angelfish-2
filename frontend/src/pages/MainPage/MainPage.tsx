import React from 'react';
import test_1 from "../../assets/monitor_loading.svg";
import test_2 from "../../assets/propusk.svg";
import test_3 from "../../assets/list_monitor.svg";

import NavigationCard from "../../components/NavigationCard/NavigationCard";

const MainPage: React.FC = () => {
    return (
        <>
            <h1>Main Page</h1>
            <NavigationCard imageUrl={test_1} title="Синхронизация" link="/" />
            <NavigationCard imageUrl={test_2} title="Синхронизация" link="/" />
            <NavigationCard imageUrl={test_3} title="Синхронизация" link="/" />
        </>
    );
};

export default MainPage;