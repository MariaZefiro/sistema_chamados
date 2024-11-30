import React, { useState } from 'react';

const TicketFilter = ({ handleFilterChange }) => {
  const sectors = [
    'Administração', 'CGR', 'Call Center', 'Comunicação', 'Desenvolvimento',
    'Diretoria', 'Engenharia', 'Expansão', 'Estoque', 'Frota', 'Jurídico',
    'Logística', 'Loja', 'Operacional', 'Patrimônio', 'Projetos', 'Recursos Humanos', 'TIC'
  ];

  const [selectedSector, setSelectedSector] = useState('');

  const handleChange = (event) => {
    const sector = event.target.value;
    setSelectedSector(sector);
    handleFilterChange(sector);
  };

  return (
    <div>
      <select
        value={selectedSector}
        onChange={handleChange}
        style={{
          backgroundColor: '#009373',
          color: 'white',
          border: '1px solid #007f61',
          padding: '5px',
          fontSize: '16px',
          borderRadius: '5px',
          width: '190px',
          cursor: 'pointer',
          marginBottom:'10px',
        }}
      >
        <option value="">Todos Departamentos</option>
        {sectors.map((sector) => (
          <option key={sector} value={sector}>
            {sector}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TicketFilter;