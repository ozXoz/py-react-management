import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Categories.css'; // Import the CSS file

const Categories = () => {
    const [categoryName, setCategoryName] = useState('');
    const [categories, setCategories] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch existing categories when component mounts
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:5000/categories');
                setCategories(response.data); // Set fetched categories to state
            } catch (error) {
                setErrorMessage('Error fetching categories');
            }
        };

        fetchCategories();
    }, []);

    // Handle Add Category form submission
    const handleAddCategory = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const token = localStorage.getItem('token'); // Assuming JWT is stored in localStorage
            const response = await axios.post(
                'http://localhost:5000/admin/categories',
                { category: categoryName },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            setSuccessMessage(response.data.message);
            setCategoryName(''); // Clear the input field after success

            // Refetch categories after adding new one
            const updatedCategories = await axios.get('http://localhost:5000/categories');
            setCategories(updatedCategories.data);
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response);
                setErrorMessage(error.response.data.message || 'Failed to add category');
            } else {
                console.error('Error:', error);
                setErrorMessage('An unexpected error occurred');
            }
        }
    };

    return (
        <div className="category-section">
            <h2>Add New Category (Admin Only)</h2>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <form onSubmit={handleAddCategory} className="category-form">
                <input
                    type="text"
                    placeholder="Category Name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    required
                />
                <button type="submit">Add Category</button>
            </form>

            <h3>Available Categories</h3>
            <ul className="category-list">
                {categories.map((category, index) => (
                    <li key={index}>{category}</li>
                ))}
            </ul>
        </div>
    );
};

export default Categories;
