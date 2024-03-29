import React from 'react';
import "./AccessTable.scss";
import SearchBar from '../../UI/SearchBar/SearchBar';

const data = [
    { ID: 0, CardID: 222, RoomID: 333, AccessTimeStamp: "12.03.2024 12:00", AccessResult: true },
    { ID: 1, CardID: 111, RoomID: 444, AccessTimeStamp: "13.03.2024 12:00", AccessResult: false },
    { ID: 2, CardID: 333, RoomID: 222, AccessTimeStamp: "14.03.2024 12:00", AccessResult: true },
    { ID: 3, CardID: 444, RoomID: 111, AccessTimeStamp: "15.03.2024 12:00", AccessResult: false },
    { ID: 4, CardID: 555, RoomID: 666, AccessTimeStamp: "16.03.2024 12:00", AccessResult: true },
    { ID: 5, CardID: 666, RoomID: 555, AccessTimeStamp: "17.03.2024 12:00", AccessResult: false },
    { ID: 6, CardID: 777, RoomID: 888, AccessTimeStamp: "18.03.2024 12:00", AccessResult: true },
    { ID: 7, CardID: 888, RoomID: 777, AccessTimeStamp: "19.03.2024 12:00", AccessResult: false },
    { ID: 8, CardID: 999, RoomID: 111, AccessTimeStamp: "20.03.2024 12:00", AccessResult: true },
    { ID: 9, CardID: 111, RoomID: 999, AccessTimeStamp: "21.03.2024 12:00", AccessResult: false },
    { ID: 10, CardID: 222, RoomID: 333, AccessTimeStamp: "22.03.2024 12:00", AccessResult: true },
    { ID: 11, CardID: 111, RoomID: 444, AccessTimeStamp: "23.03.2024 12:00", AccessResult: false },
    { ID: 12, CardID: 333, RoomID: 222, AccessTimeStamp: "24.03.2024 12:00", AccessResult: true },
    { ID: 13, CardID: 444, RoomID: 111, AccessTimeStamp: "25.03.2024 12:00", AccessResult: false },
    { ID: 14, CardID: 555, RoomID: 666, AccessTimeStamp: "26.03.2024 12:00", AccessResult: true },
    { ID: 15, CardID: 666, RoomID: 555, AccessTimeStamp: "27.03.2024 12:00", AccessResult: true },
    { ID: 16, CardID: 777, RoomID: 888, AccessTimeStamp: "28.03.2024 12:00", AccessResult: true },
    { ID: 17, CardID: 888, RoomID: 777, AccessTimeStamp: "29.03.2024 12:00", AccessResult: true },
    { ID: 18, CardID: 999, RoomID: 111, AccessTimeStamp: "30.03.2024 12:00", AccessResult: false },
    { ID: 19, CardID: 111, RoomID: 999, AccessTimeStamp: "31.03.2024 12:00", AccessResult: false },
    { ID: 20, CardID: 222, RoomID: 333, AccessTimeStamp: "01.04.2024 12:00", AccessResult: true },
    { ID: 21, CardID: 111, RoomID: 444, AccessTimeStamp: "02.04.2024 12:00", AccessResult: false },
    { ID: 22, CardID: 333, RoomID: 222, AccessTimeStamp: "03.04.2024 12:00", AccessResult: true },
];

const AccessTable: React.FC = () => {
    return (
        <>
            <SearchBar />
            <table className="AccessTable">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>CardID</th>
                        <th>RoomID</th>
                        <th>AccessTimeStamp</th>
                        <th>AccessResult</th>
                    </tr>
                </thead>
                <tbody>
                    {data.slice().reverse().slice(0, 10).map((item) => (
                        <tr key={item.ID} className={item.AccessResult ? "" : "failed"}>
                            <td>{item.ID}</td>
                            <td>{item.CardID}</td>
                            <td>{item.RoomID}</td>
                            <td>{item.AccessTimeStamp}</td>
                            <td>{item.AccessResult ? "True" : "False"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default AccessTable;