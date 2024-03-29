import React from "react";
import backArrow from "../../assets/arrow-ios-back-svgrepo-com.svg";
import { useNavigate } from "react-router-dom";
import './BackButton.scss'

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <>
      <button onClick={() => navigate("/")} className="back-button">
        <img src={backArrow} alt="back" className=""/>
      </button>
    </>
  );
};

export default BackButton;
