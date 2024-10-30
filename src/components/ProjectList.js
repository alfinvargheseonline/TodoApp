import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [newProjectTitle, setNewProjectTitle] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const response = await axios.get('http://localhost:8000/api/projects/');
    setProjects(response.data);
  };

  const createProject = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:8000/api/projects/', {
      title: newProjectTitle
    });
    setNewProjectTitle('');
    fetchProjects();
  };

  return (
    <div>
      <form onSubmit={createProject} className="mb-8">
        <input
          type="text"
          value={newProjectTitle}
          onChange={(e) => setNewProjectTitle(e.target.value)}
          placeholder="New Project Title"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Project
        </button>
      </form>

      <div className="grid gap-4">
        {projects.map(project => (
          <Link 
            key={project.id} 
            to={`/project/${project.id}`}
            className="border p-4 rounded hover:bg-gray-50"
          >
            <h2 className="text-xl font-bold">{project.title}</h2>
            <p className="text-gray-600">
              {project.completed_todos} / {project.total_todos} completed
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}