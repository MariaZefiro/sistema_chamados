import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './style.css';
import Loader from "../Loader";

const Login = () => {
    const navigate = useNavigate();
    const [login, setLogin] = useState();
    const [password, setPassword] = useState();
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="container-login">
            {isLoading ? (
                <Loader />
            ) : (
                <div className="card-login">
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <svg id="Content" style={{ width: '225px', padding: '30px' }} fill='white' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 636.1 226.02"><defs><style></style></defs><path class="cls-1" d="M580.63,189c-16.85,0-29.41-4.7-37.46-12.34l61.22-33.48c21.94-12,31.52-25.46,31.52-47.76,0-10.72-4.13-41.29-63.3-41.29-73.13,0-84.45,66.59-84.45,97.15a73.74,73.74,0,0,0,1.41,14.32l-28,15.84c-10.15,5.75-14.93,7.56-19,7.56-9.77,0-13.36-7.86-11.85-16.44l14.13-79.9H492l6.74-37H451.36l6.55-37H413.45l-6.53,37.05H319.36c-39.29,0-58.31,26.22-58.31,53,0,14.94,6.49,27.41,23.81,37.86L324,170a9.91,9.91,0,0,1,4.63,10.2A10.6,10.6,0,0,1,318.18,189H195.29c-16.85,0-29.42-4.7-37.46-12.34L219,143.15c21.94-12,31.52-25.46,31.52-47.76,0-10.72-4.13-41.29-63.3-41.29-73.13,0-84.45,66.59-84.45,97.15a73,73,0,0,0,1.42,14.32l-28,15.84c-10.15,5.75-14.93,7.56-19,7.56-9.76,0-13.36-7.86-11.84-16.44L75.83,0H31.37L.77,173.55C-4.06,200.93,14.24,226,44.8,226c19.63,0,33.06-5.65,55.11-17.71l19.73-10.79c14.54,17.21,37.89,28.5,67.62,28.5H311.72c44.17,0,63.47-28.15,63.47-51.89,0-20.06-8.64-28.48-26-38.93l-38.9-23.48a10.28,10.28,0,0,1,5.31-19.09h84.74l-14.26,80.92c-4.83,27.38,13.47,52.47,44,52.47,19.64,0,33.07-5.65,55.11-17.71L505,197.52c14.54,17.21,37.89,28.5,67.62,28.5h56.95L636.1,189Zm-397-97.78c18.34,0,22.21,5.59,22.21,10.19,0,6.33-3.07,8.46-13.36,14.28L147.64,141C149.2,119.47,156.52,91.19,183.65,91.19Zm385.35,0c18.34,0,22.2,5.59,22.2,10.19,0,6.33-3.06,8.46-13.35,14.28L533,141C534.54,119.47,541.86,91.19,569,91.19Z" /></svg>
                    </div>
                    <form>
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
                        <p className="btn-link-login">* Faça login apenas se você for um de nossos administradores autorizados.</p>
                        <p className="btn-link-login">Se você não possui credenciais de acesso, por favor, entre em contato com os administradores do sistema para obter assistência.</p>
                    </form>
                </div >
            )}
        </div >
    );
};

export default Login;