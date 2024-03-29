import React from 'react';
import { DNA } from "react-loader-spinner";

const NotFound: React.FC = () => {
    return (
        <>
            <center><h1>404 Not Found</h1></center>
            <hr></hr>
            <center>Bumba</center>
            <DNA
                visible
                height={80}
                width={80}
                
            />
        </>
    );
};

export default NotFound;