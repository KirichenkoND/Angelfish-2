import React, { useState } from "react";
import './Editors.scss';

const roles = [
    "admin",
    "none",
    "security",
    "service",
    "student",
    "teacher"
];

const EditorRoles: React.FC = () => {
    const [newRole, setNewRole] = useState('');
    const addRole = (role: string) => {
        console.log(`Добавлена роль: ${role}`);
    };
    const deleteRole = (role: string) => {
        console.log(`Удалена роль: ${role}`);
    };
    return (
        <>
            <div className="universal-editor">
                <div className="add-universal">
                    <input
                        type="text"
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        placeholder="Новая роль"
                    />
                    <button onClick={() => addRole(newRole)}>Добавить</button>
                </div>
                <ul>
                    {roles.map((role, index) => (
                        <li key={index}>
                            {role}
                            <button onClick={() => deleteRole(role)}>Удалить</button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default EditorRoles;
