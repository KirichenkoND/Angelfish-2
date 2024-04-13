import React, { useState } from "react";
import './MapBuilding.scss';
import { useGetRoomQuery } from "../../api/roomsApi";
import Popup from "../Popup/Popup";
import { useGetLogsQuery } from "../../api/logsApi";
import { DNA } from "react-loader-spinner";


const MapBuilding: React.FC = () => {
    const [currentFloor, setCurrentFloor] = useState(1);
    // const filteredData = mockData.filter(item => item.floor === currentFloor);
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
                    {isSuccess && <FloorsMF
                        propfloors={[...new Set(data.map(item => item.floor))]}
                        setCurrentFloor={setCurrentFloor}
                        currentFloor={currentFloor}
                    />
                    }
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

interface FloorsMFProps {
    propfloors: number[];
    setCurrentFloor: (x: number) => void;
    currentFloor: number;
}

const FloorsMF: React.FC<FloorsMFProps> = ({ propfloors, setCurrentFloor, currentFloor }) => {
    return (
        propfloors.map(floor => (
            <button
                key={floor}
                className={`floor-button ${currentFloor === floor ? 'active' : ''}`}
                onClick={() => setCurrentFloor(floor)}
            >
                {floor} этаж
            </button>
        ))
    )
}

const CabinetInfo: React.FC<CabinetInfoProps> = ({ room_id }) => {
    const { data, isLoading, isError, isSuccess } = useGetLogsQuery(room_id);

    if (isError) {
        return <>Ошибка</>;
    }

    if (isLoading) {
        return <><DNA /></>;
    }

    return (
        <div style={{ overflowY: "auto", maxHeight: '65vh' }}>
            <h3>Логи</h3>
            <table className="AccessTable">
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>UUID</th>
                        <th>Room ID</th>
                        <th>Allowed</th>
                        <th>Entered</th>
                    </tr>
                </thead>
                <tbody>
                    {isSuccess && data.map((log, index) => (
                        <tr key={index}>
                            <td>{log.time}</td>
                            <td>{log.person_uuid}</td>
                            <td>{log.room_id}</td>
                            <td>{log.allowed ? 'Yes' : 'No'}</td>
                            <td>{log.entered ? 'Yes' : 'No'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MapBuilding;
