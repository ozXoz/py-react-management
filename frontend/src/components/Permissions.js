// src/components/Permissions.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Permissions = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/admin/users', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setUsers(response.data);
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
                        'Authorization': `Bearer ${token}`,
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
        }
    };

    return (
        <div className="permissions">
            <h2>User Permissions</h2>
            <table>
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
                            <td>{user.email}</td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={user.permissions.add_product}
                                    onChange={(e) =>
                                        handlePermissionChange(user.id, 'add_product', e.target.checked)
                                    }
                                />
                            </td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={user.permissions.update_product}
                                    onChange={(e) =>
                                        handlePermissionChange(user.id, 'update_product', e.target.checked)
                                    }
                                />
                            </td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={user.permissions.delete_product}
                                    onChange={(e) =>
                                        handlePermissionChange(user.id, 'delete_product', e.target.checked)
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
