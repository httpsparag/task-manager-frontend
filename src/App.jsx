import { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:8000/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');

  const fetchTasks = async () => {
    const res = await axios.get(API);
    setTasks(res.data);
  };

  const addTask = async () => {
    if (!title.trim()) return;
    await axios.post(API, {
      title,
      status: 'Pending',
      createdAt: date ? new Date(date).toISOString() : new Date().toISOString(),
    });
    setTitle('');
    setDate('');
    fetchTasks();
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    await axios.put(`${API}/${taskId}`, { status: newStatus });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const getStatusColor = (status) => {
    if (status === 'Completed') return 'text-green-400';
    if (status === 'In Progress') return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 text-white px-4 py-10">
      <h1 className="text-5xl font-extrabold text-center text-white mb-10">📝 Task Manager</h1>

      <div className="w-full max-w-7xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
        {/* Input Section */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 w-full">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full sm:flex-1 px-4 py-3 text-white bg-white/10 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-300"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full sm:w-48 px-4 py-3 text-white bg-white/10 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addTask}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Add
          </button>
        </div>

        {/* Tasks Table */}
        <div className="overflow-x-auto rounded-xl">
          <table className="w-full min-w-[700px] text-sm text-left border-collapse">
            <thead className="bg-white/20 text-white uppercase text-sm">
              <tr>
                <th className="px-4 py-3 border border-white/10 text-center">Sr. No.</th>
                <th className="px-4 py-3 border border-white/10">Task</th>
                <th className="px-4 py-3 border border-white/10">Date</th>
                <th className="px-4 py-3 border border-white/10">Status</th>
                <th className="px-4 py-3 border border-white/10 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length > 0 ? (
                tasks.map((task, index) => (
                  <tr key={task.id} className="hover:bg-white/5">
                    <td className="px-4 py-3 text-center border border-white/10">{index + 1}</td>
                    <td className="px-4 py-3 border border-white/10">{task.title}</td>
                    <td className="px-4 py-3 border border-white/10">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 border border-white/10">
                      <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                        className={`bg-gray-800 text-white px-3 py-1 rounded border border-white/20 focus:outline-none ${getStatusColor(task.status)}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-center border border-white/10">
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-red-400 hover:text-red-600 transition text-xl"
                        title="Delete"
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-gray-400">
                    No tasks found. Add one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
