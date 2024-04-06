import React, { useState } from "react";
import "./UsersTable.scss";
import SearchBar from "../../UI/SearchBar/SearchBar";
import edit_button from "../../assets/edit_button.svg";
import delete_button from "../../assets/delete_button.svg";
import { TPeople, useGetPeopleQuery } from "../../api/peopleApi";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Button,
} from "@mui/material";
import { DNA } from "react-loader-spinner";

const UsersTable = () => {
  const { data, isError, isSuccess, isLoading } = useGetPeopleQuery();
  const [editedIndex, setEditedIndex] = useState(-1);
  const [isSaving, setIsSaving] = useState(false);
  const [editedData, setEditedData] = useState<TPeople | undefined>(data);

  if (isLoading) {
    return <DNA visible height={80} width={80} />;
  }

  if (isError) {
    return <>Ошибка</>;
  }

  const handleFieldChange = (e, fieldName, rowIndex) => {
    const newData = [...editedData];
    newData[rowIndex][fieldName] = e.target.value;
    setEditedData(newData);
  };

  const handleEditClick = (index) => {
    setEditedIndex(index); // Установка индекса редактируемой строки
  };

  const handleSaveChanges = (index) => {
    setIsSaving(true); // Устанавливаем состояние сохранения
    // Здесь можете добавить логику сохранения изменений по индексу
    setTimeout(() => {
      setIsSaving(false);
      setEditedIndex(-1); // Завершаем редактирование, сбрасываем индекс
    }, 1000); // Пример задержки 1 секунда для симуляции сохранения
  };

  const handleDeleteClick = (index) => {
    // Здесь можете добавить логику удаления записи по индексу
    const newData = [...editedData];
    newData.splice(index, 1);
    setEditedData(newData);
  };

  return (
    <>
      <SearchBar />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Middle Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Banned</TableCell>
              <TableCell>Ban Reason</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isSuccess && data.map((row, rowIndex) => (
                <TableRow key={row.uuid}>
                  <TableCell>
                    {editedIndex === rowIndex ? (
                      <TextField
                        value={row.first_name}
                        onChange={(e) =>
                          handleFieldChange(e, "first_name", rowIndex)
                        }
                      />
                    ) : (
                      row.first_name
                    )}
                  </TableCell>
                  <TableCell>
                    {editedIndex === rowIndex ? (
                      <TextField
                        value={row.last_name}
                        onChange={(e) =>
                          handleFieldChange(e, "last_name", rowIndex)
                        }
                      />
                    ) : (
                      row.last_name
                    )}
                  </TableCell>
                  <TableCell>
                    {editedIndex === rowIndex ? (
                      <TextField
                        value={row.middle_name}
                        onChange={(e) =>
                          handleFieldChange(e, "middle_name", rowIndex)
                        }
                      />
                    ) : (
                      row.middle_name
                    )}
                  </TableCell>
                  <TableCell>
                    {editedIndex === rowIndex ? (
                      <TextField
                        value={row.role}
                        onChange={(e) =>
                          handleFieldChange(e, "role", rowIndex)
                        }
                      />
                    ) : (
                      row.role
                    )}
                  </TableCell>
                  <TableCell>
                    {editedIndex === rowIndex ? (
                      <TextField
                        value={row.banned}
                        onChange={(e) =>
                          handleFieldChange(e, "banned", rowIndex)
                        }
                      />
                    ) : (
                      row.banned
                    )}
                  </TableCell>
                  <TableCell>
                    {editedIndex === rowIndex ? (
                      <TextField
                        value={row.ban_reason}
                        onChange={(e) =>
                          handleFieldChange(e, "ban_reason", rowIndex)
                        }
                      />
                    ) : (
                      row.ban_reason
                    )}
                  </TableCell>
                  <TableCell>
                    {editedIndex === rowIndex ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleSaveChanges(rowIndex)}
                        disabled={isSaving}
                      >
                        {isSaving ? "Сохранение..." : "Сохранить"}
                      </Button>
                    ) : (
                      <>
                        <img
                          src={edit_button}
                          alt="Edit"
                          style={{
                            width: "20px",
                            height: "20px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleEditClick(rowIndex)}
                        />
                        <img
                          src={delete_button}
                          alt="Delete"
                          style={{
                            width: "20px",
                            height: "20px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleDeleteClick(rowIndex)}
                        />
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default UsersTable;
