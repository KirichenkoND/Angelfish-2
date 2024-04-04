import React, { useState } from "react";
import './Editors.scss';

const Rooms = [
    { category: "Лекционная", floor: 1, name: "101" },
    { category: "Лаборатория", floor: 1, name: "102" },
    { category: "Лекционная", floor: 1, name: "103" },
    { category: "Лаборатория", floor: 1, name: "104" },
    { category: "Лекционная", floor: 1, name: "10133" },
    { category: "Лаборатория", floor: 1, name: "1022" },
    { category: "Лекционная", floor: 1, name: "1034" },
    { category: "Лаборатория", floor: 1, name: "1044" },
    { category: "Лекционная", floor: 1, name: "1011" },
    { category: "Лаборатория", floor: 1, name: "1023" },
    { category: "Лекционная", floor: 1, name: "1035" },
    { category: "Лаборатория", floor: 1, name: "1045" },
    { category: "Лекционная", floor: 2, name: "201" },
    { category: "Лаборатория", floor: 2, name: "202" },
    { category: "Лекционная", floor: 3, name: "301" },
    { category: "Лаборатория", floor: 3, name: "302" },
];

const EditorRooms: React.FC = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [rooms, setRooms] = useState(Rooms);
    const [newRoom, setNewRoom] = useState({ category: "", floor: 0, name: "" });

    const AddRoom = () => {
        console.log(`Добавлена комната: ${JSON.stringify(newRoom)}`);
    };

    const DeleteRoom = (roomName: string) => {
        console.log(`Удалена комната: ${roomName}`);
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
                        onChange={(e) => setNewRoom({ ...newRoom, floor: Number(e.target.value) })}
                        placeholder="Этаж"
                    />
                    <input
                        type="text"
                        value={newRoom.category}
                        onChange={(e) => setNewRoom({ ...newRoom, category: e.target.value })}
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
