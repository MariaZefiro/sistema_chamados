import React from 'react';
import './style.css';
import BarChartIcon from '@mui/icons-material/BarChart';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ArticleIcon from '@mui/icons-material/Article';
import ConstructionIcon from '@mui/icons-material/Construction';

const MenuAdmin = () => {
    return (
        <div>
            <header>
                <div className="container">
                    <div className="header-left">
                        <h1>Bem vindo, <span className="user-name">Maria </span></h1>
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
                            <img src="/images/logo_fundo.png" alt="User Profile Picture" />
                            <p className="user-name">Maria Carolina Zefiro Couto</p>
                            <span className="user-options">Minha Conta | Logout</span>
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
                            <button className="all-departments">Todos Departamentos</button>
                            <button className="all-departments">CGR</button>
                            <button className="all-departments">Frota</button>
                            <button className="all-departments">RH</button>
                            <button className="all-departments">Jurídico</button>
                            <table>
                                <tr>
                                    <th>Número</th>
                                    <th>Messagem</th>
                                    <th>Departamento</th>
                                    <th>Autor</th>
                                    <th>Data</th>
                                </tr>
                                <tr>
                                    <td>#190824</td>
                                    <td>Monitor com problema</td>
                                    <td>CGR</td>
                                    <td>Fulano</td>
                                    <td>Hoje às 11:04</td>
                                </tr>
                            </table>
                            <span className="tickets-count">10 / Tickets</span>
                        </div>
                        <div className="section">
                            <h2>Meus Tickets</h2>

                        </div>
                    </div>
                </div>
                <div class='container-pai-open'>
                    <div class="container-open">
                        <div class="header-open">
                            <h1>#170824</h1>
                            <h2>Monitor com problema</h2>
                            <div class="flag-open"></div>
                        </div>
                        <div class="content-open">
                            <div class="item-open">
                                <h2>Departamento</h2>
                                <p><a href="#">CGR</a></p>
                            </div>
                            <div class="item-open">
                                <h2>Tags</h2>
                                <p><a href="#">None</a></p>
                            </div>
                            <div class="item-open">
                                <h2>Dono</h2>
                                <p><a href="#">None</a></p>
                            </div>
                        </div>
                        <div class="content-open">
                            <div class="item-open">
                                <h2>Autor</h2>
                                <p><a href="#">Supervisor Fulano</a></p>
                            </div>
                            <div class="item-open">
                                <h2>Status</h2>
                                <p><a href="#">Aberto</a></p>
                            </div>
                        </div>
                    </div>
                    <div class="chat-container">
                        <div class="message">
                            <img src="https://via.placeholder.com/40" alt="Avatar" />
                            <div class="message-content">
                                <div class="message-header">
                                    <span class="name">Supervisor Fulano</span>
                                    <span class="role">CGR</span>
                                    <span class="time">9 agosto 2024, 11:04</span>
                                </div>
                                <div class="message-body">
                                    <p>Prezados,</p>
                                    <p>Meu monitor se encontra com funcionamento prejudicado.</p>
                                    <p>Obrigado.</p>
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
            </main>
        </div>
    );
};

export default MenuAdmin;