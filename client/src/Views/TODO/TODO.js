import { useEffect, useState } from 'react';
import Styles from './TODO.module.css';
import { dummy } from './dummy';
import axios from 'axios';

export function TODO() {
    const [newTodo, setNewTodo] = useState('');
    const [todoData, setTodoData] = useState(dummy);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editingTitle, setEditingTitle] = useState('');
    const [editingDescription, setEditingDescription] = useState('');

    useEffect(() => {
        const fetchTodo = async () => {
            try {
                const apiData = await getTodo();
                setTodoData(apiData);
            } catch (error) {
                setError('Failed to fetch tasks');
            } finally {
                setLoading(false);
            }
        };
        fetchTodo();
    }, []);

    const getTodo = async () => {
        const options = {
            method: 'GET',
            url: `http://localhost:8000/api/todo`,
            headers: {
                accept: 'application/json',
            },
        };
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const addTodo = async () => {
        const options = {
            method: 'POST',
            url: `http://localhost:8000/api/todo`,
            headers: {
                accept: 'application/json',
            },
            data: {
                title: newTodo,
                description: '',
            },
        };
        try {
            const response = await axios.request(options);
            setTodoData((prevData) => [...prevData, response.data.newTodo]);
            setNewTodo('');
        } catch (err) {
            console.error(err);
            setError('Failed to add task');
        }
    };

    const deleteTodo = async (id) => {
        const options = {
            method: 'DELETE',
            url: `http://localhost:8000/api/todo/${id}`,
            headers: {
                accept: 'application/json',
            },
        };
        try {
            await axios.request(options);
            setTodoData((prevData) => prevData.filter((todo) => todo._id !== id));
        } catch (err) {
            console.error(err);
            setError('Failed to delete task');
        }
    };

    const updateTodo = async (id, title, description, done) => {
        const options = {
            method: 'PATCH',
            url: `http://localhost:8000/api/todo/${id}`,
            headers: {
                accept: 'application/json',
            },
            data: {
                title,
                description,
                done,
            },
        };
        try {
            const response = await axios.request(options);
            setTodoData((prevData) => prevData.map((todo) => (todo._id === id ? response.data : todo)));
            setEditingId(null);
            setEditingTitle('');
            setEditingDescription('');
        } catch (err) {
            console.error(err);
            setError('Failed to update task');
        }
    };

    const startEditing = (id, title, description) => {
        setEditingId(id);
        setEditingTitle(title);
        setEditingDescription(description);
    };

    return (
        <div className={Styles.ancestorContainer}>
            <div className={Styles.headerContainer}>
                <h1>Tasks</h1>
                <span>
                    <input
                        className={Styles.todoInput}
                        type='text'
                        name='New Todo'
                        value={newTodo}
                        onChange={(event) => {
                            setNewTodo(event.target.value);
                        }}
                    />
                    <button
                        id='addButton'
                        name='add'
                        className={Styles.addButton}
                        onClick={addTodo}
                    >
                        + New Todo
                    </button>
                </span>
            </div>
            <div id='todoContainer' className={Styles.todoContainer}>
                {loading ? (
                    <p style={{ color: 'white' }}>Loading...</p>
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : (
                    todoData.length > 0 ? (
                        todoData.map((entry) => (
                            <div key={entry._id} className={Styles.todo}>
                                {editingId === entry._id ? (
                                    <div>
                                        <input
                                            type='text'
                                            value={editingTitle}
                                            onChange={(e) => setEditingTitle(e.target.value)}
                                        />
                                        <textarea
                                            value={editingDescription}
                                            onChange={(e) => setEditingDescription(e.target.value)}
                                        />
                                        <button
                                            onClick={() =>
                                                updateTodo(
                                                    entry._id,
                                                    editingTitle,
                                                    editingDescription,
                                                    entry.done
                                                )
                                            }
                                        >
                                            Save
                                        </button>
                                        <button onClick={() => setEditingId(null)}>Cancel</button>
                                    </div>
                                ) : (
                                    <div>
                                        <span className={Styles.infoContainer}>
                                            <input
                                                type='checkbox'
                                                checked={entry.done}
                                                onChange={() => {
                                                    updateTodo(
                                                        entry._id,
                                                        entry.title,
                                                        entry.description,
                                                        !entry.done
                                                    );
                                                }}
                                            />
                                            <span>{entry.title}</span>
                                            <span>{entry.description}</span>
                                        </span>
                                        <span style={{ cursor: 'pointer' }} onClick={() => startEditing(entry._id, entry.title, entry.description)}>
                                            Edit
                                        </span>
                                        <span style={{ cursor: 'pointer' }} onClick={() => deleteTodo(entry._id)}>
                                            Delete
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className={Styles.noTodoMessage}>No tasks available. Please add a new task.</p>
                    )
                )}
            </div>
        </div>
    );
}
