import React, { useEffect, useState } from "react";
import Input from "../../UI/Input/Input";
import Button from "../../UI/Button/Button";
import "./AccessEditorPage.scss";
import { usePatchPeopleMutation } from "../../api/peopleApi";
import {toast} from 'react-toastify';

const AccessEditorPage: React.FC = () => {
    
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [editUUID, { isSuccess, isError, isLoading }] =
    usePatchPeopleMutation();
  const notify = () => toast.success("Changed uuid");
  const setPass = () => {
    editUUID({ uuid: newPass });
  };
  useEffect(() => {
    notify()
    setOldPass("");
    setNewPass("");
  }, [isSuccess])
  return (
    <>
      <h1>Работа с пропусками</h1>
      <h3>Назначить пропуск</h3>
      <div>
        <div className="reboot-pass">
          <Input
            onChange={(e) => setOldPass(e.target.value)}
            value={oldPass}
            placeholder="Старый пропуск"
          ></Input>
          {`->`}
          <Input
            onChange={(e) => setNewPass(e.target.value)}
            placeholder="Новый пропуск"
            value={newPass}
          ></Input>
          <Button onClick={setPass} text="Изменить"></Button>
        </div>
      </div>
    </>
  );
};

export default AccessEditorPage;
