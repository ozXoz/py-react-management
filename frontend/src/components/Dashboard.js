import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import '../css/Dashboard.css'; // Import CSS

const Dashboard = () => {
    // Example data for the charts
    const data = [
        { name: 'Jan', sales: 4000, users: 2400 },
        { name: 'Feb', sales: 3000, users: 2210 },
        { name: 'Mar', sales: 2000, users: 2290 },
        { name: 'Apr', sales: 2780, users: 2000 },
        { name: 'May', sales: 1890, users: 2181 },
        { name: 'Jun', sales: 2390, users: 2500 },
        { name: 'Jul', sales: 3490, users: 2100 },
    ];

    return (
        <div className="dashboard-container">
            <h2>Dashboard Overview</h2>

            {/* Line Chart */}
            <div className="chart-container">
                <h3>Monthly Sales and Users</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                        <Line type="monotone" dataKey="users" stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="chart-container">
                <h3>Sales Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="sales" fill="#8884d8" />
                        <Bar dataKey="users" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Dashboard;
