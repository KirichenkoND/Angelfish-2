import React from "react";
import "./AccessTable.scss";
import SearchBar from "../../UI/SearchBar/SearchBar";
import { useGetAllLogsQuery } from "../../api/logsApi";
import { DNA } from "react-loader-spinner";

// TODO: Дописать поиск и обработку ошибки

const AccessTable: React.FC = () => {
  const { data, isError, isLoading, isSuccess } = useGetAllLogsQuery();
  if (isError) {
    return <>Ашыбка</>;
  }
  if (isLoading) {
    return (
      <>
        <DNA visible height={80} width={80} />;
      </>
    );
  }
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
            <th>Entered</th>
            <th>Allowed</th>
          </tr>
        </thead>
        <tbody>
          {isSuccess &&
            data
              .slice()
              .reverse()
              .slice(0, 10)
              .map((item, i) => (
                <tr key={i} className={item.allowed ? "" : "failed"}>
                  <td>{i}</td>
                  <td>{item.person_uuid}</td>
                  <td>{item.room_id}</td>
                  <td>{item.time}</td>
                  <td>{item.entered ? "Вход" : "Выход"}</td>
                  <td>{item.allowed ? "True" : "False"}</td>
                </tr>
              ))}
        </tbody>
      </table>
    </>
  );
};

export default AccessTable;
