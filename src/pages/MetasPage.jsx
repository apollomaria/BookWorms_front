import React, { useState, useEffect } from 'react';
import { Topbar } from '../components/Topbar';
import { SidebarLeft } from '../components/SidebarLeft';
import { SidebarRight } from '../components/SidebarRight';
import { useApp } from '../context/AppContext';

const GOAL_TYPES = [
  { value: 'PAGINAS_DIA',   label: 'Páginas por dia',       unit: 'pages',   placeholder: 'Ex: 30',  defaultTarget: 20 },
  { value: 'LIVROS_MES',    label: 'Livros por mês',        unit: 'books',   placeholder: 'Ex: 2',   defaultTarget: 2  },
  { value: 'MINUTOS_DIA',   label: 'Minutos no Cronômetro', unit: 'minutes', placeholder: 'Ex: 45',  defaultTarget: 30 },
  { value: 'CAPITULOS_SEM', label: 'Capítulos por semana',  unit: 'chapters',placeholder: 'Ex: 5',   defaultTarget: 5  },
];

function getDefaultDeadline() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().split('T')[0];
}

function calcProgress(goal) {
  if (!goal.targetValue || goal.targetValue === 0) return 0;
  const current = goal.currentValue ?? 0;
  return Math.min(100, Math.round((current / goal.targetValue) * 100));
}

function GoalCard({ goal, onEdit, onDelete }) {
  const progress = calcProgress(goal);
  const typeInfo = GOAL_TYPES.find(t => t.value === goal.type) || { label: goal.type };
  const deadline = goal.deadline ? new Date(goal.deadline).toLocaleDateString('pt-BR') : '—';
  const isCompleted = progress >= 100;

  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      padding: '16px 18px',
      borderRadius: '14px',
      border: `1px solid ${isCompleted ? 'var(--green)' : 'var(--divider)'}`,
      transition: 'border 0.3s ease'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div>
          <strong style={{ fontSize: '0.95rem', display: 'block' }}>{typeInfo.label}</strong>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Alvo: {goal.targetValue} {goal.unit} · Prazo: {deadline}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          <span style={{
            fontSize: '0.85rem',
            color: isCompleted ? 'var(--green)' : 'var(--pink-2)',
            fontWeight: 700
          }}>
            {isCompleted ? '✓ Concluída' : `${progress}%`}
          </span>
          <button
            onClick={() => onEdit(goal)}
            title="Editar meta"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', fontSize: '1rem', padding: '0 4px'
            }}
          >✏️</button>
          <button
            onClick={() => onDelete(goal.id)}
            title="Excluir meta"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--red)', fontSize: '1rem', padding: '0 4px'
            }}
          >🗑️</button>
        </div>
      </div>

      <div style={{ height: '8px', background: 'rgba(255,255,255,0.12)', borderRadius: '999px', overflow: 'hidden' }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: isCompleted
            ? 'var(--green)'
            : 'linear-gradient(90deg, var(--green), var(--pink))',
          borderRadius: '999px',
          transition: 'width 0.5s ease'
        }} />
      </div>
    </div>
  );
}

