import React, { useState } from "react";
import Input from "../../UI/Input/Input";
import Button from "../../UI/Button/Button";
import "./AccessEditorPage.scss"
const passId = 346534;

const AccessEditorPage: React.FC = () => {
    const [newPass, setNewPass] = useState("");
    const [passID, setPassID] = useState("");

    const setPass = () => {
        setPassID(newPass);
        setNewPass("")
    }
    return (
        <>
            <h1>Работа с пропусками</h1>
            <button onClick={() => setPassID(passId)}>Прочитать пропуск</button>
            {passID &&
                <div>
                    <h3>{passID}</h3>
                    <p>Назначить пропуск</p>
                    <div className="reboot-pass">
                        {`${passID} ->`}
                        <Input onChange={(e) => setNewPass(e.target.value)} value={newPass}></Input>
                        <Button onClick={setPass} text="Изменить"></Button>
                    </div>
                </div>
                }
        </>
    );
};

export default AccessEditorPage;