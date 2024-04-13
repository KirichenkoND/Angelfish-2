import React, { useState } from "react";
import EditorCategories from "../../components/EditorSettings/EditorCategories";
import EditorRoles from "../../components/EditorSettings/EditorRoles";
import EditorRooms from "../../components/EditorSettings/EditorRooms";
import EditorPerms from "../../components/EditorSettings/EditorPerms";
import './SettingsPage.scss';

const SettingsPage: React.FC = () => {
    const [selectedEditor, setSelectedEditor] = useState<string>('categories');
    const renderEditor = () => {
        switch (selectedEditor) {
            case 'categories':
                return <EditorCategories />;
            case 'roles':
                return <EditorRoles />;
            case 'permissions':
                return <EditorPerms />;
            case 'rooms':
                return <EditorRooms />;
            default:
                return null;
        }
    };
    return (
        <>
            <h1>Важные настройки</h1>
            <div className='settings_btn'>
                <button onClick={() => setSelectedEditor('categories')}>Категории</button>
                <button onClick={() => setSelectedEditor('roles')}>Роли</button>
                <button onClick={() => setSelectedEditor('permissions')}>Права</button>
                <button onClick={() => setSelectedEditor('rooms')}>Помещения</button>
            </div>
            <hr />
            {renderEditor()}
        </>
    );
};

export default SettingsPage;