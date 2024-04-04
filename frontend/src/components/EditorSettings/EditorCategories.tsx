import React from "react";
import './Editors.scss';
import SearchBar from "../../UI/SearchBar/SearchBar";

const categories = [
    "common",
    "laboratory",
    "lecture hall",
    "office",
    "service"
];

const EditorCategories: React.FC = () => {
    const newCategory = "";
    return (
        <>
            <SearchBar />
            <div className="universal-editor">
                <div className="add-universal">
                    <input
                        type="text"
                        value={newCategory}
                        onChange={() => { }}
                        placeholder="Новая категория"
                    />
                    <button onClick={() => { }}>Добавить</button>
                </div>
                <ul>
                    {categories.map((category, index) => (
                        <li key={index}>
                            {category}
                            <button onClick={() => { }}>Удалить</button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default EditorCategories;
