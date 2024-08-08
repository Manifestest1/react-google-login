import React, { useState } from 'react';
import axios from 'axios';
import { AppHeader, AppSidebar } from '../../../components';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError('New password and confirmation do not match');
            return;
        }

        const token = localStorage.getItem('authToken'); // Make sure this key matches how you store it

        if (!token) {
            setError('No authentication token found. Please log in.');
            return;
        }
        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/api/change-password',
                {
                    current_password: currentPassword,
                    new_password: newPassword,
                    new_password_confirmation: confirmPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setMessage(response.data.message);
            setError('');
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'An error occurred';
            setError(errorMsg);
            setMessage('');
        }
    };

    return (
        <>
            <AppHeader />
            <div className=" mt-5 d-flex justify-content-center align-items-center min-vh-100">
                <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
                    <div className="card-body">
                        <h2 className="card-title mb-4">Change Password</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="currentPassword" className="form-label">Current Password</label>
                                <input
                                    type="password"
                                    id="currentPassword"
                                    className="form-control"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="newPassword" className="form-label">New Password</label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    className="form-control"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    className="form-control"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {error && <div className="alert alert-danger" role="alert">{error}</div>}
                            {message && <div className="alert alert-success" role="alert">{message}</div>}
                            <button type="submit" className="btn btn-primary">Change Password</button>
                        </form>
                    </div>
                </div>
            </div>
            <AppSidebar />
        </>
    );
};

export default ChangePassword;
