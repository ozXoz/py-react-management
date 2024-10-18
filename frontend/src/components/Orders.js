import React, { useState, useEffect } from 'react';
import '../css/Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [receivedOrders, setReceivedOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [orderQuantity, setOrderQuantity] = useState('');

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);
  
  useEffect(() => {
    console.log('Pending Orders:', orders);
    console.log('Received Orders:', receivedOrders);
  }, [orders, receivedOrders]);
  
  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/admin/orders', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
  
      // Separate pending and received orders
      setOrders(data.filter(order => order.status === 'pending'));
      setReceivedOrders(data.filter(order => order.status === 'received'));
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };
  
  
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/check_inventory', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedProduct || !orderQuantity) {
      alert('Please select a product and specify the quantity.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/place_order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          product_id: selectedProduct,
          order_quantity: parseInt(orderQuantity, 10),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Order placed successfully!');
        fetchOrders();  // Fetch updated orders after placing the order
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const handleReceiveOrder = async (orderId) => {
    const confirmReceive = window.confirm("Are you sure you want to mark this order as received?");
    if (!confirmReceive) return;
  
    try {
      const response = await fetch(`http://localhost:5000/admin/orders/receive/${orderId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
  
        // Move the order from "orders" to "receivedOrders" immediately
        const receivedOrder = orders.find(order => order.id === orderId);
        if (receivedOrder) {
          // Update status locally before fetch
          receivedOrder.status = 'received';
  
          // Update state - remove from orders and add to receivedOrders
          setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
          setReceivedOrders(prevReceivedOrders => [...prevReceivedOrders, receivedOrder]);
        }
        
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error receiving order:', error);
    }
  };
  
  
  
  

  return (
    <div className="orders-section">
      <h2>Orders</h2>

      <div className="order-form">
        <h3>Place a New Order</h3>
        <div>
          <label>Product:</label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="">Select a product</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name} (Available: {product.quantity})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Quantity:</label>
          <input
            type="number"
            value={orderQuantity}
            onChange={(e) => setOrderQuantity(e.target.value)}
            min="1"
          />
        </div>
        <button onClick={handlePlaceOrder} className="place-order-btn">Place Order</button>
      </div>

      <div className="tab-buttons">
        <button
          className={activeTab === 'pending' ? 'active' : ''}
          onClick={() => setActiveTab('pending')}
        >
          Pending Orders
        </button>
        <button
          className={activeTab === 'received' ? 'active' : ''}
          onClick={() => setActiveTab('received')}
        >
          Received Orders
        </button>
      </div>

      {activeTab === 'pending' ? (
        <div className="orders-list">
          {orders.length === 0 ? (
            <p>No pending orders available.</p>
          ) : (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.product_name || 'Unknown Product'}</td>
                    <td>{order.order_quantity}</td>
                    <td>{order.status || 'Pending'}</td>
                    <td>
                      <button onClick={() => handleReceiveOrder(order.id)} className="receive-btn">
                        Receive
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="orders-list">
          {receivedOrders.length === 0 ? (
            <p>No received orders available.</p>
          ) : (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {receivedOrders.map(order => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.product_name || 'Unknown Product'}</td>
                    <td>{order.order_quantity}</td>
                    <td>{order.status || 'Received'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;
