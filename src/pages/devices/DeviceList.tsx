import React, { useState, useEffect } from 'react';
import { deviceService } from '../../service/device.service';
import { toast } from 'react-toastify';
import Select from '../../components/form/Select';
import { BoltIcon, TrashBinIcon } from '../../icons';
import { Modal } from '../../components/ui/modal';
import Pagination from '../../components/common/Pagination';

interface Device {
  id: number;
  user_id: number;
  role: 'ADMIN' | 'STUDENT' | 'TEACHER';
  device_name: string;
  device_type: 'ANDROID' | 'IOS' | 'WEB';
  device_identifier: string;
  ip_address?: string;
  user_agent?: string;
  is_active: boolean;
  last_active: string;
  last_api_endpoint?: string;
  last_api_method?: string;
  app_version?: string;
  user?: {
    name?: string;
    phone: string;
  };
}

const DeviceList = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState('20');

  // Confirmation Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<'activate' | 'deactivate' | 'delete' | null>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  const [selectedDeviceName, setSelectedDeviceName] = useState<string>('');

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const response = await deviceService.getAllDevices({});
      setDevices(response.data.devices);
    } catch (error) {
      console.error('Error fetching devices:', error);
      toast.error('Qurilmalarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  // Pagination logic
  const maxPage = Math.ceil(devices.length / +pageSize);
  const startIndex = (currentPage - 1) * +pageSize;
  const endIndex = startIndex + +pageSize;
  const currentDevices = devices.slice(startIndex, endIndex);

  const handlePageSizeChange = (value: string) => {
    setPageSize(value);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  const openConfirmModal = (deviceId: number, deviceName: string, action: 'activate' | 'deactivate' | 'delete') => {
    setSelectedDeviceId(deviceId);
    setSelectedDeviceName(deviceName);
    setModalAction(action);
    setIsModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsModalOpen(false);
    setSelectedDeviceId(null);
    setSelectedDeviceName('');
    setModalAction(null);
  };

  const handleConfirmAction = async () => {
    if (!selectedDeviceId || !modalAction) return;

    try {
      if (modalAction === 'activate') {
        await deviceService.activateDevice(selectedDeviceId);
        toast.success('Qurilma faollashtirildi');
      } else if (modalAction === 'deactivate') {
        await deviceService.deactivateDevice(selectedDeviceId);
        toast.success('Qurilma faolsizlantirildi');
      } else if (modalAction === 'delete') {
        await deviceService.deleteDevice(selectedDeviceId);
        toast.success('Qurilma o\'chirildi');
      }
      fetchDevices();
    } catch (error) {
      console.error(`Error ${modalAction}ing device:`, error);
      toast.error(`Qurilmani ${modalAction === 'delete' ? 'o\'chirish' : modalAction === 'activate' ? 'faollashtirish' : 'faolsizlantirish'}da xatolik`);
    } finally {
      closeConfirmModal();
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Hozirgina';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} daqiqa oldin`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} soat oldin`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} kun oldin`;
    
    return date.toLocaleDateString('uz-UZ', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400';
      case 'TEACHER': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400';
      case 'STUDENT': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const getDeviceTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'ANDROID': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400';
      case 'IOS': return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
      case 'WEB': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Qurilmalar</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Jami: <span className="font-semibold text-gray-900 dark:text-white">{devices.length}</span> ta qurilma
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
          </div>
        ) : devices.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 dark:text-gray-500 text-lg">
              Qurilmalar topilmadi
            </div>
          </div>
        ) : (
          <>
            {/* Page size selector */}
            <div className="px-5 py-3 flex flex-row items-center gap-2 text-theme-sm font-medium text-gray-500 text-start dark:text-gray-400 border-b border-gray-100 dark:border-white/5">
              <Select
                options={[
                  { value: '10', label: '10' },
                  { value: '20', label: '20' },
                  { value: '50', label: '50' },
                  { value: '100', label: '100' },
                ]}
                onChange={handlePageSizeChange}
                className="dark:bg-dark-900"
                defaultValue="20"
              />
              <span>Ko'rsatish</span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Foydalanuvchi
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Qurilma
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Turi
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Identifikator
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      IP Address
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Oxirgi faollik
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Oxirgi so'rov
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Holat
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Amallar
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {currentDevices.map((device) => (
                    <tr key={device.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {device.user?.name || '-'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {device.user?.phone || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(device.role)}`}>
                          {device.role === 'STUDENT' ? 'Student' : device.role === 'TEACHER' ? "O'qituvchi" : 'Admin'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100 max-w-xs truncate">
                          {device.device_name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {device.app_version ? `v${device.app_version}` : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getDeviceTypeBadgeColor(device.device_type)}`}>
                          {device.device_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs font-mono text-gray-700 dark:text-gray-300 max-w-xs truncate" title={device.device_identifier}>
                          {device.device_identifier}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {device.ip_address || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {formatRelativeTime(device.last_active)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {device.last_api_method && device.last_api_endpoint ? (
                          <div className="max-w-xs">
                            <span className="inline-block bg-gray-100 dark:bg-gray-700 rounded px-2 py-1 text-xs font-mono text-gray-700 dark:text-gray-300">
                              {device.last_api_method}
                            </span>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate" title={device.last_api_endpoint}>
                              {device.last_api_endpoint}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          device.is_active 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}>
                          {device.is_active ? 'Faol' : 'Faol emas'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => openConfirmModal(device.id, device.device_name, device.is_active ? 'deactivate' : 'activate')}
                            className={`transition-colors flex items-center gap-1.5 group ${
                              device.is_active
                                ? 'text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300'
                                : 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300'
                            }`}
                            title={device.is_active ? 'Faolsizlantirish' : 'Faollashtirish'}
                          >
                            <BoltIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                          </button>
                          <button
                            onClick={() => openConfirmModal(device.id, device.device_name, 'delete')}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors flex items-center gap-1.5 group"
                            title="O'chirish"
                          >
                            <TrashBinIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <Pagination 
                currentPage={currentPage} 
                totalPages={maxPage} 
                onPageChange={setCurrentPage} 
                className="flex-1" 
              />
              <div className="text-sm text-gray-700 dark:text-gray-300 mt-3 sm:mt-0">
                {(currentPage - 1) * +pageSize + 1} dan {Math.min(devices.length, currentPage * +pageSize)} gacha, {devices.length} ta
              </div>
            </div>
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      <Modal isOpen={isModalOpen} onClose={closeConfirmModal} className="max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              modalAction === 'delete'
                ? 'bg-red-100 dark:bg-red-900/30'
                : modalAction === 'activate'
                ? 'bg-green-100 dark:bg-green-900/30'
                : 'bg-orange-100 dark:bg-orange-900/30'
            }`}>
              {modalAction === 'delete' ? (
                <TrashBinIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
              ) : (
                <BoltIcon className={`w-8 h-8 ${
                  modalAction === 'activate' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-orange-600 dark:text-orange-400'
                }`} />
              )}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">
            {modalAction === 'delete'
              ? "Qurilmani o'chirish"
              : modalAction === 'activate'
              ? 'Qurilmani faollashtirish'
              : 'Qurilmani faolsizlantirish'}
          </h3>

          {/* Description */}
          <p className="text-center text-gray-600 dark:text-gray-400 mb-2">
            {modalAction === 'delete'
              ? "Haqiqatan ham bu qurilmani butunlay o'chirmoqchimisiz?"
              : modalAction === 'activate'
              ? "Bu qurilmani faollashtirganingizda, boshqa barcha qurilmalar avtomatik faolsizlantiriladi."
              : 'Haqiqatan ham bu qurilmani faolsizlantirmoqchimisiz?'}
          </p>
          
          {/* Device Name */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Qurilma:</p>
            <p className="text-base font-semibold text-gray-900 dark:text-white text-center truncate">
              {selectedDeviceName}
            </p>
          </div>

          {/* Warning */}
          {modalAction === 'delete' && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-6">
              <p className="text-sm text-red-800 dark:text-red-400">
                <strong>Diqqat:</strong> Bu amalni ortga qaytarib bo'lmaydi.
              </p>
            </div>
          )}

          {modalAction === 'activate' && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-6">
              <p className="text-sm text-green-800 dark:text-green-400">
                <strong>Eslatma:</strong> Faqat bitta qurilma faol bo'lishi mumkin.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={closeConfirmModal}
              className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors"
            >
              Bekor qilish
            </button>
            <button
              onClick={handleConfirmAction}
              className={`flex-1 px-4 py-2.5 text-white rounded-lg font-medium transition-colors ${
                modalAction === 'delete'
                  ? 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600'
                  : modalAction === 'activate'
                  ? 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600'
                  : 'bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600'
              }`}
            >
              {modalAction === 'delete' ? "O'chirish" : modalAction === 'activate' ? 'Faollashtirish' : 'Faolsizlantirish'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DeviceList;
