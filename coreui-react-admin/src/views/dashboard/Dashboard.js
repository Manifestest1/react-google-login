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
  const [UserId, setUserId] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/showuser');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // const addUser = async () => {
  //   try {
  //     await axios.post('http://127.0.0.1:8000/api/add_user', {
  //       name,
  //       gender,
  //       religion,
  //     });

  //     fetchUsers();

  //     setShowAddModal(false);
  //     setName('');
  //     setGender('');
  //     setReligion('');
  //   } catch (error) {
  //     console.error('Error adding user:', error);
  //   }
  // };
  // const handleSave = () => {
  //   addUser();
  // };
  const handleDelete = async () => {
    try {
      await axios.get(`http://127.0.0.1:8000/api/delete/${UserId.id}`);

      setUsers(users.filter(user => user.id !== UserId.id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };
  const handleUpdate = async () => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/update/${UserId.id}`, {
        name: UserId.name,
      });

      fetchUsers();

      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };


  const handleStatusUpdate = async (user) => {
   console.log(user);
    try {
      if(user.is_active==1){
        user.is_active =0;
      }else{
        user.is_active =1;
      }
      await axios.post(`http://127.0.0.1:8000/api/update/${user.id}`,{
        is_active:user.is_active,type:'status_update'
      });
      fetchUsers();
    }catch(error){
      console.error('error status update:',error);
    }
  }
  
  /* for testing 
  const handleStatusUpdate = async (user_id,status) => {
   
    try {
      
      await axios.post(`http://127.0.0.1:8000/api/update/${user_id}`,{
        is_active:status,type:'status_update'
      });
      fetchUsers();
    }catch(error){
      console.error('error status update:',error);
    }
  }
  */ 
  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <>
      {/* <button className='btn btn-primary mt-4 mx-4 my-3 float-start' onClick={() => setShowAddModal(true)}>Add</button> */}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add User</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body w-100">
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
                    aria-label="Default select example"
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
                    aria-label="Default select example"
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
                <button type="button" className="btn btn-primary" onClick={handleSave}>Save</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showEditModal && setUserId && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body w-100">
                <div className="mb-3">
                  <label htmlFor="edit-name" className="form-label">Name</label>
                  <input
                    id="edit-name"
                    type="text"
                    placeholder="Enter your name"
                    className='form-control'
                    value={UserId.name}
                    onChange={(e) => setUserId({ ...UserId, name: e.target.value })}
                  />
                </div>
                {/* <div className="mb-3">
                  <label htmlFor="edit-gender" className="form-label">Gender</label>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    id="edit-gender"
                    value={selectedUser.gender}
                    onChange={(e) => setSelectedUser({ ...selectedUser, gender: e.target.value })}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div> */}
                {/* <div className="mb-3">
                  <label htmlFor="edit-religion" className="form-label">Religion</label>
                  <select
                    id="edit-religion"
                    className='form-select'
                    value={selectedUser.religion}
                    onChange={(e) => setSelectedUser({ ...selectedUser, religion: e.target.value })}
                  >
                    <option value="">Select religion</option>
                    <option value="christianity">Christianity</option>
                    <option value="islam">Islam</option>
                    <option value="hinduism">Hinduism</option>
                    <option value="buddhism">Buddhism</option>
                    <option value="other">Other</option>
                  </select>
                </div> */}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleUpdate}>Update</button>
              </div>
            </div>
          </div>
        </div>
      )}


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
            <p>Are you sure you want to delete?</p>
            <div className="row justify-content-end mt-3">
              <div className="col-auto">
                <CButton onClick={handleDelete} style={{ backgroundColor: 'rgb(102 16 242 / 41%)' }}>Delete</CButton>
              </div>
              <div className="col-auto">
                <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>Close</CButton>
              </div>
            </div>
          </CModalBody>
        </CModal>
      )}
      <CTable className="table table-bordered">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">ID</CTableHeaderCell>
            <CTableHeaderCell scope="col">Name</CTableHeaderCell>
            {/* <CTableHeaderCell scope="col">Gender</CTableHeaderCell>
            <CTableHeaderCell scope="col">Religion</CTableHeaderCell> */}
            <CTableHeaderCell>Action</CTableHeaderCell>
            <CTableHeaderCell>status</CTableHeaderCell>
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
                    setUserId(user);
                    setShowEditModal(true);
                  }}
                >
                  Update
                </button>
                <button
                  className='btn btn-secondary mx-3'
                  onClick={() => {
                    setUserId(user);
                    setShowDeleteModal(true);
                  }}
                >
                  Delete
                </button>
              </CTableDataCell>
              <CTableDataCell>
                <button
                  className='btn btn-info mx-3'
                  onClick={() =>{ 
                    handleStatusUpdate(user);
                  }}
                >
                  {user.is_active == 1 ? (
                    <i className="fa-solid fa-check"></i>
                  ) : (
                    <i className="fa fa-close"></i>
                  )}

                  {/* {user.is_active == 1 ? (
                    <button
                      className='btn btn-info mx-3'
                      onClick={() =>{ 
                        handleStatusUpdate(user.id,'0');
                      }}
                    >
                    <i className="fa-solid fa-check">{user.is_active}</i>
                  ) : (
                    <button
                      className='btn btn-info mx-3'
                      onClick={() =>{ 
                        handleStatusUpdate(user.id,'1');
                      }}
                    >
                    <i className="fa fa-close">{user.is_active}</i>
                  )} */}
                  
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
