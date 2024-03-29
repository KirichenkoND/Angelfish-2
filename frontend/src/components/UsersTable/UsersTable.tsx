import React from 'react';
import "./UsersTable.scss";
import SearchBar from '../../UI/SearchBar/SearchBar';

import edit_button from "../../assets/edit_button.svg";

const data = [
    { ID: 111, Lastname: "Иванов", Firstname: "Иван", Middlename: "Иванович", Date_Birth: "01.01.2002", Active: true, CategoryID: 0 },
    { ID: 222, Lastname: "Иванов", Firstname: "Иван", Middlename: "Иванович", Date_Birth: "01.01.2002", Active: false, CategoryID: 0 }
];


const UsersTable: React.FC = () => {
    return (
        <>
            <SearchBar />
            <table className="UsersTable">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Lastname</th>
                        <th>Firstname</th>
                        <th>Middlename</th>
                        <th>Date of Birth</th>
                        <th>Active</th>
                        <th>CategoryID</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((user) => (
                        <tr key={user.ID} className={user.Active ? "" : "failed"}>
                            <td>{user.ID}</td>
                            <td>{user.Lastname}</td>
                            <td>{user.Firstname}</td>
                            <td>{user.Middlename}</td>
                            <td>{user.Date_Birth}</td>
                            <td>{user.Active ? "Да" : "Нет"}</td>
                            <td>{user.CategoryID}</td>
                            <td>
                                <a>
                                    <img src={edit_button} style={{ width: '20px', height: '20px' }}></img>
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default UsersTable;