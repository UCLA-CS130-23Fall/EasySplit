import React from "react";
import { useParams } from "react-router-dom";
import "./index.css";

interface Params {
  id: string;
}

const UserPage: React.FC = () => {
  const { id } = useParams<Params>();

  return (
    <>
      <h1>User {id}</h1>
    </>
  );
};

export default UserPage;
