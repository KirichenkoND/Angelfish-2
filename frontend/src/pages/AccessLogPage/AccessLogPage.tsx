import React from "react";
import AccessTable from "../../components/AccessTable/AccessTable";

const AccessLogPage: React.FC = () => {
    return (
        <>
            <h1>Журнал посещений</h1>
            <AccessTable />
        </>
    );
};

export default AccessLogPage;