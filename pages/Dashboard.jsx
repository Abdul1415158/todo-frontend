import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../services/api'

export default function Dashboard() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [newTask, setNewTask] = useState('')
    const [adding, setAdding] = useState(false)
    const [editingTaskId, setEditingTaskId] = useState(null)
    const [editingTaskTitle, setEditingTaskTitle] = useState('')
    const [savingEdit, setSavingEdit] = useState(false)

    useEffect(() => {
        fetchTasks()
    }, [])

    const fetchTasks = async () => {
        try {
            const res = await API.get('/notes')
            setTasks(res.data.notes ?? [])
        } catch (err) {
            console.error('Failed to load tasks', err)
            setTasks([])
        } finally {
            setLoading(false)
        }
    }

    const handleAddTask = async (e) => {
        e.preventDefault()
        if (!newTask.trim()) return
        setAdding(true)
        try {
            const res = await API.post('/notes', { title: newTask, completed: false })
            setTasks((prev) => (Array.isArray(prev) ? [res.data.note, ...prev] : [res.data.note]))
            setNewTask('')
        } catch (err) {
            console.error('Failed to add task', err)
        } finally {
            setAdding(false)
        }
    }

    const toggleTask = async (id, completed) => {
        setTasks((prev) =>
            Array.isArray(prev)
                ? prev.map((t) => (t._id === id ? { ...t, completed: !completed } : t))
                : prev
        )
        try {
            await API.put(`/notes/${id}`, { completed: !completed })
        } catch (err) {
            console.error('Failed to update task', err)
        }
    }

    const deleteTask = async (id) => {
        setTasks((prev) => (Array.isArray(prev) ? prev.filter((t) => t._id !== id) : prev))
        try {
            await API.delete(`/notes/${id}`)
        } catch (err) {
            console.error('Failed to delete task', err)
        }
    }

    const startEditing = (task) => {
        setEditingTaskId(task._id)
        setEditingTaskTitle(task.title)
    }

    const cancelEditing = () => {
        setEditingTaskId(null)
        setEditingTaskTitle('')
    }

    const saveEditing = async (id) => {
        if (!editingTaskTitle.trim()) return
        setSavingEdit(true)
        try {
            const res = await API.put(`/notes/${id}`, { title: editingTaskTitle.trim() })
            setTasks((prev) =>
                Array.isArray(prev)
                    ? prev.map((t) => (t._id === id ? res.data.note : t))
                    : prev
            )
            cancelEditing()
        } catch (err) {
            console.error('Failed to save task', err)
        } finally {
            setSavingEdit(false)
        }
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const completedCount = Array.isArray(tasks) ? tasks.filter((t) => t.completed).length : 0
    const pendingCount = Array.isArray(tasks) ? tasks.length - completedCount : 0

    return (
        <div className="min-h-screen bg-slate-50 flex">

            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex-col hidden md:flex">
                <div className="px-6 py-6 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                            <span className="text-slate-900 font-bold text-sm">A</span>
                        </div>
                        <span className="font-semibold text-lg">TaskFlow</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
                    <a className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/10 text-sm font-medium">
                        <span>📋</span> Tasks
                    </a>
                    <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white text-sm font-medium transition">
                        <span>📊</span> Analytics
                    </a>
                    <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white text-sm font-medium transition">
                        <span>⚙️</span> Settings
                    </a>
                </nav>

                <div className="px-4 py-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-white/5 hover:text-white text-sm font-medium transition"
                    >
                        <span>🚪</span> Log out
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col">

                {/* Topbar */}
                <header className="bg-white border-b border-slate-200 px-3 sm:px-6 md:px-10 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-slate-900">
                            Welcome{user?.name ? `, ${user.name}` : ''} 👋
                        </h1>
                        <p className="text-sm text-slate-500">Here's what's on your plate today</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-medium text-sm">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                </header>

                {/* Mobile nav */}
                <div className="md:hidden bg-white border-b border-slate-200 px-3 py-3">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">A</span>
                            </div>
                            <span className="font-semibold text-slate-900">TaskFlow</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-sm text-slate-700 hover:text-slate-900 font-medium"
                        >
                            Log out
                        </button>
                    </div>
                    <nav className="flex items-center justify-between gap-2 text-sm">
                        <button className="flex-1 px-3 py-2 rounded-lg bg-slate-900 text-white text-center">Tasks</button>
                        <button className="flex-1 px-3 py-2 rounded-lg bg-slate-100 text-slate-700">Analytics</button>
                        <button className="flex-1 px-3 py-2 rounded-lg bg-slate-100 text-slate-700">Settings</button>
                    </nav>
                </div>

                <main className="flex-1 px-3 sm:px-6 md:px-10 py-8 max-w-4xl w-full mx-0 sm:mx-auto">

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-white border border-slate-200 rounded-2xl p-5">
                            <p className="text-sm text-slate-500">Total</p>
                            <p className="text-2xl font-semibold text-slate-900 mt-1">{tasks.length}</p>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-2xl p-5">
                            <p className="text-sm text-slate-500">Pending</p>
                            <p className="text-2xl font-semibold text-amber-600 mt-1">{pendingCount}</p>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-2xl p-5">
                            <p className="text-sm text-slate-500">Completed</p>
                            <p className="text-2xl font-semibold text-emerald-600 mt-1">{completedCount}</p>
                        </div>
                    </div>

                    {/* Add task */}
                    <form onSubmit={handleAddTask} className="flex gap-3 mb-6">
                        <input
                            type="text"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder="Add a new task…"
                            className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition"
                        />
                        <button
                            type="submit"
                            disabled={adding}
                            className="px-5 py-2.5 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 active:scale-[0.98] transition disabled:opacity-50"
                        >
                            {adding ? 'Adding…' : 'Add'}
                        </button>
                    </form>

                    {/* Task list */}
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                        {loading ? (
                            <p className="text-center text-slate-400 py-10 text-sm">Loading tasks…</p>
                        ) : tasks.length === 0 ? (
                            <p className="text-center text-slate-400 py-10 text-sm">No tasks yet. Add one above 👆</p>
                        ) : (
                            <ul className="divide-y divide-slate-100">
                                {tasks.map((task) => (
                                    <li
                                        key={task._id}
                                        className="flex min-w-0 items-center gap-3 px-5 py-4 hover:bg-slate-50 transition"
                                    >
                                        <button
                                            onClick={() => toggleTask(task._id, task.completed)}
                                            className={`w-5 h-5 rounded-full border-2 shrink-0 transition ${task.completed
                                                ? 'bg-slate-900 border-slate-900'
                                                : 'border-slate-300 hover:border-slate-500'
                                                }`}
                                        />
                                        {editingTaskId === task._id ? (
                                            <div className="flex-1 min-w-0 flex items-center gap-2 sm:gap-3">
                                                <input
                                                    value={editingTaskTitle}
                                                    onChange={(e) => setEditingTaskTitle(e.target.value)}
                                                    className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition"
                                                    style={{ maxWidth: '100%', overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                                                />
                                                <button
                                                    onClick={() => saveEditing(task._id)}
                                                    disabled={savingEdit}
                                                    className="shrink-0 px-3 py-2 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800 transition disabled:opacity-50"
                                                >
                                                    {savingEdit ? 'Saving…' : 'Save'}
                                                </button>
                                                <button
                                                    onClick={cancelEditing}
                                                    className="shrink-0 px-3 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm hover:bg-slate-50 transition"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <span
                                                    className={`flex-1 min-w-0 text-sm whitespace-normal break-words ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}
                                                    style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                                                >
                                                    {task.title}
                                                </span>
                                                <button
                                                    onClick={() => startEditing(task)}
                                                    className="text-slate-500 hover:text-slate-900 text-sm transition shrink-0"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => deleteTask(task._id)}
                                                    className="text-slate-400 hover:text-red-600 text-sm transition shrink-0"
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}