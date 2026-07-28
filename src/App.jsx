import { useEffect, useMemo, useState } from 'react';
import { cancelTask, createTask, listTasks, updateTask } from './api';

const PRIORIDADES = ['Baja', 'Media', 'Alta'];
const ESTADOS = ['Todos', 'pendiente', 'completada', 'cancelada'];

const COLABORADORES = [
  { id: 'ana-gomez', nombre: 'Ana Gómez', cargo: 'Analista', telefono: '555-120-3344' },
  { id: 'luis-perez', nombre: 'Luis Pérez', cargo: 'Desarrollador', telefono: '555-280-7788' },
  { id: 'maria-lopez', nombre: 'María López', cargo: 'Coordinadora', telefono: '555-640-9911' },
  { id: 'carlos-ruiz', nombre: 'Carlos Ruiz', cargo: 'Soporte', telefono: '555-771-4433' },
];

const emptyForm = {
  titulo: '',
  descripcion: '',
  prioridad: 'Media',
  colaboradorId: '',
};

const stateOrder = {
  pendiente: 0,
  completada: 1,
  cancelada: 2,
};

const priorityOrder = {
  Alta: 0,
  Media: 1,
  Baja: 2,
};

function formatDate(value) {
  if (!value) return 'Sin fecha';
  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function normalizeTask(task) {
  return {
    ...task,
    prioridad: task.prioridad || task.prioridadTarea || 'Media',
    estado: task.estado || 'pendiente',
    colaboradorId: task.colaboradorId || task.colaborador?.id || '',
  };
}

function getCollaboratorLabel(task) {
  const collaborator = COLABORADORES.find((item) => item.id === task.colaboradorId);
  return collaborator ? `${collaborator.nombre} · ${collaborator.cargo}` : 'Sin colaborador';
}

function isFinalTask(task) {
  return task.estado === 'completada' || task.estado === 'cancelada';
}

function sortTasks(list) {
  return [...list].sort((left, right) => {
    const leftState = stateOrder[left.estado] ?? 99;
    const rightState = stateOrder[right.estado] ?? 99;

    if (leftState !== rightState) return leftState - rightState;

    const leftPriority = priorityOrder[left.prioridad] ?? 99;
    const rightPriority = priorityOrder[right.prioridad] ?? 99;

    if (leftPriority !== rightPriority) return leftPriority - rightPriority;

    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
  });
}

function validateTaskField(name, value) {
  const trimmed = typeof value === 'string' ? value.trim() : '';

  if (name === 'titulo') {
    if (!trimmed) return 'El título es obligatorio.';
    if (trimmed.length > 25) return 'El título debe tener máximo 25 caracteres.';
    return '';
  }

  if (name === 'descripcion') {
    if (trimmed.length > 60) return 'La descripción debe tener máximo 60 caracteres.';
    return '';
  }

  if (name === 'prioridad') {
    if (!PRIORIDADES.includes(trimmed)) return 'Selecciona una prioridad válida.';
    return '';
  }

  return '';
}

function validateAll(values) {
  return {
    titulo: validateTaskField('titulo', values.titulo),
    descripcion: validateTaskField('descripcion', values.descripcion),
    prioridad: validateTaskField('prioridad', values.prioridad),
  };
}

function TaskForm({ mode, initialValues, onClose, onSubmit, saving }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({ titulo: '', descripcion: '', prioridad: '' });
  const [touched, setTouched] = useState({ titulo: false, descripcion: false, prioridad: false });

  useEffect(() => {
    setValues(initialValues);
    setErrors({ titulo: '', descripcion: '', prioridad: '' });
    setTouched({ titulo: false, descripcion: false, prioridad: false });
  }, [initialValues]);

  const updateField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
    setTouched((current) => ({ ...current, [field]: true }));
    setErrors((current) => ({ ...current, [field]: validateTaskField(field, value) }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validateAll(values);
    setErrors(nextErrors);
    setTouched({ titulo: true, descripcion: true, prioridad: true });

    if (Object.values(nextErrors).some(Boolean)) return;

    const collaborator = COLABORADORES.find((item) => item.id === values.colaboradorId) || null;

    onSubmit({
      titulo: values.titulo.trim(),
      descripcion: values.descripcion.trim(),
      prioridad: values.prioridad,
      colaboradorId: collaborator?.id || '',
      colaborador: collaborator,
      estado: 'pendiente',
    });
  };

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div className="modal-card" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="eyebrow">{mode === 'create' ? 'Crear tarea' : 'Editar tarea'}</p>
            <h3>{mode === 'create' ? 'Nueva tarea' : 'Actualizar tarea'}</h3>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Cerrar formulario">
            ×
          </button>
        </div>

        <form className="form-grid" onSubmit={handleSubmit} noValidate>
          <label>
            <span>Título</span>
            <input
              value={values.titulo}
              maxLength={25}
              onChange={(event) => updateField('titulo', event.target.value)}
              aria-invalid={Boolean(errors.titulo)}
            />
            {touched.titulo && errors.titulo ? <small className="error-text">{errors.titulo}</small> : null}
          </label>

          <label className="full-width">
            <span>Descripción</span>
            <textarea
              value={values.descripcion}
              maxLength={60}
              rows="3"
              onChange={(event) => updateField('descripcion', event.target.value)}
              aria-invalid={Boolean(errors.descripcion)}
            />
            {touched.descripcion && errors.descripcion ? <small className="error-text">{errors.descripcion}</small> : null}
          </label>

          <label>
            <span>Prioridad</span>
            <select
              value={values.prioridad}
              onChange={(event) => updateField('prioridad', event.target.value)}
              aria-invalid={Boolean(errors.prioridad)}
            >
              <option value="Baja">Baja</option>
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
            </select>
            {touched.prioridad && errors.prioridad ? <small className="error-text">{errors.prioridad}</small> : null}
          </label>

          <label>
            <span>Colaborador asignado</span>
            <select value={values.colaboradorId} onChange={(event) => setValues((current) => ({ ...current, colaboradorId: event.target.value }))}>
              <option value="">Sin asignar</option>
              {COLABORADORES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nombre} - {item.cargo} - {item.telefono}
                </option>
              ))}
            </select>
          </label>

          <div className="form-actions full-width">
            <button type="button" className="secondary-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="primary-button" disabled={saving}>
              {saving ? 'Guardando...' : mode === 'create' ? 'Crear tarea' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function IntroView({ stats }) {
  return (
    <section className="hero-panel">
      <div className="hero-copy-block">
        <p className="eyebrow">Introducción</p>
        <h1>Aplicaion para gestionar tareas dentro de Importadora premium</h1>
        <p className="hero-copy">
          esta aplicacion fue desarrollada por S-chez Dev para la solucion de una prueba tecnica se desarrolla un aplicativo simple que facilita la gestion de tareas por realizar.
        </p>
      </div>

      <div className="stats-grid">
        <article>
          <span>Tareas creadas</span>
          <strong>{stats.total}</strong>
        </article>
        <article>
          <span>Completadas</span>
          <strong>{stats.completed}</strong>
        </article>
        <article>
          <span>Canceladas</span>
          <strong>{stats.cancelled}</strong>
        </article>
        <article>
          <span>Recientes</span>
          <strong>{stats.recent}</strong>
        </article>
        <article>
          <span>Pendientes</span>
          <strong>{stats.pending}</strong>
        </article>
      </div>
    </section>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M3 17.25V21h3.75L19.81 7.94l-3.75-3.75L3 17.25Zm2.92 2.33H5v-.92l10.56-10.56.92.92L5.92 19.58ZM20.71 6.04a1 1 0 0 0 0-1.41l-1.34-1.34a1 1 0 0 0-1.41 0l-1.06 1.06 3.75 3.75 1.06-1.06Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M9 3.75h6a1.5 1.5 0 0 1 1.5 1.5V6h3v1.5h-1.01l-.8 11.04A2.25 2.25 0 0 1 15.45 21H8.55a2.25 2.25 0 0 1-2.24-2.46L5.5 7.5H4.5V6h3v-.75A1.5 1.5 0 0 1 9 3.75Zm1.5 2.25h3v-.75h-3V6Zm-2.95 1.5.69 9.58a.75.75 0 0 0 .75.69h4.52a.75.75 0 0 0 .75-.69l.69-9.58h-7.4Zm1.95 2.25h1.5v5.25h-1.5V9.75Zm3.75 0h1.5v5.25h-1.5V9.75Z" />
    </svg>
  );
}

function TaskCard({ task, onEdit, onCancel, onStateChange }) {
  const finalTask = isFinalTask(task);

  return (
    <article className={`task-card priority-${String(task.prioridad || '').toLowerCase()} state-${String(task.estado || '').toLowerCase()}`}>
      <div className="task-card-top">
        <div className="task-card-main">
          <p className="task-title">{task.titulo}</p>
          <p className="task-meta">{formatDate(task.createdAt)}</p>
        </div>
        <div className="badges">
          <span className={`badge priority-${String(task.prioridad || '').toLowerCase()}`}>{task.prioridad || 'Media'}</span>
          <span className={`badge state-${String(task.estado || '').toLowerCase()}`}>{task.estado}</span>
        </div>
      </div>

      <div className="task-details compact">
        <div className="detail-item">
          <span>Colaborador</span>
          <strong>{getCollaboratorLabel(task)}</strong>
        </div>
        <div className="detail-item">
          <span>Actualización</span>
          <strong>{formatDate(task.updatedAt || task.createdAt)}</strong>
        </div>
      </div>

      {task.descripcion ? <p className="task-description compact">{task.descripcion}</p> : null}

      <div className="card-actions">
        <button className="icon-action-button icon-only edit" type="button" onClick={() => onEdit(task)} disabled={finalTask} aria-label="Editar tarea">
          <PencilIcon />
        </button>
        <label className="state-select-wrap">
          <span className="sr-only">Modificar estado de la tarea</span>
          <select className="state-select" value={task.estado} onChange={(event) => onStateChange(task, event.target.value)} disabled={finalTask} aria-label="Modificar estado de la tarea">
            <option value={task.estado}>{task.estado}</option>
            {!finalTask ? <option value="completada">completada</option> : null}
            {!finalTask ? <option value="cancelada">cancelada</option> : null}
          </select>
        </label>
        <button className="icon-action-button icon-only danger" type="button" onClick={() => onCancel(task)} disabled={finalTask} aria-label="Eliminar tarea">
          <TrashIcon />
        </button>
      </div>
    </article>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('introduccion');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedState, setSelectedState] = useState('Todos');
  const [selectedCollaborator, setSelectedCollaborator] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [editingTask, setEditingTask] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const isTaskView = activeTab === 'tareas';

  const pushNotification = (type, message) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setNotifications((current) => [...current, { id, type, message }]);

    window.setTimeout(() => {
      setNotifications((current) => current.filter((item) => item.id !== id));
    }, 2800);
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await listTasks();
      setTasks((response.data || []).map(normalizeTask));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const introStats = useMemo(() => {
    const now = Date.now();
    const recentThreshold = 7 * 24 * 60 * 60 * 1000;

    return {
      total: tasks.length,
      completed: tasks.filter((task) => task.estado === 'completada').length,
      cancelled: tasks.filter((task) => task.estado === 'cancelada').length,
      recent: tasks.filter((task) => now - new Date(task.createdAt).getTime() <= recentThreshold).length,
      pending: tasks.filter((task) => task.estado === 'pendiente').length,
    };
  }, [tasks]);

  const collaboratorFilters = useMemo(() => ['Todos', ...COLABORADORES.map((item) => `${item.nombre} · ${item.cargo}`), 'Sin colaborador'], []);

  const filteredTasks = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return sortTasks(tasks).filter((task) => {
      const matchesState = selectedState === 'Todos' || task.estado === selectedState;
      const collaboratorLabel = getCollaboratorLabel(task).toLowerCase();
      const matchesCollaborator =
        selectedCollaborator === 'Todos' ||
        (selectedCollaborator === 'Sin colaborador' && !task.colaboradorId) ||
        collaboratorLabel === selectedCollaborator.toLowerCase();
      const matchesSearch = !normalizedSearch || task.titulo.toLowerCase().includes(normalizedSearch);

      return matchesState && matchesCollaborator && matchesSearch;
    });
  }, [tasks, selectedState, selectedCollaborator, searchTerm]);

  const openCreate = () => {
    setFormMode('create');
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEdit = (task) => {
    setFormMode('edit');
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const submitForm = async (values) => {
    try {
      setSaving(true);

      if (formMode === 'create') {
        await createTask(values);
        pushNotification('success', 'Tarea creada correctamente');
      } else if (editingTask) {
        await updateTask(editingTask.id, {
          titulo: values.titulo,
          descripcion: values.descripcion,
          prioridad: values.prioridad,
          colaboradorId: values.colaboradorId,
          colaborador: values.colaborador,
        });
        pushNotification('success', 'Tarea actualizada correctamente');
      }

      await loadTasks();
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleStateChange = async (task, newState) => {
    try {
      if (isFinalTask(task)) return;
      await updateTask(task.id, { estado: newState });
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = async (task) => {
    try {
      await cancelTask(task.id);
      await loadTasks();
      pushNotification('success', 'Tarea eliminada correctamente');
    } catch (err) {
      setError(err.message);
    }
  };

  const clearFilters = () => {
    setSelectedState('Todos');
    setSelectedCollaborator('Todos');
    setSearchTerm('');
  };

  const modalInitialValues =
    formMode === 'edit' && editingTask
      ? {
          titulo: editingTask.titulo || '',
          descripcion: editingTask.descripcion || '',
          prioridad: editingTask.prioridad || 'Media',
          colaboradorId: editingTask.colaboradorId || '',
        }
      : emptyForm;

  return (
    <div className="app-shell">
      <div className="notification-stack" aria-live="polite" aria-atomic="true">
        {notifications.map((notification) => (
          <div key={notification.id} className={`toast toast-${notification.type}`}>
            <strong>{notification.type === 'success' ? 'Confirmación' : 'Aviso'}</strong>
            <span>{notification.message}</span>
          </div>
        ))}
      </div>

      <header className="topbar">
        <nav className="nav-tabs" aria-label="Secciones de la aplicación">
          <button className={activeTab === 'introduccion' ? 'tab active' : 'tab'} type="button" onClick={() => setActiveTab('introduccion')}>
            Introduccion
          </button>
          <button className={activeTab === 'tareas' ? 'tab active' : 'tab'} type="button" onClick={() => setActiveTab('tareas')}>
            Gestionar tareas
          </button>
        </nav>

        {isTaskView ? <h1 className="nav-title">Gestionar tareas</h1> : null}

        {isTaskView ? (
          <button className="floating-create-button" type="button" onClick={openCreate}>
            Crear Tarea
          </button>
        ) : null}
      </header>

      <main className="content-area">
        {error ? <div className="alert">{error}</div> : null}

        {activeTab === 'introduccion' ? (
          <IntroView stats={introStats} />
        ) : (
          <section className="management-panel">
            <p className="muted management-summary">Las tareas se muestran de la más reciente a la más antigua, ordenadas por estado y prioridad.</p>

            <div className="filters-row">
              <label className="field-inline field-search">
                <span className="filter-label">Buscar por título</span>
                <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="search-input" aria-label="Buscar tarea por título" />
              </label>

              <label className="field-inline">
                <span className="filter-label">Estado</span>
                <select className="select-input" value={selectedState} onChange={(event) => setSelectedState(event.target.value)}>
                  {ESTADOS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field-inline">
                <span className="filter-label">Colaborador</span>
                <select className="select-input" value={selectedCollaborator} onChange={(event) => setSelectedCollaborator(event.target.value)}>
                  {collaboratorFilters.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <button className="clear-filters-button" type="button" onClick={clearFilters}>
                Limpiar filtros
              </button>
            </div>

            {loading ? <div className="empty-state">Cargando tareas...</div> : null}

            {!loading && filteredTasks.length === 0 ? <div className="empty-state">No hay tareas con los filtros seleccionados.</div> : null}

            <div className="task-grid">
              {filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={openEdit} onCancel={handleCancel} onStateChange={handleStateChange} />
              ))}
            </div>
          </section>
        )}
      </main>

      {isModalOpen ? <TaskForm mode={formMode} initialValues={modalInitialValues} onClose={closeModal} onSubmit={submitForm} saving={saving} /> : null}
    </div>
  );
}