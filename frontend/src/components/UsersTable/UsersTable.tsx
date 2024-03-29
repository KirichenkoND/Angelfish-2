import React, { useState } from "react";
import "./UsersTable.scss";
import SearchBar from "../../UI/SearchBar/SearchBar";
import edit_button from "../../assets/edit_button.svg";
import delete_button from "../../assets/delete_button.svg";

const initialData = [
  {
    ID: 111,
    Lastname: "Иванов",
    Firstname: "Иван",
    Middlename: "Иванович",
    Date_Birth: "01.01.2002",
    Active: true,
    CategoryID: 0,
  },
  {
    ID: 222,
    Lastname: "Петров",
    Firstname: "Петр",
    Middlename: "Петрович",
    Date_Birth: "02.02.2003",
    Active: false,
    CategoryID: 1,
  },
  {
    ID: 333,
    Lastname: "Пиванов",
    Firstname: "Пиван",
    Middlename: "Петрович",
    Date_Birth: "02.02.2003",
    Active: false,
    CategoryID: 2,
  },
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
    ID: "",
    Lastname: "",
    Firstname: "",
    Middlename: "",
    Date_Birth: "",
    Active: "",
    CategoryID: "",
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
              "ID",
              "Lastname",
              "Firstname",
              "Middlename",
              "Date_Birth",
              "Active",
              "CategoryID",
            ].map((column) => (
              <th key={column} onClick={() => handleSort(column)}>
                <span>{column}</span>
                <input
                  type="text"
                  value={filters[column]}
                  onChange={(e) => updateFilter(column, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  placeholder={`Filter ${column}`}
                  style={{
                    marginLeft: "10px",
                    padding: "2px",
                    fontSize: "small",
                  }}
                />
              </th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((user) => (
            <UserRow user={user} />
          ))}
        </tbody>
      </table>
    </>
  );
};

const UserRow = ({ user }) => {
  const [active, setActive] = useState(user.Active);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    Lastname: user.Lastname,
    Firstname: user.Firstname,
    Middlename: user.Middlename,
    Date_Birth: user.Date_Birth,
    CategoryID: user.CategoryID,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({
      ...editedUser,
      [name]: value,
    });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setEditedUser({
      Lastname: user.Lastname,
      Firstname: user.Firstname,
      Middlename: user.Middlename,
      Date_Birth: user.Date_Birth,
      CategoryID: user.CategoryID,
    });
    setIsEditing(false);
  };

  return (
    <tr key={user.ID} className={active ? "" : "failed"}>
      <td>{user.ID}</td>
      <td>
        {isEditing ? (
          <input
            type="text"
            name="Lastname"
            value={editedUser.Lastname}
            onChange={handleInputChange}
          />
        ) : (
          editedUser.Lastname
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="text"
            name="Firstname"
            value={editedUser.Firstname}
            onChange={handleInputChange}
          />
        ) : (
          editedUser.Firstname
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="text"
            name="Middlename"
            value={editedUser.Middlename}
            onChange={handleInputChange}
          />
        ) : (
          editedUser.Middlename
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="text"
            name="Date_Birth"
            value={editedUser.Date_Birth}
            onChange={handleInputChange}
          />
        ) : (
          editedUser.Date_Birth
        )}
      </td>
      <td>{active ? "Да" : "Нет"}</td>
      <td>
        {isEditing ? (
          <input
            type="text"
            name="CategoryID"
            value={editedUser.CategoryID}
            onChange={handleInputChange}
          />
        ) : (
          editedUser.CategoryID
        )}
      </td>
      <td>
        {isEditing ? (
          <>
            <button onClick={handleSaveClick}>Сохранить</button>
            <button onClick={handleCancelClick}>Отмена</button>
          </>
        ) : (
          <a href="#">
            <img
              src={edit_button}
              alt="Edit"
              style={{ width: "20px", height: "20px" }}
              onClick={handleEditClick}
            />
            <img
              src={delete_button}
              alt="Delete"
              style={{ width: "20px", height: "20px" }}
              onClick={() => setActive(!active)}
            />
          </a>
        )}
      </td>
    </tr>
  );
};

export default UsersTable;
