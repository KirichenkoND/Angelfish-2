import React, { useEffect, useState } from "react";
import "./Editors.scss";
import { useDeleteRoleMutation, useGetRolesQuery, usePostRoleMutation } from "../../api/rolesApi";

const roles = ["admin", "none", "security", "service", "student", "teacher"];

const EditorRoles: React.FC = () => {
  const { data, isError, isLoading, isSuccess, refetch } =
    useGetRolesQuery(); // Добавляем refetch из useGetCategoriesQuery
  const [addCategories, setAddCategories] = useState<string>("");
  const [editCategories, setEditCategories] = useState<string[]>([]); // Изначально список пустой
//   const [newRole, setNewRole] = useState("");
  const [deleteLog] = useDeleteRoleMutation();
  const [addLog] = usePostRoleMutation();

  useEffect(() => {
    if (isSuccess) {
      setEditCategories(data ?? []); // Устанавливаем данные, если запрос успешен
    }
  }, [data, isSuccess]);

  if (isError) {
    return <>Ошибка</>;
  }

  if (isLoading) {
    return <></>;
  }

  const deleteRole = async (category: string) => {
    try {
      await deleteLog(category);
      setEditCategories((prevCategories) =>
        prevCategories.filter((item) => item !== category)
      );
    } catch (error) {
      console.error("Ошибка при удалении категории:", error);
    }
  };

  const addRole = async () => {
    try {
      await addLog(addCategories);
      setAddCategories(""); // Очищаем поле после успешного добавления
      // Обновляем данные вызовом refetch
      refetch();
    } catch (error) {
      console.error("Ошибка при добавлении категории:", error);
    }
  };
  
//   const addRole = (role: string) => {
//     console.log(`Добавлена роль: ${role}`);
//   };
//   const deleteRole = (role: string) => {
//     console.log(`Удалена роль: ${role}`);
//   };
  return (
    <>
      <div className="universal-editor">
        <div className="add-universal">
          <input
            type="text"
            value={addCategories}
            onChange={(e) => setAddCategories(e.target.value)}
            placeholder="Новая роль"
          />
          <button onClick={addRole}>Добавить</button>
        </div>
        <ul>
          {editCategories.map((role, index) => (
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
