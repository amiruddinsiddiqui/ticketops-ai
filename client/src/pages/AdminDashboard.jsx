import React, { useEffect, useState } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/auth/get-users');
            setUsers(data.users);
        } catch (err) {
            setError('Failed to fetch users. Ensure you are an Admin.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = (email, newRole) => {
        setUsers(users.map(u => u.email === email ? { ...u, role: newRole } : u));
    };

    const handleSkillChange = (email, e) => {
        const newSkills = e.target.value.split(',').map(s => s.trim());
        setUsers(users.map(u => u.email === email ? { ...u, skills: newSkills } : u));
    }


    const saveChanges = async (user) => {
        try {
            await api.post('/auth/update-user', {
                email: user.email,
                role: user.role,
                skills: user.skills
            });
            alert(`Updated ${user.email} successfully!`);
        } catch (err) {
            console.error(err);
            alert('Failed to update user.');
        }
    };

    if (loading) return <div className="p-8 text-white">Loading users...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            <div className="overflow-x-auto bg-gray-800 rounded-lg shadow">
                <table className="w-full text-left">
                    <thead className="bg-gray-700 text-gray-300 border-b border-gray-600">
                        <tr>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Skills (comma separated)</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="border-b border-gray-700 hover:bg-gray-750">
                                <td className="p-4">{user.email}</td>
                                <td className="p-4">
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.email, e.target.value)}
                                        className="bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                                    >
                                        <option value="user">User</option>
                                        <option value="moderator">Moderator</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className="p-4">
                                    <input
                                        type="text"
                                        value={user.skills.join(', ')}
                                        onChange={(e) => handleSkillChange(user.email, e)}
                                        className="bg-gray-700 text-white p-2 rounded w-full border border-gray-600 focus:border-blue-500 focus:outline-none"
                                    />
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => saveChanges(user)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                                    >
                                        Save
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="mt-4 text-gray-400 text-sm">
                * Note: The AI Agent assigns tickets to 'Moderator' based on matching skills.
            </p>
        </div>
    );
};

export default AdminDashboard;
