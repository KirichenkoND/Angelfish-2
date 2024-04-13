import React, { useEffect, useState } from "react";
import "./Editors.scss";
import {
    TRooms,
  useDeleteRoomsMutation,
  useGetRoomQuery,
  usePostRoomMutation,
} from "../../api/roomsApi";


const EditorRooms: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, isError, isLoading, isSuccess, refetch } = useGetRoomQuery();
  const [rooms, setRooms] = useState<TRooms>([]);
  const [newRoom, setNewRoom] = useState({ category: "", floor: 0, name: "" });
  const [deleteLog] = useDeleteRoomsMutation();
  const [addLog] = usePostRoomMutation();

  useEffect(() => {
    if (isSuccess) {
      setRooms(data ?? []); // Устанавливаем данные, если запрос успешен
    }
  }, [data, isSuccess]);

  if (isError) {
    return <>Ошибка</>;
  }

  if (isLoading) {
    return <></>;
  }

  const DeleteRoom = async (roomName: string) => {
    try {
      await deleteLog(roomName);
      setRooms(prevCategories => prevCategories.filter(item => item.name !== roomName));
    } catch (error) {
      console.error("Ошибка при удалении категории:", error);
    }
  };

  const AddRoom = async () => {
    try {
      await addLog(newRoom);
      setNewRoom({category: "", floor: 0, name: "" }); // Очищаем поле после успешного добавления
      // Обновляем данные вызовом refetch
      refetch();
    } catch (error) {
      console.error("Ошибка при добавлении категории:", error);
    }
  };

  return (
    <>
      <div className="universal-editor">
        <div className="add-universal">
          <input
            type="text"
            value={newRoom.name}
            onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
            placeholder="Название комнаты"
          />
          <input
            type="number"
            value={newRoom.floor}
            onChange={(e) =>
              setNewRoom({ ...newRoom, floor: Number(e.target.value) })
            }
            placeholder="Этаж"
          />
          <input
            type="text"
            value={newRoom.category}
            onChange={(e) =>
              setNewRoom({ ...newRoom, category: e.target.value })
            }
            placeholder="Категория"
          />
          <button onClick={AddRoom}>Добавить</button>
        </div>
        <ul>
          {rooms.map((room, index) => (
            <li key={index}>
              {`${room.name}, ${room.category}, Этаж: ${room.floor}`}
              <button onClick={() => DeleteRoom(room.name)}>Удалить</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default EditorRooms;
