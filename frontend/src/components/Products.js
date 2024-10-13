// src/components/Products.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Products.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // States for adding a new product
    const [newProduct, setNewProduct] = useState({
        name: '',
        category: '',
        attributes: {},
    });
    const [newAttributeName, setNewAttributeName] = useState('');
    const [newAttributeValue, setNewAttributeValue] = useState('');
    const [newImageFile, setNewImageFile] = useState(null);
    const [newImageUrl, setNewImageUrl] = useState('');

    // State for editing a product
    const [editProduct, setEditProduct] = useState(null);
    const [editAttributeName, setEditAttributeName] = useState('');
    const [editAttributeValue, setEditAttributeValue] = useState('');
    const [editImageFile, setEditImageFile] = useState(null);
    const [editImageUrl, setEditImageUrl] = useState('');

    // Fetch products and categories on component mount
    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/products');
            setProducts(response.data);
        } catch (error) {
            setError('Failed to fetch products');
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5000/categories');
            setCategories(response.data);
        } catch (error) {
            setError('Failed to fetch categories');
        }
    };

    // Function to add a new product
    const handleAddProduct = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('name', newProduct.name);
            formData.append('category', newProduct.category);
            formData.append('attributes', JSON.stringify(newProduct.attributes));

            if (newImageFile) {
                formData.append('image_file', newImageFile);
            } else if (newImageUrl) {
                formData.append('image_url', newImageUrl);
            }

            const response = await axios.post(
                'http://localhost:5000/admin/products',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            setSuccessMessage(response.data.message);
            setNewProduct({ name: '', category: '', attributes: {} });
            setNewAttributeName('');
            setNewAttributeValue('');
            setNewImageFile(null);
            setNewImageUrl('');
            fetchProducts(); // Refresh product list
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || 'Failed to add product');
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    // Function to add an attribute to the new product
    const handleNewAttributeAdd = () => {
        if (newAttributeName && newAttributeValue) {
            setNewProduct((prev) => ({
                ...prev,
                attributes: {
                    ...prev.attributes,
                    [newAttributeName]: newAttributeValue,
                },
            }));
            setNewAttributeName('');
            setNewAttributeValue('');
        }
    };

    // Handle Edit Button Click
    const handleEditProduct = (product) => {
        setEditProduct({
            ...product,
            removeAttributes: [], // Initialize removeAttributes array
        });
        setEditAttributeName('');
        setEditAttributeValue('');
        setEditImageFile(null);
        setEditImageUrl('');
        setError('');
        setSuccessMessage('');
    };

    // Functions for editing attributes
    const handleEditAttributeChange = (attrName, value) => {
        setEditProduct((prev) => ({
            ...prev,
            attributes: {
                ...prev.attributes,
                [attrName]: value,
            },
        }));
    };

    const handleEditAttributeAdd = () => {
        if (editAttributeName && editAttributeValue) {
            setEditProduct((prev) => ({
                ...prev,
                attributes: {
                    ...prev.attributes,
                    [editAttributeName]: editAttributeValue,
                },
            }));
            setEditAttributeName('');
            setEditAttributeValue('');
        }
    };

    const handleRemoveAttribute = (attrName) => {
        setEditProduct((prev) => {
            const newAttributes = { ...prev.attributes };
            delete newAttributes[attrName];
            return {
                ...prev,
                attributes: newAttributes,
                removeAttributes: [...prev.removeAttributes, attrName],
            };
        });
    };

    const saveEditedProduct = async () => {
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('name', editProduct.name);
            formData.append('category', editProduct.category);
            formData.append('attributes', JSON.stringify(editProduct.attributes));
            formData.append('remove_attributes', JSON.stringify(editProduct.removeAttributes));

            if (editImageFile) {
                formData.append('image_file', editImageFile);
            } else if (editImageUrl) {
                formData.append('image_url', editImageUrl);
            }

            await axios.put(
                `http://localhost:5000/admin/products/${editProduct.id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            setSuccessMessage('Product updated successfully');
            setEditProduct(null);
            fetchProducts(); // Refresh product list
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || 'Failed to update product');
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    // Function to delete a product
    const handleDeleteProduct = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/admin/products/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSuccessMessage('Product deleted successfully');
            fetchProducts(); // Refresh product list
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || 'Failed to delete product');
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    return (
        <div className="products-container">
            <h2>Manage Products</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

            {/* Add Product Form */}
            <form onSubmit={handleAddProduct}>
                <h3>Add New Product</h3>
                <input
                    type="text"
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={(e) =>
                        setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    required
                />
                <select
                    value={newProduct.category}
                    onChange={(e) =>
                        setNewProduct({ ...newProduct, category: e.target.value })
                    }
                    required
                >
                    <option value="">Select Category</option>
                    {categories.map((cat, index) => (
                        <option key={index} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>

                {/* Dynamic Attributes for New Product */}
                <div>
                    <h4>Attributes</h4>
                    {Object.entries(newProduct.attributes).map(([key, value], index) => (
                        <p key={index}>
                            {key}: {value}
                        </p>
                    ))}
                    <input
                        type="text"
                        placeholder="Attribute Name"
                        value={newAttributeName}
                        onChange={(e) => setNewAttributeName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Attribute Value"
                        value={newAttributeValue}
                        onChange={(e) => setNewAttributeValue(e.target.value)}
                    />
                    <button type="button" onClick={handleNewAttributeAdd}>
                        Add Attribute
                    </button>
                </div>

                {/* Image Upload */}
                <div>
                    <h4>Product Image</h4>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setNewImageFile(e.target.files[0])}
                    />
                    <p>Or</p>
                    <input
                        type="text"
                        placeholder="Image URL"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                    />
                </div>

                <button type="submit">Add Product</button>
            </form>

            {/* Edit Product Modal */}
            {editProduct && (
                <div className="edit-product-modal">
                    <h3>Edit Product</h3>
                    <input
                        type="text"
                        name="name"
                        placeholder="Product Name"
                        value={editProduct.name}
                        onChange={(e) =>
                            setEditProduct({ ...editProduct, name: e.target.value })
                        }
                    />
                    <select
                        name="category"
                        value={editProduct.category}
                        onChange={(e) =>
                            setEditProduct({ ...editProduct, category: e.target.value })
                        }
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat, index) => (
                            <option key={index} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>

                    {/* Edit Attributes */}
                    <div>
                        <h4>Attributes</h4>
                        {Object.entries(editProduct.attributes || {}).map(
                            ([key, value], index) => (
                                <div key={index}>
                                    <input type="text" value={key} readOnly />
                                    <input
                                        type="text"
                                        value={value}
                                        onChange={(e) =>
                                            handleEditAttributeChange(key, e.target.value)
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveAttribute(key)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            )
                        )}
                        {/* Add new attribute */}
                        <div>
                            <input
                                type="text"
                                placeholder="Attribute Name"
                                value={editAttributeName}
                                onChange={(e) => setEditAttributeName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Attribute Value"
                                value={editAttributeValue}
                                onChange={(e) => setEditAttributeValue(e.target.value)}
                            />
                            <button type="button" onClick={handleEditAttributeAdd}>
                                Add Attribute
                            </button>
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <h4>Product Image</h4>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setEditImageFile(e.target.files[0])}
                        />
                        <p>Or</p>
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={editImageUrl}
                            onChange={(e) => setEditImageUrl(e.target.value)}
                        />
                        {editProduct.image && (
                            <div>
                                <p>Current Image:</p>
                                <img src={editProduct.image} alt="Product" width="100" />
                            </div>
                        )}
                    </div>

                    <button type="button" onClick={saveEditedProduct}>
                        Save Changes
                    </button>
                    <button type="button" onClick={() => setEditProduct(null)}>
                        Cancel
                    </button>
                </div>
            )}

            {/* Product List */}
            <h3>Product List</h3>
            <table className="product-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
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
                            <td>
                                {Object.entries(product.attributes || {}).map(
                                    ([key, value], index) => (
                                        <p key={index}>
                                            {key}: {value}
                                        </p>
                                    )
                                )}
                            </td>
                            <td>
                                {product.image && (
                                    <img src={product.image} alt={product.name} width="100" />
                                )}
                            </td>
                            <td>
                                <button onClick={() => handleEditProduct(product)}>
                                    Edit
                                </button>
                                <button onClick={() => handleDeleteProduct(product.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Products;
