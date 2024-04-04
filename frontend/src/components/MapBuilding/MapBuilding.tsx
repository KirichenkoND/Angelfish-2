import React, { useState } from "react";
import './MapBuilding.scss';

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
    const filteredData = mockData.filter(item => item.floor === currentFloor);
    const floors = [...new Set(mockData.map(item => item.floor))];

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
                    {filteredData.map((room, index) => (
                        <div key={room.name + index} className={`room ${index % 2 === 0 ? 'even' : 'odd'}`}>
                            <span className="room-name">{room.name}</span>
                            <span className="room-category">{room.category}</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default MapBuilding;
