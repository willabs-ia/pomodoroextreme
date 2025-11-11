import React, { useState, useEffect } from 'react';
import '../styles/HomePage.css';

function HomePage() {
  const [projects, setProjects] = useState([]);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const projectsList = await window.electronAPI.getProjects();
      setProjects(projectsList);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      await window.electronAPI.createProject({
        name: newProjectName,
        color: getRandomColor(),
        icon: getRandomIcon(),
        createdAt: new Date().toISOString()
      });

      setNewProjectName('');
      setIsCreatingProject(false);
      loadProjects();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleStartSession = (project) => {
    // Navigate to timer page with project
    console.log('Starting session for project:', project);
    // TODO: Implement navigation
  };

  return (
    <div className="page home-page">
      <div className="home-header">
        <h1 className="home-title">🍅 Pomodoro Extreme</h1>
        <p className="home-subtitle">Escolha um projeto para começar sua sessão de foco</p>
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <div
            key={project.id}
            className="project-card"
            onClick={() => handleStartSession(project)}
            style={{ borderColor: project.color }}
          >
            <div className="project-icon">{project.icon}</div>
            <h3 className="project-name">{project.name}</h3>
            <div className="project-stats">
              <span className="stat">0 pomodoros</span>
              <span className="stat">0h focado</span>
            </div>
          </div>
        ))}

        {isCreatingProject ? (
          <form className="project-card project-create-form" onSubmit={handleCreateProject}>
            <input
              type="text"
              className="project-name-input"
              placeholder="Nome do projeto"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              autoFocus
            />
            <div className="form-actions">
              <button type="submit" className="btn btn-primary btn-sm">
                Criar
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setIsCreatingProject(false);
                  setNewProjectName('');
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div
            className="project-card project-add-card"
            onClick={() => setIsCreatingProject(true)}
          >
            <div className="project-add-icon">+</div>
            <p className="project-add-text">Novo Projeto</p>
          </div>
        )}
      </div>

      <div className="home-footer">
        <button className="btn btn-ghost" onClick={() => console.log('Open settings')}>
          ⚙️ Configurações
        </button>
        <button className="btn btn-ghost" onClick={() => console.log('Open stats')}>
          📊 Estatísticas
        </button>
      </div>
    </div>
  );
}

// Helper functions
function getRandomColor() {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function getRandomIcon() {
  const icons = ['🚀', '💻', '📚', '🎨', '🎯', '💡', '🔥', '⚡', '🌟', '🎮'];
  return icons[Math.floor(Math.random() * icons.length)];
}

export default HomePage;
