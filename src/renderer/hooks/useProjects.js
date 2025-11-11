import { useState, useEffect, useCallback } from 'react';

function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const projectsList = await window.electronAPI.getProjects();
      setProjects(projectsList || []);
      setError(null);
    } catch (err) {
      console.error('Error loading projects:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const createProject = useCallback(
    async (projectData) => {
      try {
        const newProject = await window.electronAPI.createProject(projectData);
        setProjects((prev) => [newProject, ...prev]);
        return newProject;
      } catch (err) {
        console.error('Error creating project:', err);
        throw err;
      }
    },
    []
  );

  const updateProject = useCallback(async (id, updates) => {
    try {
      const updatedProject = await window.electronAPI.updateProject(id, updates);
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? updatedProject : p))
      );
      return updatedProject;
    } catch (err) {
      console.error('Error updating project:', err);
      throw err;
    }
  }, []);

  const deleteProject = useCallback(async (id) => {
    try {
      await window.electronAPI.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Error deleting project:', err);
      throw err;
    }
  }, []);

  const getProjectById = useCallback(
    (id) => {
      return projects.find((p) => p.id === id);
    },
    [projects]
  );

  return {
    projects,
    loading,
    error,
    loadProjects,
    createProject,
    updateProject,
    deleteProject,
    getProjectById
  };
}

export default useProjects;
