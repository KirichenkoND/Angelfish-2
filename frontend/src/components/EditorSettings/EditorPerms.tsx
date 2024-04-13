import React, { useEffect, useState } from "react";
import "./Editors.scss";
import SearchBar from "../../UI/SearchBar/SearchBar";
import {
  TPermissions,
  perms,
  useDeletePermissionsMutation,
  useGetPermissionsQuery,
  usePostPermissionsMutation,
} from "../../api/permissionsApi";
import { useGetCategoriesQuery } from "../../api/categoriesApi";
import { useGetRolesQuery } from "../../api/rolesApi";

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
  const {
    data: data1,
    isError: isError1,
    isLoading: isLoading1,
    isSuccess: isSuccess1,
  } = useGetCategoriesQuery();
  const {
    data: data2,
    isError: isError2,
    isLoading: isLoading2,
    isSuccess: isSuccess2,
  } = useGetRolesQuery();
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
      setPermissions(data ?? []);
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
      console.log(newPermission)
      const filteredObj = Object.fromEntries(
        Object.entries(newPermission).filter(([_, v]) => v !== "")
      );
      await addLog(filteredObj);
      setNewPermission({ category: "", person_uuid: "", role: "", room_id: 0 });
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
          <select
            name="speciality"
            id="speciality"
            value={newPermission.category}
            onChange={(e) => {
              setNewPermission({ ...newPermission, category: e.target.value });
            }}
            style={{ minWidth: "20vw", minHeight: "3vh" }}
          >
            <option key={0} value={""} disabled style={{display: 'none'}}>Категория</option>
            {isSuccess1 &&
              data1.map((category) => {
                return (
                  <option key={category} value={category}>
                    {category}
                  </option>
                );
              })}
          </select>

          <select
            name="speciality"
            id="speciality"
            value={newPermission.role}
            onChange={(e) => {
              setNewPermission({ ...newPermission, role: e.target.value });
            }}
            style={{ minWidth: "20vw", minHeight: "3vh" }}
          >
            <option key={0} value={""} disabled style={{display: 'none'}}>Роль</option>
            {isSuccess2 &&
              data2.map((role) => {
                return (
                  <option key={role} value={role}>
                    {role}
                  </option>
                );
              })}
          </select>
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
              {
                [
                  addTag('Category', permission.category),
                  addTag('Role', permission.role),
                  addTag('UUID', permission.person_uuid),
                  addTag('Room id', permission.room_id)
                ].filter(x => x.length != 0).join(', ')
              }
              
              <button onClick={() => DeletePermission(permission.person_uuid)}>
                Удалить
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

const addTag = (name: string, value: string | undefined) => {
  if (value) return `Category: ${value}`
  else return ''

}

export default EditorPerms;
