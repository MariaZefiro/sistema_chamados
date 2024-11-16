import React, { useState, useEffect } from "react";
import "./style.css";
import { useNavigate } from 'react-router-dom';

const MenuUser = () => {
    const [userType, setUserType] = useState(null);  
    const navigate = useNavigate();

    useEffect(() => {
        const cachedData = localStorage.getItem('userData');
        if (cachedData) {
            const data = JSON.parse(cachedData);
            if (data.tipo !== 'usuario') {
                navigate('/MenuAdmin');
            } else {
                setUserType(data.tipo);
            }
        } else {
            navigate('/');
        }
    }, [navigate]);

    const [formData, setFormData] = useState({
        category: "",
        subCategory: "",
        title: "",
        description: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log("Chamado enviado:", formData);
    };

    const subCategoryOptions = {
        hardware: ["Problema físico", "Configuração de dispositivos", "Conexões"],
        software: ["Erro de software", "Instalação", "Atualização"],
    };

    return (
        <div className="container-user">
            <header className="header-user">
                <h1>Portal de Suporte</h1>
                <p>Abra chamados, leia artigos e acompanhe seus chamados.</p>
            </header>

            <main className="main-user">
                <section className="form-section">
                    <h2>Abra um Chamado</h2>
                    <form onSubmit={handleFormSubmit} className="form-user">
                        <label htmlFor="category">Tipo de Problema</label>
                        <select
                            name="category"
                            id="category"
                            value={formData.category}
                            onChange={handleInputChange}
                        >
                            <option value="">Selecione</option>
                            <option value="hardware">Hardware</option>
                            <option value="software">Software</option>
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
                        />

                        <label htmlFor="description">Descrição</label>
                        <textarea
                            id="description"
                            name="description"
                            rows="4"
                            placeholder="Descreva seu problema"
                            onChange={handleInputChange}
                        ></textarea>

                        <button type="submit">Enviar Chamado</button>
                    </form>
                </section>
                <section className="articles-section">
                    <h2>Artigos</h2>
                    <ul className="articles-user">
                        <li>
                            <a href="#">Como configurar seu dispositivo IoT</a>
                        </li>
                        <li>
                            <a href="#">Soluções comuns para erros de rede</a>
                        </li>
                        <li>
                            <a href="#">Melhores práticas para IA em suporte</a>
                        </li>
                    </ul>
                </section>
                <section className="tickets-section">
                    <h2>Seus Chamados</h2>
                    <table className="tickets-user">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Título</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>#1234</td>
                                <td>Problema com dispositivo IoT</td>
                                <td className="status-open">Aberto</td>
                            </tr>
                            <tr>
                                <td>#1235</td>
                                <td>Configuração de rede</td>
                                <td className="status-resolved">Resolvido</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    );
};

export default MenuUser;