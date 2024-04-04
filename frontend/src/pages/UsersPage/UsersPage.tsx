import React, { useState } from "react";
import UsersTable from "../../components/UsersTable/UsersTable";
import Button from "../../UI/Button/Button";

import Popup from "../../components/Popup/Popup";
import Input from "../../UI/Input/Input";

const UsersPage: React.FC = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const openPopup = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);

    const [role_idState, setrole_idState] = useState<number | 0>(0);

    return (
        <>
            <h1>Список пользователей</h1>
            <UsersTable />
            <Button text="Добавить пользователя" onClick={openPopup} />
            <Popup isOpen={isPopupOpen} onClose={closePopup}>
                <form>
                    <h2>Новый пользователь</h2>
                    <hr />
                    <label>Имя:</label>
                    <Input type="text" id="firstName" name="firstName" />
                    <label>Фамилия:</label>
                    <Input type="text" id="lastName" name="lastName" />
                    <label>Отчество:</label>
                    <Input type="text" id="lastName" name="lastName" />
                    <label>Роль в системе:</label>
                    <select
                        name="role_id"
                        id="role_id"
                        value={role_idState}
                        onChange={(e) => {
                            setrole_idState(parseInt(e.target.value));
                        }}
                        style={{ minWidth: "20vw", minHeight: "3vh" }}
                    >
                        <option value={0} disabled>
                            {" "}
                        </option>
                        <option value={1}>student</option>
                        <option value={2}>teacher</option>
                        <option value={3}>admin</option>
                        <option value={4}>security</option>
                        <option value={5}>service</option>
                        <option value={6}>none</option>
                    </select>
                    <hr />
                    <Button type="submit" text="Добавить"></Button>
                </form>
            </Popup>
        </>
    );
};

export default UsersPage;