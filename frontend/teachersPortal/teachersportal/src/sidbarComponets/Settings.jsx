import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/Settings.css';

const SettingsProfile = () => {
    const [teacher, setTeacher] = useState({});
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [formValues, setFormValues] = useState({});
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

    useEffect(() => {
        const fetchTeacherInfo = async () => {
            const token = localStorage.getItem('token');
            const { data } = await axios.post('https://edumax.fly.dev/api/auth/profile', { token });
            setTeacher(data.message[0]);
            //console.log(data.message[0])
            setFormValues(data.message[0]);
        };

        fetchTeacherInfo();
    }, []);

    const handleChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value
        });
    };

    const handlePasswordChange = (e) => {
        setPasswords({
            ...passwords,
            [e.target.name]: e.target.value
        });
    };

    const saveChanges = async () => {
        const token = localStorage.getItem('token');
        await axios.put('https://edumax.fly.dev/api/auth/update-profile', { token, ...formValues });
        setShowConfirmationModal(false);
    };

    const changePassword = async () => {
        const token = localStorage.getItem('token');
        await axios.put('https://edumax.fly.dev/api/auth/change-password', { token, ...passwords });
        setShowPasswordModal(false);
    };

    const confirmSave = () => {
        setShowConfirmationModal(true);
    };

    return (
        <div className="container">
            <h2 className="header">Teacher Settings</h2>
            <div className="card-container">
                <div className="card">
                    <div className="card-header">Personal Information</div>
                    <div className="card-body">
                        <form>
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" name="name" value={formValues.name || ''} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" name="email" value={formValues.email || ''} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Gender</label>
                                <input type="text" name="gender" value={formValues.gender || ''} onChange={handleChange} />
                            </div>
                        </form>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">Contact Information</div>
                    <div className="card-body">
                        <form>
                            <div className="form-group">
                                <label>Phone</label>
                                <input type="text" name="phone" value={formValues.phone || ''} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Address</label>
                                <input type="text" name="address" value={formValues.address || ''} onChange={handleChange} />
                            </div>
                        </form>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">Professional Information</div>
                    <div className="card-body">
                        <form>
                            <div className="form-group">
                                <label>Department</label>
                                <input type="text" name="department" value={formValues.department || ''} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>TSC</label>
                                <input type="text" name="TSC" value={formValues.TSC || ''} onChange={handleChange} />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
                <div className="button-group">
                    <button type="button" className="btn primary" onClick={confirmSave}>
                        Save Changes
                    </button>
                    <button type="button" className="btn secondary" onClick={() => setShowPasswordModal(true)}>
                        Change Password
                    </button>
                </div>
           

            {showPasswordModal && (
                <div className="modal">
                <div className="modal-content">
                    <span className="close" onClick={() => setShowPasswordModal(false)}>&times;</span>
                    <h3>Change Password</h3>
                    <form>
                        <div className="form-group">
                            <label>Current Password</label>
                            <input type="password" name="currentPassword" value={passwords.currentPassword} onChange={handlePasswordChange} />
                        </div>
                        <div className="form-group">
                            <label>New Password</label>
                            <input type="password" name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange} />
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handlePasswordChange} />
                        </div>
                        <div className="button-group">
                            <button type="button" className="btn primary" onClick={changePassword}>
                                Change Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {showConfirmationModal && (
            <div className="modal">
                <div className="modal-content">
                    <span className="close" onClick={() => setShowConfirmationModal(false)}>&times;</span>
                    <h3>Confirm Save</h3>
                    <form>
                        <div className="form-group">
                            <label>Enter Password to Confirm Changes</label>
                            <input type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handlePasswordChange} />
                        </div>
                        <div className="button-group">
                            <button type="button" className="btn primary" onClick={saveChanges}>
                                Confirm
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
);
};

export default SettingsProfile;
