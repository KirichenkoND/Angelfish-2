import React, { useState } from 'react';
import "./UsersTable.scss";
import SearchBar from '../../UI/SearchBar/SearchBar';
import edit_button from "../../assets/edit_button.svg";
import delete_button from "../../assets/delete_button.svg";

const initialData = [
    { ID: 111, Lastname: "Иванов", Firstname: "Иван", Middlename: "Иванович", Date_Birth: "01.01.2002", Active: true, CategoryID: 0 },
    { ID: 222, Lastname: "Петров", Firstname: "Петр", Middlename: "Петрович", Date_Birth: "02.02.2003", Active: false, CategoryID: 1 },
    { ID: 333, Lastname: "Пиванов", Firstname: "Пиван", Middlename: "Петрович", Date_Birth: "02.02.2003", Active: false, CategoryID: 2 }
];

const sortData = (data, column, direction) => {
    return data.sort((a, b) => {
        if (a[column] < b[column]) return direction === 'asc' ? -1 : 1;
        if (a[column] > b[column]) return direction === 'asc' ? 1 : -1;
        return 0;
    });
};

const filterData = (data, filters) => {
    return data.filter((row) => {
        return Object.keys(filters).every((key) => {
            const value = String(row[key]).toLowerCase();
            const query = filters[key].toLowerCase();
            return value.includes(query);
        });
    });
};

const UsersTable = () => {
    const [data, setData] = useState(initialData);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [filters, setFilters] = useState({
        ID: '',
        Lastname: '',
        Firstname: '',
        Middlename: '',
        Date_Birth: '',
        Active: '',
        CategoryID: ''
    });

    const handleSort = (column) => {
        const isAsc = sortColumn === column && sortDirection === 'asc';
        setSortDirection(isAsc ? 'desc' : 'asc');
        setSortColumn(column);
        setData(sortData([...data], column, isAsc ? 'desc' : 'asc'));
    };

    const updateFilter = (column, value) => {
        setFilters({ ...filters, [column]: value });
    };

    const filteredData = filterData(data, filters);

    return (
        <>
            <SearchBar />
            <table className="UsersTable">
                <thead>
                    <tr>
                        {["ID", "Lastname", "Firstname", "Middlename", "Date_Birth", "Active", "CategoryID"].map((column) => (
                            <th key={column} onClick={() => handleSort(column)}>
                                <span>{column}</span>
                                <input
                                    type="text"
                                    value={filters[column]}
                                    onChange={(e) => updateFilter(column, e.target.value)}
                                    onClick={(e) => e.stopPropagation()} // Prevent input click from triggering sort
                                    placeholder={`Filter ${column}`}
                                    style={{ marginLeft: '10px', padding: '2px', fontSize: 'small' }}
                                />
                            </th>
                        ))}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((user) => (
                        <tr key={user.ID}>
                            <td>{user.ID}</td>
                            <td>{user.Lastname}</td>
                            <td>{user.Firstname}</td>
                            <td>{user.Middlename}</td>
                            <td>{user.Date_Birth}</td>
                            <td>{user.Active ? "Да" : "Нет"}</td>
                            <td>{user.CategoryID}</td>
                            <td>
                                <a href="#">
                                    <img src={edit_button} alt="Edit" style={{ width: '20px', height: '20px' }} />
                                    <img src={delete_button} alt="Delete" style={{ width: '20px', height: '20px' }} />
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default UsersTable;
