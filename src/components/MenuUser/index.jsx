import React, { useState, useEffect } from "react";
import "./style.css";
import { useNavigate } from 'react-router-dom';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import config from "../../config";

const MenuUser = () => {
    const backendIp = config.backend_ip;
    const [userType, setUserType] = useState(null);
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState(null);
    const [userSector, setUserSector] = useState("");
    const [tickets, setTickets] = useState([]);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const limitePagina = 10;
    const navigate = useNavigate();

    useEffect(() => {
        const cachedData = localStorage.getItem('userData');
        if (cachedData) {
            const data = JSON.parse(cachedData);
            if (data.tipo !== 'usuario') {
                navigate('/MenuAdmin');
            } else {
                setUserType(data.tipo);
                setUserName(data.nome.split(' ')[0]);
                setUserId(data.id);
                setUserSector(data.setor);
            }
        } else {
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        if (userId) {
            fetchTickets();
        }
    }, [userId, backendIp]);

    const fetchTickets = async () => {
        try {
            const response = await fetch(`${backendIp}/api/list_chamado_usuario/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setTickets(data.chamados);
            } else {
                console.error("Erro ao buscar os chamados");
            }
        } catch (error) {
            console.error("Erro ao conectar ao servidor:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userData');
        navigate('/');
    };

    const [formData, setFormData] = useState({
        userId: null,
        sector: "",
        category: "",
        subCategory: "",
        title: "",
        description: "",
    });

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            userId: userId,
            sector: userSector,
        }));
    }, [userId, userSector]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${backendIp}/api/add_chamado`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const result = await response.json();
                fetchTickets();
                setFormData({
                    category: "",
                    subCategory: "",
                    title: "",
                    description: "",
                });
                alert('Chamado criado com sucesso!')
            } else {
                const error = await response.json();
                alert(error.message || 'Erro ao enviar chamado');
            }
        } catch (err) {
            alert('Erro ao conectar ao servidor');
        }
    };

    const subCategoryOptions = {
        Hardware: ["Problema físico", "Configuração de dispositivos", "Conexões"],
        Software: ["Erro de software", "Instalação", "Atualização"],
    };

    const totalPaginas = Math.ceil(tickets.length / limitePagina);

    const ticketsExibidos = tickets.slice(
        (paginaAtual - 1) * limitePagina,
        paginaAtual * limitePagina
    );

    const handleNextPage = () => {
        if (paginaAtual < totalPaginas) {
            setPaginaAtual((prevPage) => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (paginaAtual > 1) {
            setPaginaAtual((prevPage) => prevPage - 1);
        }
    };

    return (
        <div className="container-user">
            <header className="header-user">
                <h1>Portal de Suporte </h1>
                <p>Abra chamados, leia artigos e acompanhe seus chamados.</p>
            </header>
            <main className="main-user">
                <section className="form-section">
                    <h2 style={{ margin: '0px', display: 'flex', paddingBottom: '10px' }}>
                        Olá <span className="user-name">{userName}</span>, abra um chamado
                        <div style={{ marginLeft: '15px' }}>
                            <button onClick={handleLogout} className="logout-button">
                                Logout
                            </button>
                        </div>
                    </h2>
                    <form onSubmit={handleFormSubmit} className="form-user">
                        <label htmlFor="userId">Usuário</label>
                        <input
                            type="text"
                            id="userId"
                            name="userId"
                            value={userName}
                            readOnly
                        />

                        <label htmlFor="sector">Setor</label>
                        <input
                            type="text"
                            id="sector"
                            name="sector"
                            value={userSector}
                            readOnly
                        />

                        <label htmlFor="category">Tipo de Problema</label>
                        <select
                            name="category"
                            id="category"
                            value={formData.category}
                            onChange={handleInputChange}
                        >
                            <option value="">Selecione</option>
                            <option value="Hardware">Hardware</option>
                            <option value="Software">Software</option>
                        </select>

                        {formData.category && (
                            <>
                                <label htmlFor="subCategory">Categoria Específica</label>
                                <select
                                    name="subCategory"
                                    id="subCategory"
                                    value={formData.subCategory}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Selecione</option>
                                    {subCategoryOptions[formData.category].map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </>
                        )}

                        <label htmlFor="title">Título</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            placeholder="Resumo do problema"
                            onChange={handleInputChange}
                            value={formData.title}
                        />

                        <label htmlFor="description">Descrição</label>
                        <textarea
                            id="description"
                            name="description"
                            rows="4"
                            placeholder="Descreva seu problema"
                            onChange={handleInputChange}
                            value={formData.description}
                        ></textarea>

                        <button type="submit">Enviar Chamado</button>
                    </form>
                </section>
                <section className="articles-section">
                    <h2>Artigos</h2>
                    <ul className="articles-user">
                        <li>
                            <a href="https://tecnoblog.net/389108/como-configurar-dispositivos-inteligentes-na-rede-wi-fi/" target="_blank" rel="noopener noreferrer">
                                Como configurar dispositivos IoT na rede Wi-Fi
                            </a>
                        </li>
                        <li>
                            <a href="https://www.tecmundo.com.br/software/1955-como-resolver-problemas-comuns-no-windows.htm" target="_blank" rel="noopener noreferrer">
                                Soluções comuns para erros no Windows
                            </a>
                        </li>
                        <li>
                            <a href="https://www.oficinadanet.com.br/post/16646-erro-de-rede-windows" target="_blank" rel="noopener noreferrer">
                                Como corrigir erros de rede no Windows
                            </a>
                        </li>
                        <li>
                            <a href="https://canaltech.com.br/seguranca/dicas-para-evitar-vazamentos-de-dados/" target="_blank" rel="noopener noreferrer">
                                Melhores práticas para evitar vazamentos de dados
                            </a>
                        </li>
                        <li>
                            <a href="https://blog.kaspersky.com.br/como-identificar-seu-dispositivo-com-um-antivirus-eficaz/11543/" target="_blank" rel="noopener noreferrer">
                                Como identificar e proteger dispositivos contra ameaças
                            </a>
                        </li>
                    </ul>
                </section>
                <section className="tickets-section">
                    <h2>Seus Chamados</h2>
                    {tickets.length > 0 ? (
                        <>
                            <table className="tickets-user">
                                <thead>
                                    <tr>
                                        <th>Número</th>
                                        <th>Título</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ticketsExibidos.map((ticket) => (
                                        <tr key={ticket.numero}>
                                            <td>{ticket.numero}</td>
                                            <td>{ticket.titulo}</td>
                                            <td
                                                className={`status-${ticket.status.toLowerCase() === "aberto"
                                                    ? "open"
                                                    : "resolved"
                                                    }`}
                                            >
                                                {ticket.status}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="paginacao">
                                <NavigateBeforeIcon onClick={handlePrevPage} disabled={paginaAtual === 1} style={{ cursor: 'pointer' }} />
                                <span style={{ fontSize: '13px', display: 'flex', alignItems: 'center', margin: '0 8px' }}>
                                    Página {paginaAtual} de {totalPaginas}
                                </span>
                                <NavigateNextIcon onClick={handleNextPage} disabled={paginaAtual === totalPaginas} style={{ cursor: 'pointer' }} />
                            </div>
                        </>
                    ) : (
                        <p>Nenhum chamado encontrado.</p>
                    )}
                </section>
            </main>
        </div>
    );
};

export default MenuUser;