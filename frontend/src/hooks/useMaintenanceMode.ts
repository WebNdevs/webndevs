// import { useState, useEffect } from 'react';
// import { API_ROOT } from '../config/api';

// const API_BASE_URL = API_ROOT;

// export function useMaintenanceMode() {
//   const [isUnderMaintenance, setIsUnderMaintenance] = useState(false);
//   const [maintenanceMessage, setMaintenanceMessage] = useState('Site is currently under maintenance. Please check back soon.');
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     async function checkMaintenance() {
//       try {
//         const response = await fetch(`${API_BASE_URL}/settings/general`, {
//           headers: {
//             'Accept': 'application/json',
//           },
//         });

//         if (!response.ok) {
//           return;
//         }

//         const contentType = response.headers.get('content-type') ?? '';
//         if (!contentType.includes('application/json')) {
//           console.warn('Maintenance mode endpoint returned a non-JSON response.', {
//             url: `${API_BASE_URL}/settings/general`,
//             status: response.status,
//             contentType,
//           });
//           return;
//         }

//         const data = await response.json();
//         if (data.data?.values?.maintenance_mode) {
//           setIsUnderMaintenance(true);
//         }
//       } catch (error) {
//         console.error('Failed to check maintenance mode:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     }

//     checkMaintenance();
//   }, []);

//   return { isUnderMaintenance, maintenanceMessage, isLoading };
// }
