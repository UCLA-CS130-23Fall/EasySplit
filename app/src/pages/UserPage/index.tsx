import React from "react";
import { useParams } from "react-router-dom";
import "./index.css";

import Bmob from "hydrogen-js-sdk";

interface Params {
	id: string;
	[key: string]: string | undefined; // Index signature
}

const UserPage: React.FC = () => {
	const { id } = useParams<Params>();

	const current = Bmob.User.current();

	console.log(current);

	return (
		<>
			<h1>User {id}</h1>
		</>
	);
};

export default UserPage;
