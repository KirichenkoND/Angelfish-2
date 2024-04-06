import React, { useState, useEffect } from "react";
import "./Editors.scss";
import SearchBar from "../../UI/SearchBar/SearchBar";
import { useGetCategoriesQuery, useDeleteCategoriesMutation, usePostCategoriesMutation } from "../../api/categoriesApi";

const EditorCategories: React.FC = () => {
  const { data, isError, isLoading, isSuccess, refetch } = useGetCategoriesQuery(); // Добавляем refetch из useGetCategoriesQuery
  const [addCategories, setAddCategories] = useState<string>("");
  const [editCategories, setEditCategories] = useState<string[]>([]); // Изначально список пустой
  const [deleteLog] = useDeleteCategoriesMutation();
  const [addLog] = usePostCategoriesMutation();

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

  const deleteCategory = async (category: string) => {
    try {
      await deleteLog(category);
      setEditCategories(prevCategories => prevCategories.filter(item => item !== category));
    } catch (error) {
      console.error("Ошибка при удалении категории:", error);
    }
  };

  const addCategory = async () => {
    try {
      await addLog(addCategories);
      setAddCategories(""); // Очищаем поле после успешного добавления
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
            value={addCategories}
            onChange={(e) => setAddCategories(e.target.value)}
            placeholder="Новая категория"
          />
          <button onClick={addCategory}>Добавить</button>
        </div>
        <ul>
          {editCategories.map((category, index) => (
            <li key={index}>
              {category}
              <button onClick={() => deleteCategory(category)}>Удалить</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default EditorCategories;
