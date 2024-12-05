import { io } from "socket.io-client";
import config from "./config";

const backendIp = config.backend_ip; 

const socket = io(backendIp, {
    transports: ["websocket"],
    reconnectionAttempts: 5,
    reconnectionDelay: 3000,
});

export default socket;
