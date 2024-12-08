import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './style.css';
import Loader from "../Loader";
import config from "../../config";
import axios from 'axios';

const Login = () => {
    const backendIp = config.backend_ip;
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const cachedData = localStorage.getItem('userData');

            if (cachedData) {
                const data = JSON.parse(cachedData);
                if (data.tipo === 'colaborador') {
                    navigate('/MenuAdmin');
                } else if (data.tipo === 'usuario') {
                    navigate('/MenuUser');
                }
                return;
            }

            const response = await axios.post(`${backendIp}/api/login`, {
                usuario: login,
                senha: password
            });

            if (response.status === 200) {
                const data = response.data;
                localStorage.setItem('userData', JSON.stringify(data));

                if (data.tipo === 'colaborador') {
                    navigate('/MenuAdmin');
                } else if (data.tipo === 'usuario') {
                    navigate('/MenuUser');
                }
            } else {
                setErrorMessage(response.data.message || "Erro ao realizar login");
            }
        } catch (error) {
            setErrorMessage("Erro ao conectar com o servidor");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container-login">
            {isLoading ? (
                <Loader />
            ) : (
                <div className="card-login">
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <svg version="1.1" viewBox="0 0 2000 2000" width="300" height="200" xmlns="http://www.w3.org/2000/svg">
                            <path transform="translate(1012,565)" d="m0 0h11l8 6 6 9 3 9 6 37 8 38 5 20 4 26 1 13 2 1 2-6 10-22 7-15 6-14 3-10 9-17 8-16 8-12 7-9 10-6 9-1 9 2 5 5v2l5-1 11 4 31 16 10 6 12 9 25 5 18 2h18l10 2 9 2 18 1 7 1 3-1 1-3 11-7 16-7 5-4 11-4 16-2h9l19 3 16 6 11 6 9 7 7 7 10 13 8 14 5 16 8 32 6 16 2 13 1 14 11 40 5 28 3 25 3 43 1 21v20l-2 11-10 18-10 19-8 10-10 10-9 6h94l6 5v2h2l2-6 4-1h21l3 5 1 3 4-1 5-4 10-4h10l9 2 9 6 6 7 2 4v4h2l1-12 3-8 7-2 29 1 3 5 3 14 5-10 9-7 10-4h13l10 3 10 6 5 7 2 8 1 43v47l-2 18-6 8-6 5-11 4-7 1-13-3-5-3-3-5-2-1-1 5-2 4-3 1h-21l-3-3-2 3h-28l-3-2-2-4-4 2-6 4-10 2-14-3-12-8-2 8-1 1h-24l-3-4h-2l-2 4h-40l-12-1-3-6-2-2-5-1v2l5 1 3 6-2 1h-17l-5-1-2-6-2-27-1-42v-4h-4v19 3 55l-1 2-15 1h-13l-3-2-1-3-3-32v-44l-12-1-1 6v11l7 26 2 24v10l-2 4-2 1h-94l-1 24-4 16-3 13-3 38-4 29-2 16-5 9-9 10-7 6-12 12-13 9-11 7-15 5-27 4-16-3-9-4-22-12-14-8-8-8-8-12-8-21-3-21-1-12-3 5-9 16-6 14-4 10-6 8-7 5-8 2h-8l-9-2-19-7-16-8-10-7-5-6-4-2-13 2-21-2-5-2h-8l-8 5-11 6-17 9-14 4-7 1-8-4-6-7-8-14-1-1v24l-6 16-4 5-12 6-16 6-16 7-11 2-13-4-2 5-5 7-13 9-6 6h-2l-2 5-7 6-18 9-8 5-14 7-12 7-11 4-5 1h-9l-9-6-9-10-13-17-6-9h-6l-7 2h-11l-22-1-13-2-9-5-19-14-9-3-9-4-1-3-9 2h-14l-18-5-12-6-14-2h-10l-19 2-32 6h-7l-9 2h-18l-19-3-30-7-17-8-19-14-11-9-10-9-10-10-9-11-6-7-10-23-9-24-6-21-2-12-1-12v-21l2-17 5-22 7-19 17-34 9-13 9-11 9-10 12-8 8-7 9-7 14-9 21-9 20-6 13-3-5-15-4-24-2-14-3-12-2-16-2-29-3-39 1-12 5-10 9-8 9-5 29-8 30-7 20-3 18-1h7v-2l12-9 16-10 11-5 9-3 7-6 10-5 16-6 26-10 16-3h8l12 3 14 8 2-17 6-20 5-10 8-10 11-10 7-5 7-8 16-8 16-5 10-2h21l15 4 16 7 15 8 10 9 7 9 14 27 8 13 8 9 8 16 4 10h2l4-4 13-5 25-4 24-2-6-39-4-49-3-40v-18l3-8 7-6 12-5 20-3zm-2 17-39 5-9 3-2 3v12l8 59 8 42 3 15v15l7 23 6 30v18l-6 11-6 1-7-3-3-5-2-12-2-19-5-19-3-6-2-1-23 1-25 4-10 5-1 1 1 9 2 8v11l2 14v3l-10-19-9-13-10-18-9-22-6-9-11-17-6-14-5-10-9-10-9-8-13-8-11-5-8-2h-27l-16 4-13 7-8 8v2l-4 2-13 13-7 12-5 16-1 5v22l6 18 11 23 7 14 4 11 9 13 6 7 2 5-3 1h3l3 9 10 19 8 15 7 14 5 8 7 6 7 8 8 7 15 8 11 3h23l17-3 13-4 16-12 8-9 6-5 3-7 6-35 3-15 5 2 10 9 12 14 10 7 18 2h17l16-3 17-6 5-2 15 10 31 15 23 8 9 4 13 4 11 5 4-2 9-10 8-14 4-11 1-4v-9l-8-5-18-6-27-12h-2l3-9 12-22 13-26 5-5 7 1 13 4 12 7 15 6 8-1 8-9 8-16 2-7v-8l-4-8-13-8-23-11-7-4v-7l6-18 4-6h9l16 6 15 8 2 8 6 2 28 1-6 38-2 21 4 10v7l-6 9-2 12-3 35 1 8 2 3-1 6-5 11-1 4 1 15v16l-2 15v10l4 3 8 2 33 2h15l4-6 2-9 4-55 5-28h-2l-1-27 3-5 2-11 2-23 1-40 1-17 5-2h5l8 3 2 10 5 30 6 20 6 16 1 9v8l3 24 6 28 3 12 9 16 11 12 9 8 12 7 11 4 18 3 21 1 13-5 9-5 11-9 13-13 8-16 9-17 2-5v-12l-2-10-3-21-9-36-4-14v-10l-3-15-7-22-10-38-7-14-7-9-7-7-21-10-15-4h-24l-9 2-8 4-6 4-18 5-5 4-5 8-18-4-10-1-2 1h-6l-9-4-13-1-3 1-35-4-9-2-11-1-5-3-8-6-23-12-19-10-4-2h-4l-9-6-5-2-5 1-5 5-8 11-8 16-10 18-14 31-7 20-8 16-8 11-3 16-2 9-6 7v2l-4 1-2-15-7-21-1-6v-15l-3-24-11-51-3-21-3-27-2-9-5-6zm-50 124m523 0m-305 23v5l3-1-1-4zm-550 3-1 4h3l1-4zm681 5 4 18 2-1-1-7-4-10zm-698 3m29 0-16 4-19 7-21 9-15 11-10 2-28 13-1 2v14l-12-2h-26l-24 4-48 13-9 4-5 5-1 2v9l3 9 3 25 4 14 5 13 5 22 10 24 9 30 2 8 20 1 21 4 22 7 4 1-3-9-6-14-2-9 8-4 15-5 6-4 13-4 13-9 10-10 8-12 4-14v-7l7 11 6 9 6 13 5 15 9 19 10 13 9 13 8 15 6 13 3 5 5-2 9-3 10-1h18l13 2h6l1-2v-9l-3-11-10-18-10-16-23-46-8-13 1-5 5-2 9 3 10 9 9 17 11 17 5 5 4 6 5 16 8 17 9 14 1 1 11-1 3-2 3-19 3-6v-2l10-3 15-8 3-4-3-11-9-21-5-10-20-30-9-11-10-9-11-6-6-3h-2l4-16 2-5 1-11-2-6-4-11-4-12-5-9-16-12-5-7-5-9-7-7-10-6-8-2zm-31 2-4 3 1 3 5-1-1-5zm369 2 1 4zm-384 5 1 2 1-2zm4 0m-1 1m-10 1-5 2v1l7-1 3-2zm391 4v4l3 1-1-5zm-407 2m409 5 1 8h2l-1-5zm330 1m-2 1m-2 1m25 29v3l2 1-1-4zm-357 14 1 2zm358 13 2 3v-3zm1 42 1 2zm-10 11-2 2-3 28-5 5 3 6 1 24-3 19-1 10 14 12 8 9 5 8 8 25 36 1-5-5-8-7-8-8-10-14-8-14-3-12-6-32-6-28-3-19-3-10zm-117 14-9 8-8 2h-7l-14-3-1 3 3 35 2 3 22 6 11 6h2v-17l2-14v-18l-1-10zm-138 7 3 6 6 5-2-4-5-7zm-66 8-16 2-10 2-6 3-7 7-8 7-12 16-5 11-3 16-1 24v80l3 21 1 25-8-10-9-12-6-9-6-17-8-13-6-9-7-15-11-6-5-6-10-21-8-10-11-12-6-7-7-5-3-5-2-1-10 1-28 10-15 9-6 4v15l9 57 4 13 3 16 16 52 4 12 8 16 4 10 4 16 8 27 5 15 5 13 3 12 5 1 15-6 15-7 12-7 4-5 1-2v-13l-4-12v-6l10-6 10-5h5l9 12 10 16 9-1 16-7 8-4 10-7 9-6 18 3 9 2h17l18-6 9-5-3 9-1 9 8 7 10 5 22 7 8 2h6l5-5 4-6 8-18 20-41 6-12 4-15 6-15 7-10 11-20v31l-4 10-8 55v15l5 20 8 17 7 9 9 8 10 6 22 12 8 2 17-1 15-3 12-5 8-7 12-12 2-1v-2l4-2 15-15 3-11 5-23 3-26 3-30 5-19 1-23 4-35v-10l-4-16-5-12-7-13-11-12-8-6-16-8-18-5-10 1-28 3-9 3-4 2-6-8-8-5-20-10-4 1-10-4-5 1-9 12-4 6-5 12-8 16-6 14-5 15-12 21-14 27-9 19-2 7v4h-2v-42h-25l-7-1-5 4-10-1-8-2h-7l-2 3-1 42-1 15-2 6-6 2-10-1-5-4-3-6-1-4v-28l-1-4-1-14v-21l3-24 3-15v-12l-1-9v-21l5-5 5-3 6 1 6 3 1 2 2 23v20l2 8 13-1 5-1h13l5-3 3-1 9 5 14-1 1-1v-43l-2-21-5-12-7-12-13-13-14-8-9-3-12-2zm75 3 2 4h2l-2-4zm-308 3-2 5 4 1 2-1-1-4zm568 2m156 28 1 3v-3zm-115 2-1 3h2zm-16 6v6l2-4v-2zm125 1m-1 1m23 16v2l3-1zm-75 1m-1 1m-2 1-1 2 3-1zm-547 2-2 4 6-1-1-3zm266 2 1 3 2-1zm324 1m-27 1v2h2v-2zm-960 18m964 0-1 3h2zm-40 2v3h2l-1-3zm-497 4-11 14-5 5-1 5 7 10 3 9 6 9h3l1-6v-38l-1-8zm-461 3-22 1-22 3-15 4-21 8-22 11-9 6-22 22-11 13-11 17-7 10-8 17-3 10-5 32v30l5 33 5 17 10 21 10 15 8 9 8 7 12 11 8 7 8 6 13 8 12 5 17 6 13 3 8 1h25l20-3 24-6 13-2h20l12 3 19 9 8 2h29l12 6 9 2 15 10 10 7 8 2 31 1 5-3 10-13 9-11 8-10 4-6v-2h2l-2-10-12-27-5-5-16-11-12-8-3-9-9-9-2-4-4-17-11-13-12-12-6-9-6-12-5-19-5-37-3-20-10-19-7-11-11-14-15-15-11-8-20-12-17-8-15-5-19-4zm656 7-1 3 1 19 3-1 6-14-1-4-6-3zm-731 0-2 2h3zm189 2 1 8 3 1-1-5-2-4zm22 7-4 6v2h-2v2l-4 2-7 3 2 5 13 15 5-1 7-5-1-6-5-13-2-10zm84 3 1 2 1-2zm960 8-8 3-7 8-3 7v12l10 18 13 19 5 8 1 6h-5l-2-13-2-3-21 1v14l2 9 6 8 8 6 7 2h7l9-3 7-8 4-7 1-4v-9l-3-7-14-26-8-13-3-7h7l1 13 1 1h18l1-4v-12l-4-9-5-6-5-3-5-1zm109 0-8 3-6 5-4 9-1 4v60l2 9 9 10 8 4 3 1h7l10-3 8-6 6-12v-65l-3-8-4-5-9-5-6-1zm-1181 1-1 2h2zm787 0-1 1v101h43l1-20h-21l1-3v-12l-1-4h11l2-1 1-21-1-1-12-1-1-20h9l11-1v-17l-1-1zm49 0-1 2 7 27 3 16v13l-5 23-5 19v2h21l3-29v-5h2v15l1 17 1 2h23l-4-17-7-24-2-6v-8l9-30 4-17h-22l-2 6-1 25-2-1-2-19-1-10-1-1zm56 0-1 7v11l14 2v81l1 1h20l1-2v-81h13l1-1v-17l-1-1zm55 0-1 2 1 100h39l1-7v-12l-1-1-17-1v-12l1-6 10-1v-21l-11-2-1-20 19-1v-17l-1-1zm49 0-1 3v69l-3 3 1 3 2-1 1 25 19 1 1-29-1-12 3 3 4 10 7 25 1 2h16l1-2v-97l-1-3h-16l-1 1v39h-2l-3-11-7-23-3-6zm124 0-2 9-8 67-3 20v6h21l1-1v-18l8 1 1 17 1 1h19l-3-42-6-52-2-8zm-1013 1-11 2-5 6-6 4-18 7-10 5-8 7-14 7 1 4 8 18 2 2 4 2-3 2 4 17 1 3 9 3 7 3 1 3-10-2-6-4 1 11 2 20 5 17 7 14 17 17 7 11 3 11 3 10 11 10 4 7 18 13 10 8 6 10 7 16 5 19-1 12 3 1 21-10 12-8 12-9 11-3 6-5 3-7 8-3 3-7 4-1 4 1 7-9 7-16 2-8v-23l-4-18-6-11-11-15-12-23-9-19-5-11-10-19-4-10-11-11-8-7-5-6-5-12-5-10-10-9-9-4-6-2-7-1zm782 38 1 2zm98 4v2l4 1 2-2zm-91 9 2 2v-2zm-62 6-4 1v16h4l4-16zm151 4v2h3v-2zm-612 7m-148 33m788 3-1 4 2-1zm-88 8m-1 1-2 4 3-2zm-4 5m-323 15m1 1m1 1m-542 2v2l2-1zm547 51-5 3 4 1 3-4zm-495 34 1 2zm-1 5m488 0 1 2 1-2zm60 14-1 2h2zm17 0 1 3zm-21 1m-150 3 2 4 3 2-2-4zm5 6 1 3v-3zm2 3 1 2zm1 2m1 1 1 3v-3zm-63 3m65 0 2 4v-3zm3 4 2 4 11 14 1-2-9-12-4-4zm-212 11 1 2 3-1zm226 7m1 1m-720 24m206 11-1 3 3-1v-2zm244 10-1 4 2 2v-6z" fill="#040404" />
                            <path transform="translate(470,1040)" d="m0 0h14l13 4 12 7 10 8 9 9 10 21 1 3v11l-6 12-5 3-10 1 3 6 10 9 6 9 3 11 16 6 9 7 4 9 1 8-4 14-1 4 5 4 15 10 8 4-1 5-11 17-4-2-5-4-13-9-13-8-13-7-6-7v-15l-2-10-4-8-8-9-11-9-6-7-3-9 1-11 7-22 1-10-2-9-5-9-7-7-3-2h-6l2 6 9 11 3 7v10l-5 16-3 12 1 13 5 10 9 10 8 6v2l4 2 5 8 2 8v8l-2 10 7 6 21 14 15 11 15 10-2 5-10 15-4-2-11-8-14-10-10-9-11-7-8-5-4 2h-8l-11-4h-13l-12 5-14 8-12 4h-8l-9-2-6-4-4-4h-6l-9 3-10-1-8-4-7-8-2-4v-11l2-6-1-5-8-7-4-9v-13l4-9 7-7 17-13 7-7 2-5v-5l-5-1-5 8-11 10-12 9-7 7-3 4-1 6v18l4 10 4 7 1 4 1 15 4 10 7 8 11 5 3 1h15l7-1 3 1 4 4 7 3 5 1h10l12-3 27-14 3-1h8l8 4 4 3 7-2 4-1 8 4 11 8 11 9 13 9 11 7-1 4-7 8-4 6-11-7-21-14-13-9-3-2-5 1-6 5-1 2h-2v2l-11 8-8 4-8 2h-14l-11-4-8-5-18 4h-11l-17-4-17-7-12-8-8-8-7-10-4-10-1-7 3-9 1-4-9-13-5-11-2-8-1-11 1-11 6-15 9-13 11-10 10-5h2l1-15 4-10 8-11 2-3h2v-2l12-9 8-4 11-4 4-1h19l17 2 14-11 11-5zm-61 44-11 6-3 2v2l-4 2-2 4 16 5 9 7 4 8v12l-5 10-8 7-12 5-4 9v13l4 11 7 8 10 8 9 11 3 2h9l2-2-1-5-11-6-4-10-5-2-6-3-5-7-2-5v-12l4-6 10-4 9-8 5-10 1-5v-11l-4-10-7-8-10-6-2-1v-2l7-1 12 2 7 2 10-3h11l12 6 4-1-1-5-8-6-7-2h-11l-12 2-13-3zm103 29v2l2-1zm-54 10-5 7-3 9v8l3 8 6 7 3 2h6l-1-6-6-9-1-9 5-14-2-3zm-105 14v2h2v-2zm87 42-3 1 1 6 5 4 3 1 21 2 8 3 5-1-2-7-8-4-9-2-13-1z" fill="#040404" />
                            <path transform="translate(669,1091)" d="m0 0h7l8 3 10 13 8 15 13 23 5 9 12 18 12 20 9 19 4 12-1 9-4 7-5 4-8 2-5-5-13-24-4-7-1-5 2-1 7 1-4-2-7-1-7-14-12-21-10-16-10-17-8-11-9-13-4-11 2-4 6-2zm28 35v3zm-2 5m-1 1 1 2zm-13 1-3 3 2 1 3-3z" fill="#040404" />
                            <path transform="translate(1261,1030)" d="m0 0 9 1 4 4 1 4v21l-4 33-12 88-2 13-9 7-2 1h-7l-4-4-6-16 1-9 3-11v-10l-3-9 1-4 4-6 5-25 8-57 2-12 8-8z" fill="#040404" />
                            <path transform="translate(760,717)" d="m0 0h15l4 5 9 16 10 18 12 23 6 10 12 23 10 19 7 16 3 5-1 7-5 10-4 2-11-8-6-3-9-19-6-8-10-8v-9l-7-17-17-36-15-29-1-2v-6zm70 139 1 2 2-1z" fill="#030303" />
                            <path transform="translate(1395,701)" d="m0 0h9l8 19 5 18 9 42 16 72-1 7-6 8-2 1h-7l-5-5-3-4v-2l-4-2-3-7-2-14-4-13-4-8 1-3h2l-3-22-12-58-4-17 8-11zm22 84v2h2v-2zm4 7m-1 1 1 2zm-1 2m-1 1m-1 1 1 2zm-2 9-1 1v9h1l1-10zm-1 11v5h1v-5zm1 6 1 6 1-4zm2 6 1 6 1-4zm11 3v2l3-1z" fill="#040404" />
                            <path transform="translate(490,847)" d="m0 0 12 1 5 5 7 14 4 15-1 9-3 6-6 6-18 5-4-1-8-20-6-21v-9l5-6zm6 3-3 4 1 3 2-1 1-6z" fill="#030303" />
                            <path transform="translate(615,798)" d="m0 0h9l10 4 6 5 6 9 2 5 1 8-2 9-4 5-8 6-5-1-9-6-7-11-8-16-2-5 1-7 6-4zm23 30-2 2h3z" fill="#040404" />
                            <path transform="translate(645,1252)" d="m0 0 5 3 2 5-2 6-6 10-10 12-8 12-12 16-8 11-7 8-6 1-2-2v-6l5-10 13-18 7-10 8-10 10-13 8-12z" fill="#050505" />
                            <path transform="translate(842,1074)" d="m0 0 4 2 24 36 6 10 3 6-1 4-8 5-6 3-4-1-10-24-6-18-2-17z" fill="#040404" />
                            <path transform="translate(686,1296)" d="m0 0 3 1 2 7-2 8-7 11-8 10-8 11-7 10-4 2h-9l2-5 16-23 16-25z" fill="#070707" />
                            <path transform="translate(1746,1047)" d="m0 0h7v64l-1 1h-5l-1-1-1-9v-54z" fill="#1E1E1E" />
                            <path transform="translate(678,1283)" d="m0 0 5 1-6 12-20 30-7 12-11 12-5 5-4-1 2-6 7-7 10-14 6-10 5-9 4-5 13-19z" fill="#080808" />
                            <path transform="translate(656,1269)" d="m0 0 5 1-2 5-10 16-14 20-10 14-8 11-5 5h-4l1-6 10-13 13-18 9-13 10-14z" fill="#090909" />
                            <path transform="translate(667,1277)" d="m0 0h4l-1 5-9 13-13 22-12 17-9 10-3 3h-4l1-5 12-15 19-29 6-11z" fill="#060606" />
                            <path transform="translate(1694,1058)" d="m0 0h2l1 10v22l-5 1v-14z" fill="#222" />
                            <path transform="translate(1036,953)" d="m0 0 4 2 11 12 1 4-6-1-5-5-3-9z" fill="#080808" />
                            <path transform="translate(1114,695)" d="m0 0 3 2 1 6v10h-3l-3-5v-9z" fill="#141414" />
                            <path transform="translate(993,635)" d="m0 0 4 2 12 11v2l-6-1-9-8z" fill="#121212" />
                            <path transform="translate(995,939)" d="m0 0h2l-1 5-7 11-3 1-1-4z" fill="#0D0D0D" />
                            <path transform="translate(630,1070)" d="m0 0 5 1 5 3 7 3v3l-7-1-10-7z" fill="#161616" />
                            <path transform="translate(456,845)" d="m0 0h1l-1 9-4 10-3 1 1-8 4-10z" fill="#191919" />
                            <path transform="translate(1160,659)" d="m0 0h3v4l-11 7-5 1v-3l10-6z" fill="#1B1B1B" />
                            <path transform="translate(1144,691)" d="m0 0h4l-1 4-10 5h-4v-3l10-5z" fill="#0B0B0B" />
                            <path transform="translate(1175,658)" d="m0 0 3 1 2 5 1 7-4 1-2-4z" fill="#141414" />
                            <path transform="translate(1204,1133)" d="m0 0h11l1 4-2 1h-8l-2-1z" fill="#0C0C0C" />
                            <path transform="translate(690,1054)" d="m0 0h3l1 7-3 9h-2z" fill="#191919" />
                            <path transform="translate(1270,748)" d="m0 0h3l-1 5-8 8-3-1 3-5z" fill="#101010" />
                            <path transform="translate(1008,931)" d="m0 0 4 1 6 5 1 5-7-3-4-6z" fill="#101010" />
                            <path transform="translate(629,1087)" d="m0 0 2 1v8l-3 7h-2l1-13z" fill="#252525" />
                            <path transform="translate(1214,1037)" d="m0 0h3l-2 6-4 6-4 1 1-5 4-5z" fill="#121212" />
                            <path transform="translate(1276,685)" d="m0 0h3l-2 5-8 6h-2l1-4z" fill="#404040" />
                            <path transform="translate(1267,779)" d="m0 0h2l-1 6-6 6h-3v-3h2l2-4z" fill="#222" />
                            <path transform="translate(991,609)" d="m0 0 5 1 6 4 1 4-5-1-7-6z" fill="#080808" />
                            <path transform="translate(1350,721)" d="m0 0h2l-1 9-4 7h-1l1-8z" fill="#0E0E0E" />
                            <path transform="translate(664,973)" d="m0 0 3 1-8 9h-4l2-5z" fill="#080808" />
                            <path transform="translate(429,848)" d="m0 0 6 1 5 5v2l-5-1-6-5z" fill="#080808" />
                            <path transform="translate(1144,643)" d="m0 0 3 2 2 10-5-1z" fill="#030303" />
                            <path transform="translate(1382,814)" d="m0 0 4 1-10 5-4-1 1-3z" fill="#1B1B1B" />
                            <path transform="translate(961,971)" d="m0 0h2l-1 5-7 9h-2l2-5z" fill="#090909" />
                            <path transform="translate(732,913)" d="m0 0h2l-2 4-9 6h-3l2-4z" fill="#292929" />
                            <path transform="translate(845,1030)" d="m0 0 6 2 1 5-6-1-2-2z" fill="#101010" />
                            <path transform="translate(1148,1095)" d="m0 0h5l-1 5-5 1-2-1 1-4z" fill="#242424" />
                            <path transform="translate(1194,676)" d="m0 0h2v3l-5 4-6 1v-3z" fill="#2B2B2B" />
                            <path transform="translate(1129,670)" d="m0 0h2l2 7-1 5-3-2-1-8z" fill="#2B2B2B" />
                            <path transform="translate(667,1057)" d="m0 0 8 1 5 3v2l-6-1-7-4z" fill="#1E1E1E" />
                            <path transform="translate(1066,973)" d="m0 0h2l-1 5-4 6-4 2 2-5z" fill="#2C2C2C" />
                            <path transform="translate(860,786)" d="m0 0h2v2l-13 7-3-1 10-6z" fill="#3C3C3C" />
                            <path transform="translate(1248,770)" d="m0 0 3 1 3 5v4l-4-2-2-3z" fill="#111" />
                            <path transform="translate(1272,717)" d="m0 0h2l-1 4-5 5-3 1 1-4z" fill="#363636" />
                            <path transform="translate(707,1084)" d="m0 0 3 1-1 10-3-1v-9z" fill="#757575" />
                            <path transform="translate(1205,1110)" d="m0 0 7 2v3h-7l-1-4z" fill="#2B2B2B" />
                            <path transform="translate(1032,937)" d="m0 0 3 1-4 9-3-1 2-7z" fill="#7C7C7C" />
                            <path transform="translate(1042,932)" d="m0 0 8 2 1 4h-4l-5-4z" fill="#333" />
                            <path transform="translate(779,830)" d="m0 0h2l-1 5-4 3h-3l2-4z" fill="#3D3D3D" />
                            <path transform="translate(1190,1131)" d="m0 0h6v4h-7z" fill="#252525" />
                            <path transform="translate(1063,945)" d="m0 0h2l-1 5-2 3h-3l1-4z" fill="#262626" />
                            <path transform="translate(456,925)" d="m0 0h4v2l-8 3h-3l1-3z" fill="#141414" />
                            <path transform="translate(522,907)" d="m0 0 3 1-8 4h-5l2-3z" fill="#5C5C5C" />
                            <path transform="translate(443,826)" d="m0 0 3 1-3 8h-3l1-6z" fill="#262626" />
                            <path transform="translate(1127,722)" d="m0 0 3 1-5 4-7 1v-2z" fill="#4A4A4A" />
                            <path transform="translate(973,966)" d="m0 0 6 2 2 4-6-1z" fill="#1E1E1E" />
                            <path transform="translate(764,814)" d="m0 0h3l-2 5h-6l1-3z" fill="#151515" />
                            <path transform="translate(1013,619)" d="m0 0 2 1-2 6-4 2 1-5z" fill="#151515" />
                            <path transform="translate(462,836)" d="m0 0 5 3 3 4-5-1-4-4z" fill="#0C0C0C" />
                            <path transform="translate(1258,675)" d="m0 0 4 2 2 2v4l-4-2-2-3z" fill="#333" />
                            <path transform="translate(647,947)" d="m0 0h2l-1 3-4 2h-5l2-3z" fill="#0D0D0D" />
                            <path transform="translate(1364,817)" d="m0 0 2 2-5 4h-4l1-3z" fill="#171717" />
                            <path transform="translate(712,721)" d="m0 0h2v8l-2 3-1-1v-7z" fill="#353535" />
                            <path transform="translate(1292,707)" d="m0 0h2l-1 4-4 4h-3l1-3z" fill="#2B2B2B" />
                            <path transform="translate(1366,794)" d="m0 0 7 1-3 4-4-1z" fill="#222" />
                            <path transform="translate(1310,1117)" d="m0 0 5 1-1 4-4-1z" fill="#5A5A5A" />
                            <path transform="translate(766,838)" d="m0 0 2 1-5 4h-4l1-3z" fill="#3C3C3C" />
                            <path transform="translate(764,797)" d="m0 0 2 3-6 3-3-1z" fill="#474747" />
                            <path transform="translate(1218,1007)" d="m0 0h2l-2 6-3 3-2-1z" fill="#323232" />
                            <path transform="translate(1246,820)" d="m0 0 10 1 1 3-10-1h-2z" fill="#323232" />
                            <path transform="translate(1122,1128)" d="m0 0 4 1-1 4-4-1z" fill="#282828" />
                            <path transform="translate(673,869)" d="m0 0h2l-2 5-4 2 1-4z" fill="#414141" />
                            <path transform="translate(987,648)" d="m0 0h2l-1 6-1 2h-2l1-6z" fill="#4E4E4E" />
                            <path transform="translate(1468,794)" d="m0 0 4 1-5 3h-4l1-3z" fill="#5F5F5F" />
                            <path transform="translate(1254,706)" d="m0 0 3 1 3 6v2l-3-1-3-6z" fill="#797979" />
                            <path transform="translate(1444,764)" d="m0 0h4v3l-5 1-1-3z" fill="#101010" />
                            <path transform="translate(634,952)" d="m0 0 3 1-2 4h-3z" fill="#030303" />
                            <path transform="translate(533,899)" d="m0 0h3l1 3-4 2-1-3z" fill="#202020" />
                            <path transform="translate(685,850)" d="m0 0h2v5l-3 1-1-3z" fill="#2F2F2F" />
                            <path transform="translate(1270,830)" d="m0 0 7 1-1 2h-6z" fill="#111" />
                            <path transform="translate(801,1061)" d="m0 0h2v6l-3-1z" fill="#121212" />
                            <path transform="translate(659,1070)" d="m0 0 3 1-1 4-3-1z" fill="#131313" />
                            <path transform="translate(663,952)" d="m0 0h2l-1 3-6 2z" fill="#131313" />
                            <path transform="translate(1241,850)" d="m0 0 4 1 3 1v2l-5-1z" fill="#565656" />
                            <path transform="translate(1254,742)" d="m0 0 3 1 1 4-4-1z" fill="#242424" />
                            <path transform="translate(980,620)" d="m0 0h2l-1 5h-3z" fill="#676767" />
                            <path transform="translate(1197,1109)" d="m0 0 2 2-1 3h-3v-4z" fill="#4A4A4A" />
                            <path transform="translate(1248,837)" d="m0 0h5v3l-5-1z" fill="#141414" />
                            <path transform="translate(1357,796)" d="m0 0 2 1-1 5-2-1z" fill="#383838" />
                            <path transform="translate(1293,1145)" d="m0 0h6v2h-6z" fill="#414141" />
                            <path transform="translate(520,837)" d="m0 0 2 1-1 3h-3v-3z" fill="#BFBFBF" />
                            <path transform="translate(753,820)" d="m0 0h2l-1 4h-3z" fill="#171717" />
                            <path transform="translate(1355,769)" d="m0 0 3 1-1 3-3-1z" fill="#6B6B6B" />
                            <path transform="translate(1216,1097)" d="m0 0 3 1v2l-3 1z" fill="#474747" />
                            <path transform="translate(1044,992)" d="m0 0 3 1v3l-4-2z" fill="#303030" />
                            <path transform="translate(729,900)" d="m0 0 3 1-2 2-4-1z" fill="#303030" />
                            <path transform="translate(476,817)" d="m0 0 3 1-2 3h-2z" fill="#474747" />
                            <path transform="translate(1067,800)" d="m0 0 4 1-3 3z" fill="#303030" />
                            <path transform="translate(468,921)" d="m0 0 3 1-1 2-4-1z" fill="#1C1C1C" />
                            <path transform="translate(714,908)" d="m0 0h3l-1 3h-3z" fill="#353535" />
                            <path transform="translate(527,868)" d="m0 0h2v4h-3z" fill="#030303" />
                            <path transform="translate(1247,829)" d="m0 0h7l-3 2-4-1z" fill="#030303" />
                            <path transform="translate(1288,680)" d="m0 0 3 1-1 3h-2z" fill="#1C1C1C" />
                            <path transform="translate(1016,655)" d="m0 0 3 1v3l-3-1z" fill="#999" />
                            <path transform="translate(1292,1157)" d="m0 0 2 1-1 3h-2z" fill="#FEFEFE" />
                            <path transform="translate(864,1039)" d="m0 0h2l1 4-3-1z" fill="#565656" />
                            <path transform="translate(655,957)" d="m0 0 3 1-2 2-3-1z" fill="#565656" />
                            <path transform="translate(1454,797)" d="m0 0 2 1-1 3h-2z" fill="#3A3A3A" />
                            <path transform="translate(1373,779)" d="m0 0h2l-1 3h-3v-2z" fill="#727272" />
                            <path transform="translate(1194,1096)" d="m0 0 3 1-1 2-3-1z" fill="#414141" />
                            <path transform="translate(1203,1084)" d="m0 0h3l-1 3h-2z" fill="#222" />
                            <path transform="translate(1268,840)" d="m0 0 3 3v2h-2z" fill="#030303" />
                            <path transform="translate(742,809)" d="m0 0h3l-1 3h-2z" fill="#222" />
                            <path transform="translate(857,805)" d="m0 0h4v2h-4z" fill="#222" />
                            <path transform="translate(651,984)" d="m0 0 2 1-4 2v-2z" fill="#030303" />
                            <path transform="translate(1283,1144)" d="m0 0 4 2h-4z" fill="#030303" />
                            <path transform="translate(645,1121)" d="m0 0h2v3h-2z" fill="#030303" />
                            <path transform="translate(645,929)" d="m0 0h3v2h-3z" fill="#2C2C2C" />
                            <path transform="translate(1350,785)" d="m0 0h3v2h-3z" fill="#2C2C2C" />
                            <path transform="translate(1278,698)" d="m0 0 2 1-1 3z" fill="#808080" />
                            <path transform="translate(1196,653)" d="m0 0 3 1-4 1z" fill="#030303" />
                            <path transform="translate(1130,1099)" d="m0 0h2l-1 3z" fill="#FEFEFE" />
                            <path transform="translate(462,949)" d="m0 0 2 1v2h-2z" fill="#353535" />
                            <path transform="translate(641,940)" d="m0 0 2 1v2h-2z" fill="#353535" />
                            <path transform="translate(741,934)" d="m0 0 2 1-4 1z" fill="#999" />
                            <path transform="translate(608,909)" d="m0 0 3 1-3 1z" fill="#030303" />
                            <path transform="translate(694,861)" d="m0 0h2v2l-3-1z" fill="#030303" />
                            <path transform="translate(843,795)" d="m0 0 3 1-4 1z" fill="#FEFEFE" />
                            <path transform="translate(742,793)" d="m0 0h3v2l-3-1z" fill="#353535" />
                            <path transform="translate(1266,837)" d="m0 0h2l-1 3z" fill="#030303" />
                            <path transform="translate(1100,728)" d="m0 0 2 2-3-1z" fill="#FEFEFE" />
                            <path transform="translate(905,817)" d="m0 0" fill="#FEFEFE" />
                            <path transform="translate(904,814)" d="m0 0" fill="#FEFEFE" />
                            <path transform="translate(1366,781)" d="m0 0 2 1-2 1z" fill="#030303" />
                            <path transform="translate(906,821)" d="m0 0" fill="#FEFEFE" />
                            <path transform="translate(1210,1097)" d="m0 0" fill="#FEFEFE" />
                            <path transform="translate(743,933)" d="m0 0" fill="#030303" />
                            <path transform="translate(1279,857)" d="m0 0" fill="#FEFEFE" />
                            <path transform="translate(1257,841)" d="m0 0" fill="#030303" />
                        </svg>
                    </div>
                    <form onSubmit={handleLogin}>
                        <div className="field-login">
                            <svg className="input-icon-login" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                                <path d="M207.8 20.73c-93.45 18.32-168.7 93.66-187 187.1c-27.64 140.9 68.65 266.2 199.1 285.1c19.01 2.888 36.17-12.26 36.17-31.49l.0001-.6631c0-15.74-11.44-28.88-26.84-31.24c-84.35-12.98-149.2-86.13-149.2-174.2c0-102.9 88.61-185.5 193.4-175.4c91.54 8.869 158.6 91.25 158.6 183.2l0 16.16c0 22.09-17.94 40.05-40 40.05s-40.01-17.96-40.01-40.05v-120.1c0-8.847-7.161-16.02-16.01-16.02l-31.98 .0036c-7.299 0-13.2 4.992-15.12 11.68c-24.85-12.15-54.24-16.38-86.06-5.106c-38.75 13.73-68.12 48.91-73.72 89.64c-9.483 69.01 43.81 128 110.9 128c26.44 0 50.43-9.544 69.59-24.88c24 31.3 65.23 48.69 109.4 37.49C465.2 369.3 496 324.1 495.1 277.2V256.3C495.1 107.1 361.2-9.332 207.8 20.73zM239.1 304.3c-26.47 0-48-21.56-48-48.05s21.53-48.05 48-48.05s48 21.56 48 48.05S266.5 304.3 239.1 304.3z"></path></svg>
                            <input
                                autoComplete="off"
                                id="logemail"
                                placeholder="Login"
                                className="input-field-login"
                                name="logemail"
                                type="text"
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                                required
                            />
                        </div>
                        <div className="field-login">
                            <svg className="input-icon-login" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                                <path d="M80 192V144C80 64.47 144.5 0 224 0C303.5 0 368 64.47 368 144V192H384C419.3 192 448 220.7 448 256V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V256C0 220.7 28.65 192 64 192H80zM144 192H304V144C304 99.82 268.2 64 224 64C179.8 64 144 99.82 144 144V192z"></path></svg>
                            <input
                                autoComplete="off"
                                id="logpass"
                                placeholder="Senha"
                                className="input-field-login"
                                name="logpass"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button className="btn-login" type="submit">Login</button>
                        <p>{errorMessage}</p>
                        <p className="btn-link-login">* Faça login apenas se você for um de nossos usuários.</p>
                        <p className="btn-link-login">Se você não possui credenciais de acesso, por favor, entre em contato com os administradores do sistema para obter assistência.</p>
                    </form>
                </div >
            )}
        </div >
    );
};

export default Login;