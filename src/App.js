import React, { useState } from 'react';
import './App.css';

function App() {
  // Estados para gerenciar a lista de tarefas e os campos de entrada
  const [tarefas, setTarefas] = useState([]); // Lista de tarefas
  const [novaTarefa, setNovaTarefa] = useState(''); // Texto da nova tarefa
  const [novaData, setNovaData] = useState(''); // Data de vencimento da nova tarefa
  const [editandoIndex, setEditandoIndex] = useState(null); // Índice da tarefa sendo editada (null se nenhuma)
  const [textoEditado, setTextoEditado] = useState(''); // Texto da tarefa em edição
  const [dataEditada, setDataEditada] = useState(''); // Data da tarefa em edição
  const [erro, setErro] = useState(''); // Mensagem de erro para validação

  // Função para adicionar uma nova tarefa
  const adicionarTarefa = () => {
    if (novaTarefa.trim() === '') { // Valida se o texto está vazio
      setErro('Digite uma tarefa antes de adicionar!');
      return;
    }
    setErro(''); // Limpa a mensagem de erro se a validação passar
    // Adiciona a nova tarefa ao array com texto, status e data
    setTarefas([...tarefas, { texto: novaTarefa, concluida: false, data: novaData || null }]);
    setNovaTarefa(''); // Reseta o campo de texto
    setNovaData(''); // Reseta o campo de data
  };

  // Função para remover uma tarefa pelo índice
  const removerTarefa = (index) => {
    setTarefas(tarefas.filter((_, i) => i !== index)); // Filtra a tarefa a ser removida
  };

  // Função para alternar o status de concluída de uma tarefa
  const toggleConcluida = (index) => {
    const novasTarefas = tarefas.map((tarefa, i) =>
      i === index ? { ...tarefa, concluida: !tarefa.concluida } : tarefa // Inverte o status apenas da tarefa selecionada
    );
    setTarefas(novasTarefas);
  };

  // Função para iniciar a edição de uma tarefa
  const editarTarefa = (index) => {
    setEditandoIndex(index); // Define o índice da tarefa em edição
    setTextoEditado(tarefas[index].texto); // Carrega o texto atual
    setDataEditada(tarefas[index].data || ''); // Carrega a data atual (ou vazio)
  };

  // Função para salvar as alterações de uma tarefa editada
  const salvarEdicao = () => {
    if (textoEditado.trim() === '') { // Valida se o texto editado está vazio
      setErro('Digite um texto para a tarefa!');
      return;
    }
    const novasTarefas = tarefas.map((tarefa, i) =>
      i === editandoIndex ? { ...tarefa, texto: textoEditado, data: dataEditada } : tarefa // Atualiza apenas a tarefa editada
    );
    setTarefas(novasTarefas);
    setEditandoIndex(null); // Fecha o modal
    setTextoEditado(''); // Reseta o texto editado
    setDataEditada(''); // Reseta a data editada
    setErro(''); // Limpa a mensagem de erro
  };

  // Função para adicionar tarefa ao pressionar Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      adicionarTarefa();
    }
  };

  // Função para iniciar o arrastar (Drag and Drop)
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('index', index); // Armazena o índice da tarefa sendo arrastada
  };

  // Função para soltar a tarefa em uma nova posição (Drag and Drop)
  const handleDrop = (e, dropIndex) => {
    const dragIndex = e.dataTransfer.getData('index'); // Recupera o índice da tarefa arrastada
    const novasTarefas = [...tarefas];
    const [tarefaMovida] = novasTarefas.splice(dragIndex, 1); // Remove a tarefa da posição original
    novasTarefas.splice(dropIndex, 0, tarefaMovida); // Insere na nova posição
    setTarefas(novasTarefas);
  };

  // Contadores para exibir progresso
  const tarefasConcluidas = tarefas.filter(tarefa => tarefa.concluida).length; // Conta tarefas concluídas
  const totalTarefas = tarefas.length; // Total de tarefas

  // Renderização do componente
  return (
    <div className="App">
      <h1>Lista de Tarefas</h1>
      {/* Exibe o contador de tarefas concluídas */}
      <div className="contador">{tarefasConcluidas} de {totalTarefas} concluídas</div>
      {/* Container para adicionar nova tarefa */}
      <div className="input-container">
        <input
          type="text"
          value={novaTarefa}
          onChange={(e) => setNovaTarefa(e.target.value)} // Atualiza o texto da nova tarefa
          onKeyPress={handleKeyPress} // Adiciona ao pressionar Enter
          placeholder="Digite uma tarefa"
        />
        <input
          type="date"
          value={novaData}
          onChange={(e) => setNovaData(e.target.value)} // Atualiza a data da nova tarefa
        />
        <button onClick={adicionarTarefa}>Adicionar</button>
      </div>
      {/* Exibe mensagem de erro, se houver */}
      {erro && <div className="mensagem-erro">{erro}</div>}
      {/* Lista de tarefas */}
      <ul className="lista-tarefas">
        {tarefas.map((tarefa, index) => (
          <li
            key={index}
            draggable // Habilita o arrastar
            onDragStart={(e) => handleDragStart(e, index)} // Inicia o arrastar
            onDragOver={(e) => e.preventDefault()} // Permite soltar
            onDrop={(e) => handleDrop(e, index)} // Solta a tarefa
            className={`tarefa ${tarefa.concluida ? 'concluida' : ''} ${
              tarefa.data && new Date(tarefa.data) < new Date() && !tarefa.concluida ? 'atrasada' : ''
            }`} // Classes condicionais para estilo
          >
            <input
              type="checkbox"
              checked={tarefa.concluida}
              onChange={() => toggleConcluida(index)} // Alterna o status de concluída
            />
            {/* Exibe o texto e a data da tarefa */}
            <span>
              {tarefa.texto} {tarefa.data && `(${new Date(tarefa.data).toLocaleDateString()})`}
            </span>
            <button onClick={() => editarTarefa(index)}>Editar</button>
            <button className="botao-remover" onClick={() => removerTarefa(index)}>Remover</button>
          </li>
        ))}
      </ul>

      {/* Modal para edição de tarefa */}
      {editandoIndex !== null && (
        <div className="modal">
          <div className="modal-content">
            <h2>Editar Tarefa</h2>
            <input
              type="text"
              value={textoEditado}
              onChange={(e) => setTextoEditado(e.target.value)} // Atualiza o texto editado
            />
            <input
              type="date"
              value={dataEditada}
              onChange={(e) => setDataEditada(e.target.value)} // Atualiza a data editada
            />
            {/* Exibe mensagem de erro no modal, se houver */}
            {erro && <div className="mensagem-erro">{erro}</div>}
            <button onClick={salvarEdicao}>Salvar</button>
            {/* Cancela a edição e limpa o erro */}
            <button onClick={() => { setEditandoIndex(null); setErro(''); }}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;