import React, { useEffect, useState } from 'react';
import './style.css';
import BarChartIcon from '@mui/icons-material/BarChart';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ArticleIcon from '@mui/icons-material/Article';
import ConstructionIcon from '@mui/icons-material/Construction';
import { useNavigate } from 'react-router-dom';
import config from "../../config";

const MenuAdmin = () => {
    const backendIp = config.backend_ip;
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const [chamados, setChamados] = useState([]);
    const [colaboradores, setColaboradores] = useState([]);
    const [setorFiltro, setSetorFiltro] = useState('');
    const [ticketSelecionado, setTicketSelecionado] = useState(null);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [selecionados, setSelecionados] = useState([]);
    const [statusEdicao, setStatusEdicao] = useState('');
    const [prioridadeEdicao, setPrioridadeEdicao] = useState('');

    useEffect(() => {
        const cachedData = localStorage.getItem('userData');
        if (cachedData) {
            const data = JSON.parse(cachedData);
            if (data.tipo !== 'colaborador') {
                navigate('/MenuUser');
            } else {
                setUserData(data);
            }
        } else {
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        fetchChamados();
        fetchColaboradores();
    }, [setorFiltro]);

    const fetchChamados = async () => {
        try {
            const response = await fetch(`${backendIp}/api/list_chamados?setor=${setorFiltro}`);
            const data = await response.json();
            setChamados(data.chamados);
        } catch (error) {
            console.error('Erro ao buscar chamados:', error);
        }
    };

    const fetchColaboradores = async () => {
        try {
            const response = await fetch(`${backendIp}/api/list_colaboradores`);
            const data = await response.json();
            setColaboradores(data.colaboradores);
        } catch (error) {
            console.error('Erro ao buscar colaboradores:', error);
        }
    };

    const handleFilterChange = (setor) => {
        setSetorFiltro(setor);
    };

    const handleLogout = () => {
        localStorage.removeItem('userData');
        navigate('/');
    };

    const getGreeting = () => {
        if (!userData) return 'Bem vindo!';
        const { nome } = userData;
        const primeiroNome = nome.split(' ')[0];
        return (
            <>
                Bem-vindo, <span className="user-name">{primeiroNome}</span>
            </>
        );
    };

    const handleTicketClick = (ticket) => {
        if (ticketSelecionado && ticketSelecionado.id === ticket.id) {
            setTicketSelecionado(null);
        } else {
            setTicketSelecionado(ticket);
        }
    };

    const entrarModoEdicao = () => {
        if (ticketSelecionado) {
            setStatusEdicao(ticketSelecionado.status);
            setPrioridadeEdicao(ticketSelecionado.prioridade);
            setSelecionados(ticketSelecionado.colaboradores || []);
            setModoEdicao(true);
        }
    };


    const sairModoEdicao = () => {
        setModoEdicao(false);
    };

    const handleChange = (event) => {
        const { options } = event.target;
        const values = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                values.push(options[i].value);
            }
        }
        setSelecionados(values);
    };

    const handleStatusChange = (event) => setStatusEdicao(event.target.value);
    const handlePrioridadeChange = (event) => setPrioridadeEdicao(event.target.value);

    const salvarEdicao = async () => {
        try {
            const response = await fetch(`${backendIp}/api/edit_chamado`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: ticketSelecionado.id,
                    status: statusEdicao,
                    prioridade: prioridadeEdicao,
                    colaboradores: selecionados,
                }),
            });

            if (response.ok) {
                const atualizado = await response.json();
                setChamados((prevChamados) =>
                    prevChamados.map((chamado) =>
                        chamado.id === atualizado.id ? atualizado : chamado
                    )
                );
                sairModoEdicao();
            } else {
                console.error('Erro ao salvar edição');
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    };


    return (
        <div>
            <header>
                <div className="container">
                    <div className="header-left">
                        <h1>{getGreeting()}</h1>
                    </div>
                    <div className="header-right">
                        <div className="language-selector">
                            <span className="flag"></span>
                            <span className="lang">pt-br</span>
                        </div>
                    </div>
                </div>
            </header>
            <main>
                <div className="container">
                    <div className="sidebar">
                        <div className="user-info">
                            <img src="/images/logo_fundo.png" alt="User Profile" />
                            <p className="user-name">{userData?.nome}</p>
                            <span className="user-options">
                                Minha Conta | <button className="button-logout" onClick={handleLogout}>Logout</button>
                            </span>
                        </div>
                        <nav className="navigation">
                            <ul>
                                <li>
                                    <a href="#" className="nav-item">
                                        <BarChartIcon />
                                        <span>Dashboard</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="nav-item active">
                                        <ConfirmationNumberIcon />
                                        <span>Tickets</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="nav-item">
                                        <ArticleIcon />
                                        <span>Artigos</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="nav-item">
                                        <ConstructionIcon />
                                        <span>Configurações</span>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <div className="content">
                        <div className="section tickets">
                            <h2>Novos Tickets</h2>
                            <p>Aqui você pode visualizar todos os tickets que não estão atribuídos a ninguém.</p>
                            <button className="all-departments" onClick={() => handleFilterChange('')}>Todos Departamentos</button>
                            {[
                                'Administração', 'CGR', 'Call Center', 'Comunicação', 'Desenvolvimento', 'Diretoria',
                                'Engenharia', 'Expansão', 'Estoque', 'Frota', 'Jurídico', 'Logística', 'Loja',
                                'Operacional', 'Patrimônio', 'Projetos', 'Recursos Humanos', 'TIC'
                            ].map((sector) => (
                                <button
                                    key={sector}
                                    className="all-departments"
                                    onClick={() => handleFilterChange(sector)}
                                >
                                    {sector}
                                </button>
                            ))}
                            <table>
                                <thead>
                                    <tr style={{ backgroundColor: '#009373', color: 'white' }}>
                                        <th>Prioridade</th>
                                        <th>Número</th>
                                        <th>Mensagem</th>
                                        <th>Departamento</th>
                                        <th>Autor</th>
                                        <th>Data</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {chamados.map(chamado => (
                                        <tr key={chamado.id}>
                                            <td>{chamado.prioridade}</td>
                                            <td>{chamado.numero}</td>
                                            <td>{chamado.titulo}</td>
                                            <td>{chamado.setor}</td>
                                            <td>{chamado.usuario_nome}</td>
                                            <td>{chamado.data}</td>
                                            <td><a style={{ textDecoration: 'underline #009373', cursor: 'pointer', color: '#009373' }} onClick={() => handleTicketClick(chamado)}>Abrir</a></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <span className="tickets-count">{chamados.length} / Tickets</span>
                        </div>
                        <div className="section">
                            <h2>Meus Tickets</h2>

                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className={`container-pai-open ${ticketSelecionado ? 'open' : ''}`}>
                        {ticketSelecionado && (
                            <>
                                {!modoEdicao ? (
                                    <div>
                                        <div className="container-open">
                                            <div className="header-open">
                                                <h1>{ticketSelecionado.numero}{' '}<a style={{ textDecoration: 'underline #009373', cursor: 'pointer', color: '#009373', fontWeight: 'normal' }} onClick={() => entrarModoEdicao()}>Editar</a></h1>
                                                <h2>{ticketSelecionado.titulo}</h2>
                                                <div className="flag-open"></div>
                                            </div>
                                            <div className="content-open">
                                                <div className="item-open">
                                                    <h2>Departamento</h2>
                                                    <p><a>{ticketSelecionado.setor}</a></p>
                                                </div>
                                                <div className="item-open">
                                                    <h2>Tags</h2>
                                                    <p><a>None</a></p>
                                                </div>
                                                <div className="item-open">
                                                    <h2>Colaborador(es)</h2>
                                                    <p><a>None</a></p>
                                                </div>
                                            </div>
                                            <div className="content-open">
                                                <div className="item-open">
                                                    <h2>Autor</h2>
                                                    <p><a>{ticketSelecionado.usuario_nome}</a></p>
                                                </div>
                                                <div className="item-open">
                                                    <h2>Status</h2>
                                                    <p><a>Aberto</a></p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="chat-container">
                                            <div class="message">
                                                <img src="https://via.placeholder.com/40" alt="Avatar" />
                                                <div class="message-content">
                                                    <div class="message-header">
                                                        <span class="name">{ticketSelecionado.usuario_nome}</span>
                                                        <span class="role">{ticketSelecionado.setor}</span>
                                                        <span class="time">{ticketSelecionado.data}</span>
                                                    </div>
                                                    <div class="message-body">
                                                        <p>{ticketSelecionado.descricao}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="message">
                                                <img src="https://via.placeholder.com/40" alt="Avatar" />
                                                <div class="message-content">
                                                    <div class="message-header">
                                                        <span class="name">Maria Carolina Zefiro Couto</span>
                                                        <span class="role">TI</span>
                                                        <span class="time">9 Agosto 2024, 11:20</span>
                                                    </div>
                                                    <div class="message-body">
                                                        <p>Prezados,</p>
                                                        <p>Após verificar os cabos HDMI, foi detectado que o cabo estava com defeito. Após realizra a troca o monitor retornou o funcionamento normal.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="container-open2">
                                        <h2>Editar Chamado</h2>
                                        <form className='form-edit'>
                                            <label htmlFor="status">Status</label>
                                            <select className='select-edit' id="status" defaultValue={ticketSelecionado.status} value={statusEdicao} onChange={handleStatusChange}>
                                                <option value="AdminisAbertotração">Aberto</option>
                                                <option value="Fechado">Fechado</option>
                                                <option value="Em Andamento">Em Andamento</option>
                                                <option value="Espera">Espera</option>
                                            </select>

                                            <label htmlFor="prioridade">Prioridade</label>
                                            <select className='select-edit' id="prioridade" defaultValue={ticketSelecionado.prioridade} value={prioridadeEdicao} onChange={handlePrioridadeChange}>
                                                <option value="Alta">Alta</option>
                                                <option value="Média">Média</option>
                                                <option value="Baixa">Baixa</option>
                                            </select>

                                            <label htmlFor="colaboradores">Colaboradores</label>
                                            <select
                                                className="select-edit"
                                                id="colaboradores"
                                                multiple
                                                value={selecionados}
                                                onChange={handleChange}
                                            >
                                                {colaboradores.map((colaborador) => (
                                                    <option key={colaborador.id} value={colaborador.id}>
                                                        {colaborador.nome}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="edit-buttons">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        salvarEdicao();
                                                        sairModoEdicao();
                                                    }}
                                                >
                                                    Salvar
                                                </button>
                                                <button type="button" onClick={sairModoEdicao}>
                                                    Cancelar
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MenuAdmin;