export function MetasPage() {
  const { currentUser, goals, goalsLoading, goalsError, createGoal, updateGoal, deleteGoal, syncGoals } = useApp();

  // Form fields
  const [selectedType, setSelectedType] = useState(GOAL_TYPES[0].value);
  const [targetValue, setTargetValue] = useState('20');
  const [deadline, setDeadline] = useState(getDefaultDeadline());
  const [isTypeOpen, setIsTypeOpen] = useState(false);

  // Editing state
  const [editingGoal, setEditingGoal] = useState(null);
  const [editTarget, setEditTarget] = useState('');
  const [editDeadline, setEditDeadline] = useState('');

  // Feedback
  const [feedback, setFeedback] = useState({ msg: '', type: 'success' });

  const showFeedback = (msg, type = 'success') => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback({ msg: '', type: 'success' }), 4000);
  };

  useEffect(() => {
    if (currentUser?.id) {
      syncGoals(currentUser.id);
    }
  }, [currentUser, syncGoals]);

  const selectedTypeInfo = GOAL_TYPES.find(t => t.value === selectedType) || GOAL_TYPES[0];

  const handleCreateMeta = async (e) => {
    e.preventDefault();
    if (!currentUser?.id) {
      showFeedback('Você precisa estar logado para criar metas.', 'error');
      return;
    }
    const tv = Number(targetValue);
    if (!tv || tv <= 0) {
      showFeedback('O valor alvo deve ser maior que zero.', 'error');
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(deadline) <= today) {
      showFeedback('O prazo deve ser uma data futura.', 'error');
      return;
    }

    const res = await createGoal({
      userId: currentUser.id,
      type: selectedType,
      targetValue: tv,
      unit: selectedTypeInfo.unit,
      deadline,
    });

    if (res?.success) {
      showFeedback(`Meta de "${selectedTypeInfo.label}" criada com sucesso! 🎯`);
      setTargetValue(String(selectedTypeInfo.defaultTarget));
      setDeadline(getDefaultDeadline());
    } else {
      showFeedback(res?.message || 'Erro ao criar meta.', 'error');
    }
  };

  const handleStartEdit = (goal) => {
    setEditingGoal(goal);
    setEditTarget(String(goal.targetValue));
    setEditDeadline(goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : getDefaultDeadline());
  };

  const handleSaveEdit = async () => {
    if (!currentUser?.id || !editingGoal) return;
    const tv = Number(editTarget);
    if (!tv || tv <= 0) {
      showFeedback('Valor alvo deve ser maior que zero.', 'error');
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(editDeadline) <= today) {
      showFeedback('O prazo deve ser uma data futura.', 'error');
      return;
    }
    const res = await updateGoal({
      userId: currentUser.id,
      goalId: editingGoal.id,
      targetValue: tv,
      deadline: editDeadline,
    });
    if (res?.success) {
      showFeedback('Meta atualizada! ✅');
      setEditingGoal(null);
    } else {
      showFeedback(res?.message || 'Erro ao atualizar meta.', 'error');
    }
  };

  const handleDelete = async (goalId) => {
    if (!currentUser?.id) return;
    if (!window.confirm('Deseja excluir esta meta?')) return;
    const res = await deleteGoal(currentUser.id, goalId);
    if (res?.success) {
      showFeedback('Meta excluída.', 'success');
    } else {
      showFeedback(res?.message || 'Erro ao excluir meta.', 'error');
    }
  };

  const feedbackStyle = {
    background: feedback.type === 'error' ? 'rgba(230,72,62,0.18)' : 'rgba(52,195,123,0.18)',
    border: `1px solid ${feedback.type === 'error' ? 'var(--red)' : 'var(--green)'}`,
    borderRadius: '10px',
    padding: '12px 16px',
    marginBottom: '18px',
    color: 'var(--text)',
    fontSize: '0.9rem',
    textAlign: 'center'
  };

  return (
    <>
      <Topbar showSearch={true} />
      <div className="layout">
        <SidebarLeft />

        <main className="feed feed--center">
          <div className="form-card">
            <h2 className="form-title">Criação de Metas</h2>

            {!currentUser && (
              <div style={{ ...feedbackStyle, background: 'rgba(238,79,158,0.15)', border: '1px solid var(--pink)', marginBottom: '18px' }}>
                ⚠️ Faça login para salvar suas metas no servidor.
              </div>
            )}

            {feedback.msg && <div style={feedbackStyle}>{feedback.msg}</div>}

            <form onSubmit={handleCreateMeta}>
              {/* Tipo de Meta */}
              <div className="form-field form-field--center" style={{ position: 'relative' }}>
                <label className="form-label">Tipo de Meta</label>
                <div
                  className="form-select"
                  onClick={() => setIsTypeOpen(prev => !prev)}
                >
                  <span>{selectedTypeInfo.label}</span>
                  <span className="chevron-select">{isTypeOpen ? '⌃' : '⌄'}</span>
                </div>

                {isTypeOpen && (
                  <div style={{
                    position: 'absolute', top: '72px', left: 0, right: 0,
                    background: '#ffffff', borderRadius: '10px',
                    boxShadow: '0 10px 24px rgba(0,0,0,0.35)', zIndex: 20, overflow: 'hidden'
                  }}>
                    {GOAL_TYPES.map(opt => (
                      <div
                        key={opt.value}
                        onClick={() => {
                          setSelectedType(opt.value);
                          setTargetValue(String(opt.defaultTarget));
                          setIsTypeOpen(false);
                        }}
                        style={{
                          padding: '10px 14px', color: '#1a1a1a',
                          fontWeight: opt.value === selectedType ? 700 : 500,
                          background: opt.value === selectedType ? 'rgba(238,79,158,0.15)' : '#ffffff',
                          cursor: 'pointer', borderBottom: '1px solid #f0f0f0'
                        }}
                      >
                        {opt.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Valor Alvo */}
              <div className="form-field form-field--center" style={{ marginTop: '16px' }}>
                <label className="form-label">
                  Valor Alvo <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>({selectedTypeInfo.unit})</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={targetValue}
                  onChange={e => setTargetValue(e.target.value)}
                  placeholder={selectedTypeInfo.placeholder}
                  className="form-input"
                  style={{ width: '100%' }}
                  required
                />
              </div>

              {/* Prazo */}
              <div className="form-field form-field--center" style={{ marginTop: '16px' }}>
                <label className="form-label">Prazo</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', colorScheme: 'dark' }}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-criar-clube btn-criar-meta"
                style={{ marginTop: '24px' }}
              >
                Criar Meta
              </button>
            </form>

            {/* Modal de Edição */}
            {editingGoal && (
              <div style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
              }}>
                <div style={{
                  background: '#0f331f', borderRadius: '18px', padding: '32px',
                  width: '100%', maxWidth: '400px', border: '1px solid var(--divider)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.6)'
                }}>
                  <h3 style={{ margin: '0 0 20px', color: 'var(--pink-2)', fontFamily: 'Baloo 2' }}>
                    Editar Meta
                  </h3>
                  <label className="form-label">Novo Valor Alvo</label>
                  <input
                    type="number"
                    min="1"
                    value={editTarget}
                    onChange={e => setEditTarget(e.target.value)}
                    className="form-input"
                    style={{ width: '100%', marginBottom: '16px' }}
                  />
                  <label className="form-label">Novo Prazo</label>
                  <input
                    type="date"
                    value={editDeadline}
                    onChange={e => setEditDeadline(e.target.value)}
                    className="form-input"
                    style={{ width: '100%', marginBottom: '24px', colorScheme: 'dark' }}
                  />
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={handleSaveEdit}
                      className="btn-criar-clube"
                      style={{ flex: 1 }}
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => setEditingGoal(null)}
                      style={{
                        flex: 1, background: 'rgba(255,255,255,0.08)', border: '1px solid var(--divider)',
                        color: 'var(--text)', borderRadius: '999px', padding: '10px', cursor: 'pointer',
                        fontFamily: 'Baloo 2', fontWeight: 700
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Metas em Andamento */}
            <div style={{ marginTop: '36px', textAlign: 'left' }}>
              <h3 style={{ margin: '0 0 16px', color: 'var(--pink-2)', fontFamily: 'Baloo 2', fontSize: '1.15rem' }}>
                Suas Metas em Andamento
              </h3>

              {goalsLoading && (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Carregando metas...</p>
              )}
              {goalsError && (
                <p style={{ color: 'var(--red)', textAlign: 'center' }}>{goalsError}</p>
              )}
              {!goalsLoading && !goalsError && goals.length === 0 && (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
                  {currentUser ? 'Nenhuma meta encontrada. Crie uma acima! 🎯' : 'Faça login para ver suas metas.'}
                </p>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {goals.map(goal => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onEdit={handleStartEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          </div>
        </main>

        <SidebarRight />
      </div>
    </>
  );
}

export default MetasPage;
