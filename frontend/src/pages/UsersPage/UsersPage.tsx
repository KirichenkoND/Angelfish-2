import React from "react";
import UsersTable from "../../components/UsersTable/UsersTable";

const UsersPage: React.FC = () => {
    return (
        <>
            <h1>Список пользователей</h1>
            <UsersTable />
        </>
    );
};

export default UsersPage;