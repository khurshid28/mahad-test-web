import axios from './axios.service';

export const deviceService = {
  getAllDevices: (params: any) => 
    axios.get('/device/all', { params }),

  getUserDevices: (userId: number, role: string) => 
    axios.get(`/device/user/${userId}/${role}`),

  activateDevice: (id: number) => 
    axios.patch(`/device/${id}/activate`),

  deactivateDevice: (id: number) => 
    axios.patch(`/device/${id}/deactivate`),

  blockDevice: (id: number) => 
    axios.patch(`/device/${id}/block`),

  unblockDevice: (id: number) => 
    axios.patch(`/device/${id}/unblock`),

  deleteDevice: (id: number) => 
    axios.delete(`/device/${id}`),
};
