import React, { useState, useEffect } from 'react';
import '../css/InventoryCheck.css';

const InventoryCheck = () => {
    const [inventory, setInventory] = useState([]);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = () => {
        fetch('http://localhost:5000/check_inventory', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Fetched inventory data:', data);
            setInventory(data);
        })
        .catch(error => console.error('Error fetching inventory:', error));
    };

    const handleInputChange = (e, index, field) => {
        const updatedInventory = [...inventory];
        updatedInventory[index][field] = e.target.value;
        setInventory(updatedInventory);
    };

    const handleSaveInventory = () => {
        const formattedInventory = inventory.map(item => ({
            product_id: item.id,
            used_today: parseInt(item.used_today, 10) || 0,
        }));

        fetch('http://localhost:5000/save_inventory_check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ inventory: formattedInventory })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            fetchInventory(); // Refresh inventory after saving
        })
        .catch(error => console.error('Error saving inventory:', error));
    };

    return (
        <div className="inventory-container">
            <h2>Inventory Check</h2>
            <table className="inventory-table">
                <thead>
                    <tr>
                        <th>Product ID</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Previous Quantity</th>
                        <th>Current Quantity</th>
                        <th>Price</th>
                        <th>Used Today</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.map((item, index) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.image && <img src={item.image} alt={item.name} className="product-image" />}</td>
                            <td>{item.name}</td>
                            <td>{item.previous_quantity !== undefined && item.previous_quantity !== null ? item.previous_quantity : 'N/A'}</td>
                            <td>{item.quantity !== undefined && item.quantity !== null ? item.quantity : 'N/A'}</td>
                            <td>{item.price !== undefined && item.price !== null ? `$${item.price}` : 'N/A'}</td>
                            <td>
                                <input
                                    type="number"
                                    value={item.used_today || ''}
                                    onChange={(e) => handleInputChange(e, index, 'used_today')}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleSaveInventory}>Save Inventory</button>
        </div>
    );
};

export default InventoryCheck;
