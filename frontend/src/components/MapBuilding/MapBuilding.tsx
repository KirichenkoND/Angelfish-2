import React, { useState } from "react";
import './MapBuilding.scss';
import { useGetRoomQuery } from "../../api/roomsApi";
import Popup from "../Popup/Popup";
import { useGetLogsQuery } from "../../api/logsApi";

const mockData = [
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

const MapBuilding: React.FC = () => {
    const [currentFloor, setCurrentFloor] = useState(1);
    // const filteredData = mockData.filter(item => item.floor === currentFloor);
    const floors = [...new Set(mockData.map(item => item.floor))];
    const { data, isLoading, isError, isSuccess } = useGetRoomQuery();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const openPopup = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);
    if (isError) {
        return <>Ошибка</>;
    }

    if (isLoading) {
        return <></>;
    }

    return (
        <>
            <div className="map-building">
                <div className="floor-switcher">
                    {floors.map(floor => (
                        <button
                            key={floor}
                            className={`floor-button ${currentFloor === floor ? 'active' : ''}`}
                            onClick={() => setCurrentFloor(floor)}
                        >
                            {floor} этаж
                        </button>
                    ))}
                </div>
                <div className="map">
                    {isSuccess && data.filter(item => item.floor === currentFloor).map((room, index) => (
                        <>
                            <div key={room.name + index} className={`room ${index % 2 === 0 ? 'even' : 'odd'}`} onClick={openPopup}>
                                <span className="room-name">{room.name}</span>
                                <span className="room-category">{room.category}</span>
                            </div>
                            <Popup children={<CabinetInfo room_id={room.id} />} isOpen={isPopupOpen} onClose={closePopup} />
                        </>
                    ))}
                </div>

            </div>
        </>
    );
};

interface CabinetInfoProps {
    room_id: number;
}

const CabinetInfo: React.FC<CabinetInfoProps> = ({ room_id }) => {
    const { data, isLoading, isError, isSuccess } = useGetLogsQuery(room_id);

    if (isError) {
        return <>Ошибка</>;
    }

    if (isLoading) {
        return <></>;
    }

    return (
        <div>
            {isSuccess && data.map((info, i) => {
                return (
                    <div key={i}>
                        <p>{info.time}</p>
                        <p>{info.allowed}</p>
                        <p>{info.entered}</p>
                        <p>{info.person_uuid}</p>
                        <p>{info.room_id}</p>
                    </div>
                )
            })}
        </div>
    );
};

export default MapBuilding;
