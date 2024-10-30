import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [newTodoDescription, setNewTodoDescription] = useState('');

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    const response = await axios.get(`http://localhost:8000/api/projects/${id}/`);
    setProject(response.data);
  };

  const createTodo = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:8000/api/todos/', {
      project: id,
      description: newTodoDescription
    });
    setNewTodoDescription('');
    fetchProject();
  };

  const toggleTodo = async (todoId) => {
    await axios.post(`http://localhost:8000/api/todos/${todoId}/toggle_complete/`);
    fetchProject();
  };

  const exportMarkdown = async () => {
    const response = await axios.post(`http://localhost:8000/api/projects/${id}/export_markdown/`);
    const blob = new Blob([response.data.markdown], { type: 'text/markdown' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title}.md`;
    a.click();
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">{project.title}</h2>
        <button
          onClick={exportMarkdown}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Export as Markdown
        </button>
      </div>

      <form onSubmit={createTodo} className="mb-8">
        <input
          type="text"
          value={newTodoDescription}
          onChange={(e) => setNewTodoDescription(e.target.value)}
          placeholder="New Todo Description"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Todo
        </button>
      </form>

      <div className="space-y-4">
        {project.todos.map(todo => (
          <div key={todo.id} className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span className={todo.completed ? 'line-through text-gray-500' : ''}>
              {todo.description}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectDetail;