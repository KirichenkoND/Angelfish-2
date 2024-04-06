import React, { useEffect, useState } from "react";
import "./Editors.scss";
import SearchBar from "../../UI/SearchBar/SearchBar";
import {
  TPermissions,
  useDeletePermissionsMutation,
  useGetPermissionsQuery,
  usePostPermissionsMutation,
} from "../../api/permissionsApi";

const Permissions = [
  {
    category: "common",
    person_uuid: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    role: "student",
    room_id: 101,
  },
  {
    category: "lecture hall",
    person_uuid: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    role: "admin",
    room_id: 102,
  },
];

const EditorPerms: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, isError, isLoading, isSuccess, refetch } =
    useGetPermissionsQuery();
  const [permissions, setPermissions] = useState<TPermissions>([]);
  const [deleteLog] = useDeletePermissionsMutation();
  const [addLog] = usePostPermissionsMutation();
  const [newPermission, setNewPermission] = useState({
    category: "",
    person_uuid: "",
    role: "",
    room_id: 0,
  });
  useEffect(() => {
    if (isSuccess) {
      setPermissions(data ?? []); // Устанавливаем данные, если запрос успешен
    }
  }, [data, isSuccess]);

  if (isError) {
    return <>Ошибка</>;
  }

  if (isLoading) {
    return <></>;
  }

  const DeletePermission = async (permission: string) => {
    try {
      await deleteLog(permission);
      setPermissions((prevCategories) =>
        prevCategories.filter((item) => item.person_uuid !== permission)
      );
    } catch (error) {
      console.error("Ошибка при удалении категории:", error);
    }
  };

  const AddPermission = async () => {
    try {
      await addLog(newPermission);
      setNewPermission({ category: "", person_uuid: "", role: "", room_id: 0 }); // Очищаем поле после успешного добавления
      // Обновляем данные вызовом refetch
      refetch();
    } catch (error) {
      console.error("Ошибка при добавлении категории:", error);
    }
  };

  return (
    <>
      <SearchBar />
      <div className="universal-editor">
        <div className="add-universal">
          <input
            type="text"
            value={newPermission.category}
            onChange={(e) =>
              setNewPermission({ ...newPermission, category: e.target.value })
            }
            placeholder="Категория"
          />
          <input
            type="text"
            value={newPermission.role}
            onChange={(e) =>
              setNewPermission({ ...newPermission, role: e.target.value })
            }
            placeholder="Роль"
          />
          <input
            type="text"
            value={newPermission.person_uuid}
            onChange={(e) =>
              setNewPermission({
                ...newPermission,
                person_uuid: e.target.value,
              })
            }
            placeholder="Person UUID"
          />
          <input
            type="number"
            value={newPermission.room_id}
            onChange={(e) =>
              setNewPermission({
                ...newPermission,
                room_id: Number(e.target.value),
              })
            }
            placeholder="Room ID"
          />
          <button onClick={AddPermission}>Добавить</button>
        </div>
        <ul>
          {permissions.map((permission, index) => (
            <li key={index}>
              {`Category: ${permission.category}, Role: ${permission.role}, UUID: ${permission.person_uuid}, Room ID: ${permission.room_id}`}
              <button onClick={() => DeletePermission(permission.person_uuid)}>Удалить</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default EditorPerms;
