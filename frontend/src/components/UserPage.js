// src/components/UserPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/UserPage.css'; // Import the CSS file for styling
import ReportForm from './ReportForm';
import UserReports from './UserReports';
import LiveChatUser from './LiveChatUser'; // Uncomment this when implementing LiveChat
import Inbox from './Inbox';  // Import Inbox component for the user
import SendMessage from './SendMessage'; // Import SendMessage component



const UserPage = () => {
    const [view, setView] = useState('dashboard');
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [attributesList, setAttributesList] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');

    // Fetch categories and user's products from the backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get the token from localStorage
                const token = localStorage.getItem('token');

                // Fetch categories
                const categoriesResponse = await axios.get('http://localhost:5000/categories');
                setCategories(categoriesResponse.data);

                // Fetch user's products
                const productsResponse = await axios.get('http://localhost:5000/user/products', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setProducts(productsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    // Handle form submission for adding/updating a product
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('name', productName);
            formData.append('description', productDescription);
            formData.append('category', selectedCategory);
            const attributes = attributesList.reduce((acc, attr) => {
                acc[attr.name] = attr.value;
                return acc;
            }, {});
            formData.append('attributes', JSON.stringify(attributes));

            if (imageFile) {
                formData.append('image_file', imageFile);
            } else if (imageUrl) {
                formData.append('image_url', imageUrl);
            }

            if (selectedProduct) {
                // Update existing product
                await axios.put(
                    `http://localhost:5000/user/products/${selectedProduct.id}`,
                    formData,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
                setMessage('Product updated successfully!');
            } else {
                // Add new product
                await axios.post(
                    'http://localhost:5000/user/products',
                    formData,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
                setMessage('Product added successfully!');
            }

            // Refresh the products list
            const productsResponse = await axios.get('http://localhost:5000/user/products', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setProducts(productsResponse.data);

            // Clear the form
            resetForm();
        } catch (error) {
            console.error('Error adding/updating product:', error);
            setMessage('Failed to add/update product.');
        }
    };

    // Handle adding a new attribute
    const handleAddAttribute = () => {
        setAttributesList([...attributesList, { name: '', value: '' }]);
    };

    // Handle changing an attribute name or value
    const handleAttributeChange = (index, field, value) => {
        const updatedAttributes = [...attributesList];
        updatedAttributes[index][field] = value;
        setAttributesList(updatedAttributes);
    };

    // Handle removing an attribute
    const handleRemoveAttribute = (index) => {
        const updatedAttributes = attributesList.filter((_, idx) => idx !== index);
        setAttributesList(updatedAttributes);
    };

    // Handle editing a product
    const handleEdit = (product) => {
        setSelectedProduct(product);
        setProductName(product.name);
        setProductDescription(product.description);
        setSelectedCategory(product.category);
        const attributesArray = Object.entries(product.attributes || {}).map(([name, value]) => ({ name, value }));
        setAttributesList(attributesArray);
        setImageFile(null);
        setImageUrl('');
        setView('addProduct');
    };

    // Reset form
    const resetForm = () => {
        setSelectedProduct(null);
        setProductName('');
        setProductDescription('');
        setSelectedCategory('');
        setAttributesList([]);
        setImageFile(null);
        setImageUrl('');
        setMessage('');
        setView('products');
    };

    // Handle deleting a product
    const handleDelete = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/user/products/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setMessage('Product deleted successfully!');

            // Refresh the products list
            setProducts(products.filter((product) => product.id !== productId));
        } catch (error) {
            console.error('Error deleting product:', error);
            setMessage('Failed to delete product.');
        }
    };

    // Render products list
    const renderProducts = () => (
        <div className="products-section">
            <h2>Your Products</h2>
            {message && <p className="message">{message}</p>}
            <button onClick={() => setView('addProduct')}>Add New Product</button>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Attributes</th>
                        <th>Image</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.category}</td>
                            <td>{product.description}</td>
                            <td>
                                {product.attributes &&
                                    Object.entries(product.attributes).map(([key, value]) => (
                                        <div key={key}>
                                            <strong>{key}:</strong> {value}
                                        </div>
                                    ))}
                            </td>
                            <td>
                                {product.image && (
                                    <img src={product.image} alt={product.name} width="100" />
                                )}
                            </td>
                            <td>
                                <button className="edit-btn" onClick={() => handleEdit(product)}>
                                    Edit
                                </button>
                                <button className="delete-btn" onClick={() => handleDelete(product.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    // Render add/update product form
    const renderAddProductForm = () => (
        <div className="add-product-section">
            <h2>{selectedProduct ? 'Update Product' : 'Add a New Product'}</h2>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div>
                    <label>Product Name:</label><br />
                    <input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Product Description:</label><br />
                    <textarea
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div>
                    <label>Select Category:</label><br />
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        required
                    >
                        <option value="">-- Select Category --</option>
                        {categories.map((category, index) => (
                            <option key={index} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Product Attributes:</label>
                    {attributesList.map((attribute, index) => (
                        <div key={index} className="attribute-row">
                            <input
                                type="text"
                                placeholder="Attribute Name"
                                value={attribute.name}
                                onChange={(e) => handleAttributeChange(index, 'name', e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Attribute Value"
                                value={attribute.value}
                                onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                                required
                            />
                            <button type="button" onClick={() => handleRemoveAttribute(index)}>
                                Remove
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddAttribute}>
                        Add Attribute
                    </button>
                </div>
                {/* Image Upload */}
                <div>
                    <label>Product Image:</label><br />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files[0])}
                    />
                    <p>Or</p>
                    <input
                        type="text"
                        placeholder="Image URL"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                    />
                </div>
                <button type="submit">{selectedProduct ? 'Update Product' : 'Add Product'}</button>
                <button type="button" onClick={resetForm}>Cancel</button>
            </form>
        </div>
    );

    return (
        <div className="user-dashboard">
            {/* Sidebar */}
            <div className="sidebar">
                <h2>User Panel</h2>
                <ul className="sidebar-menu">
                    <li onClick={() => setView('dashboard')}>Dashboard</li>
                    <li onClick={() => setView('categories')}>Categories</li>
                    <li onClick={() => setView('products')}>Products</li>
                    <li onClick={() => setView('reportForm')}>Report Issue</li>
                    <li onClick={() => setView('userReports')}>Your Reports</li>
                    <li onClick={() => setView('support')}>Support</li> {/* New Support Menu Item */}
                    <li onClick={() => setView('messages')}>Messages</li> {/* Add Messages panel */}

                </ul>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className="header">
                    <h1>User Dashboard</h1>
                </div>

                {view === 'dashboard' && (
                    <div>
                        <p>Welcome to your user dashboard!</p>
                    </div>
                )}

                {view === 'categories' && (
                    <div className="categories-section">
                        <h2>Categories</h2>
                        <ul>
                            {categories.map((category, index) => (
                                <li key={index}>{category}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {view === 'products' && renderProducts()}

                {view === 'addProduct' && renderAddProductForm()}

                {view === 'reportForm' && <ReportForm />}

                {view === 'userReports' && <UserReports />}
                {view === 'support' && (
                    <div className="support-section">
                        <h2>Support</h2>
                        <LiveChatUser /> {/* LiveChatUser component renders the chat area */}
                    </div>
                )}
                {view === 'messages' && (
                    <div>
                        <Inbox /> {/* User's inbox */}
                        <SendMessage /> {/* User can send messages */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserPage;
