import React from "react";
import EditorCategories from "../../components/EditorSettings/EditorCategories";
import EditorRoles from "../../components/EditorSettings/EditorRoles";
import EditorRooms from "../../components/EditorSettings/EditorRooms";
import EditorPerms from "../../components/EditorSettings/EditorPerms";

const SettingsPage: React.FC = () => {
    return (
        <>
            <h1>Важные настройки</h1>
            <hr />
            <h2>Редактор категорий</h2>
            <EditorCategories />
            <hr />
            <h2>Редактор ролей</h2>
            <EditorRoles />
            <hr />
            <h2>Редактор прав</h2>
            <EditorPerms />
            <hr />
            <h2>Редактор помещений</h2>
            <EditorRooms />
            <hr />
        </>
    );
};

export default SettingsPage;