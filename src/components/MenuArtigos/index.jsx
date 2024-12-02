import React, { useEffect, useState } from 'react';
import './style.css';
import config from "../../config";

const MenuArtigos = () => {
    const backendIp = config.backend_ip;
    const [artigos, setArtigos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [novoArtigo, setNovoArtigo] = useState({
        titulo: '',
        descricao: '',
    });

    const [mensagem, setMensagem] = useState('');

    useEffect(() => {
        fetch(`${backendIp}/api/list_artigos`)
            .then((response) => response.json())
            .then((data) => {
                if (data.artigos) {
                    setArtigos(data.artigos);
                }
            })
            .catch((error) => {
                console.error("Erro ao carregar os artigos:", error);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNovoArtigo((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddArtigo = (e) => {
        e.preventDefault();
        setMensagem('');

        fetch(`${backendIp}/api/add_artigos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoArtigo),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message === "Artigo adicionado com sucesso") {
                    setMensagem('Artigo adicionado com sucesso!');
                    setArtigos((prev) => [...prev, { ...novoArtigo, data_publicacao: new Date().toLocaleDateString() }]);
                    setNovoArtigo({ titulo: '', descricao: '' });
                } else {
                    setMensagem(data.message || 'Erro ao adicionar artigo.');
                }
            })
            .catch((error) => {
                console.error("Erro ao adicionar artigo:", error);
                setMensagem('Erro ao adicionar artigo.');
            });
    };

    const toggleFormulario = () => {
        setMostrarFormulario((prev) => !prev);
    };

    return (
        <div>
            <div className="section">
                <h2>Artigos</h2>
                {mostrarFormulario ? (
                    <div className="adicionar-artigo">
                        <form className='form-artigo' onSubmit={handleAddArtigo}>
                            <div>
                                <label>Título:</label>
                                <input
                                    type="text"
                                    name="titulo"
                                    value={novoArtigo.titulo}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Descrição:</label>
                                <textarea
                                    name="descricao"
                                    value={novoArtigo.descricao}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div style={{display:'flex', gap:'5px'}}>
                                <button className='button' type="submit">Adicionar</button>
                                <button className='button' onClick={toggleFormulario}>
                                    {mostrarFormulario ? 'Voltar à Lista' : 'Adicionar Novo Artigo'}
                                </button>
                            </div>
                        </form>
                        {mensagem && <p className="mensagem">{mensagem}</p>}
                    </div>
                ) : (
                    <>
                        {loading ? (
                            <p>Carregando artigos...</p>
                        ) : (
                            <div className="artigos-lista">
                                {artigos.length > 0 ? (
                                    artigos.map((artigo, index) => (
                                        <div key={index} className="artigo-item">
                                            <h3>{artigo.titulo}</h3>
                                            <p>{artigo.descricao}</p>
                                            <span className="artigo-data">Publicado em: {new Date(artigo.data_publicacao).toLocaleDateString()}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p>Nenhum artigo encontrado.</p>
                                )}
                                <button className='button' onClick={toggleFormulario}>
                                    {mostrarFormulario ? 'Voltar à Lista' : 'Adicionar Novo Artigo'}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default MenuArtigos;