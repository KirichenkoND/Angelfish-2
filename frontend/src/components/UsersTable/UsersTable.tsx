import React, { useState } from "react";
import "./UsersTable.scss";
import SearchBar from "../../UI/SearchBar/SearchBar";
import edit_button from "../../assets/edit_button.svg";
import delete_button from "../../assets/delete_button.svg";

const initialData = [
  { uuid: "1a2b3c", first_name: "Иван", last_name: "Иванов", middle_name: "Иванович", role_id: 1, banned: false, ban_reason: "" },
  { uuid: "4d5e6f", first_name: "Петр", last_name: "Петров", middle_name: "Петрович", role_id: 2, banned: true, ban_reason: "Так захотел Главный админ" },
  { uuid: "7g8h9i", first_name: "Павел", last_name: "Павлов", middle_name: "Павлович", role_id: 3, banned: false, ban_reason: "" },
];

const sortData = (data, column, direction) => {
  return data.sort((a, b) => {
    if (a[column] < b[column]) return direction === "asc" ? -1 : 1;
    if (a[column] > b[column]) return direction === "asc" ? 1 : -1;
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
  const [sortDirection, setSortDirection] = useState("asc");
  const [filters, setFilters] = useState({
    uuid: "",
    first_name: "",
    last_name: "",
    middle_name: "",
    role_id: "",
    banned: "",
    ban_reason: "",
  });

  const handleSort = (column) => {
    const isAsc = sortColumn === column && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortColumn(column);
    setData(sortData([...data], column, isAsc ? "desc" : "asc"));
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
            {[
              "uuid",
              "first_name",
              "last_name",
              "middle_name",
              "role_id",
              "banned",
              "ban_reason",
            ].map((column) => (
              <th key={column} onClick={() => handleSort(column)}>
                <span>{column.replace(/_/g, ' ')}</span>
                <input
                  type="text"
                  value={filters[column]}
                  onChange={(e) => updateFilter(column, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  placeholder={`Filter ${column.replace(/_/g, ' ')}`}
                  style={{ marginLeft: "10px", padding: "2px", fontSize: "small" }}
                />
              </th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((user, index) => (
            <UserRow key={index} user={user} />
          ))}
        </tbody>
      </table>
    </>
  );
};

const UserRow = ({ user }) => {
  const [banned, setBanned] = useState(user.banned);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleEditClick = () => setIsEditing(true);
  const handleSaveClick = () => setIsEditing(false);
  const handleCancelClick = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  return (
    <tr className={banned ? "failed" : ""}>
      <td>{user.uuid}</td>
      <td>{isEditing ? <input type="text" name="first_name" value={editedUser.first_name} onChange={handleInputChange} /> : editedUser.first_name}</td>
      <td>{isEditing ? <input type="text" name="last_name" value={editedUser.last_name} onChange={handleInputChange} /> : editedUser.last_name}</td>
      <td>{isEditing ? <input type="text" name="middle_name" value={editedUser.middle_name} onChange={handleInputChange} /> : editedUser.middle_name}</td>
      <td>{isEditing ? <input type="text" name="role_id" value={editedUser.role_id} onChange={handleInputChange} /> : editedUser.role_id}</td>
      <td>{banned ? "Yes" : "No"}</td>
      <td>{isEditing ? <input type="text" name="ban_reason" value={editedUser.ban_reason} onChange={handleInputChange} /> : editedUser.ban_reason}</td>
      <td>
        {isEditing ? (
          <>
            <button onClick={handleSaveClick}>Save</button>
            <button onClick={handleCancelClick}>Cancel</button>
          </>
        ) : (
          <a href="#">
            <img src={edit_button} alt="Edit" style={{ width: "20px", height: "20px" }} onClick={handleEditClick} />
            <img src={delete_button} alt="Delete" style={{ width: "20px", height: "20px" }} onClick={() => setBanned(!banned)} />
          </a>
        )}
      </td>
    </tr>
  );
};

export default UsersTable;
