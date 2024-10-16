import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Permissions.css';

const Permissions = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/admin/users', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsers(response.data);
            } catch (error) {
                setError('Failed to fetch users.');
            }
        };
        fetchUsers();
    }, []);

    const handlePermissionChange = async (userId, permissionType, value) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:5000/admin/users/${userId}/permissions`,
                { permissionType, value },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setUsers(
                users.map((user) =>
                    user.id === userId
                        ? {
                              ...user,
                              permissions: {
                                  ...user.permissions,
                                  [permissionType]: value,
                              },
                          }
                        : user
                )
            );
        } catch (error) {
            console.error('Error updating permissions:', error);
            setError('Failed to update permissions.');
        }
    };

    return (
        <div className="permissions">
            <h2>User Permissions</h2>
            {error && <p className="error">{error}</p>}
            <table className="permissions-table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Add Product</th>
                        <th>Update Product</th>
                        <th>Delete Product</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td data-label="User">{user.email}</td>
                            <td data-label="Add Product">
                                <input
                                    type="checkbox"
                                    checked={user.permissions.add_product}
                                    onChange={(e) =>
                                        handlePermissionChange(
                                            user.id,
                                            'add_product',
                                            e.target.checked
                                        )
                                    }
                                />
                            </td>
                            <td data-label="Update Product">
                                <input
                                    type="checkbox"
                                    checked={user.permissions.update_product}
                                    onChange={(e) =>
                                        handlePermissionChange(
                                            user.id,
                                            'update_product',
                                            e.target.checked
                                        )
                                    }
                                />
                            </td>
                            <td data-label="Delete Product">
                                <input
                                    type="checkbox"
                                    checked={user.permissions.delete_product}
                                    onChange={(e) =>
                                        handlePermissionChange(
                                            user.id,
                                            'delete_product',
                                            e.target.checked
                                        )
                                    }
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Permissions;
