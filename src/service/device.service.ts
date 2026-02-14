import axios from './axios.service';

export const deviceService = {
  getAllDevices: (params) => 
    axios.get('/device/all', { params }),

  getUserDevices: (userId, role) => 
    axios.get(`/device/user/${userId}/${role}`),

  activateDevice: (id) => 
    axios.patch(`/device/${id}/activate`),

  deactivateDevice: (id) => 
    axios.patch(`/device/${id}/deactivate`),

  deleteDevice: (id) => 
    axios.delete(`/device/${id}`),
};
