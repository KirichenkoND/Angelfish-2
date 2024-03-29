import React from "react";
import UsersTable from "../../components/UsersTable/UsersTable";
import Button from "../../UI/Button/Button";

const UsersPage: React.FC = () => {
    return (
        <>
            <h1>Список пользователей</h1>
            <UsersTable />
            <Button text="Добавить пользователя"/>
        </>
    );
};

export default UsersPage;