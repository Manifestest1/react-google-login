import React, { useState, useEffect } from 'react';
import axios from 'axios';

import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  
  CModalHeader,
  CModalTitle,
  CModalBody,
  CButton
} from '@coreui/react';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [religion, setReligion] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/showuser');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const addUser = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/add_user', {
        name,
        gender,
        religion,
      });
      fetchUsers();
      setShowAddModal(false);
      setName('');
      setGender('');
      setReligion('');
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/delete/${userId}`);
      setUsers(users.filter(user => user.id !== userId));
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/update/${userId}`, {
        name,
      });
      fetchUsers();
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleStatusUpdate = async (user) => {
    try {
      const newStatus = user.is_active === 1 ? 0 : 1;
      await axios.post(`http://127.0.0.1:8000/api/update/${user.id}`, {
        is_active: newStatus,
        type: 'status_update'
      });
      fetchUsers();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <>
      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add User</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    className='form-control'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="gender" className="form-label">Gender</label>
                  <select
                    className="form-select"
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="religion" className="form-label">Religion</label>
                  <select
                    className="form-select"
                    id="religion"
                    value={religion}
                    onChange={(e) => setReligion(e.target.value)}
                  >
                    <option value="">Select religion</option>
                    <option value="christianity">Christianity</option>
                    <option value="islam">Islam</option>
                    <option value="hinduism">Hinduism</option>
                    <option value="buddhism">Buddhism</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={addUser}>Save</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && userId && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="edit-name" className="form-label">Name</label>
                  <input
                    id="edit-name"
                    type="text"
                    placeholder="Enter your name"
                    className='form-control'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleUpdate}>Update</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && (
        <CModal
          visible={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          aria-labelledby="DeleteConfirmationModal"
        >
          <CModalHeader closeButton>
            <CModalTitle id="DeleteConfirmationModal">Delete</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <p>Are you sure you want to delete this user?</p>
            <div className="d-flex justify-content-end">
              <CButton onClick={handleDelete} color="danger">Delete</CButton>
              <CButton color="secondary" className="ms-2" onClick={() => setShowDeleteModal(false)}>Cancel</CButton>
            </div>
          </CModalBody>
        </CModal>
      )}

      {/* Table */}
     
        <CTable className="table table-bordered">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">ID</CTableHeaderCell>
              <CTableHeaderCell scope="col">Name</CTableHeaderCell>
              {/* <CTableHeaderCell scope="col">Gender</CTableHeaderCell>
              <CTableHeaderCell scope="col">Religion</CTableHeaderCell> */}
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
              <CTableHeaderCell scope="col">Status</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {users.map((user) => (
              <CTableRow key={user.id}>
                <CTableDataCell>{user.id}</CTableDataCell>
                <CTableDataCell>{user.name}</CTableDataCell>
                {/* <CTableDataCell>{user.gender}</CTableDataCell>
                <CTableDataCell>{user.religion}</CTableDataCell> */}
                <CTableDataCell>
                  <button
                    className='btn btn-info mx-3'
                    onClick={() => {
                      setUserId(user.id);
                      setName(user.name);
                      setShowEditModal(true);
                    }}
                  >
                    Update
                  </button>
                  <button
                    className='btn btn-secondary mx-3'
                    onClick={() => {
                      setUserId(user.id);
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete
                  </button>
                </CTableDataCell>
                <CTableDataCell>
                  <button
                    className='btn btn-info mx-3'
                    onClick={() => handleStatusUpdate(user)}
                  >
                    {user.is_active === 1 ? (
                      <i className="fa-solid fa-check"></i>
                    ) : (
                      <i className="fa fa-close"></i>
                    )}
                  </button>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
       
    </>
  );
};

export default Dashboard;
