import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Logout from '@mui/icons-material/Logout';
import axios from 'axios';
import { useEffect, useState } from 'react';
import SystemConst from '../../common/consts/system_const';
interface ShipperAccountMenuProps {
    collapsed: boolean;
}
interface DataType {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    birthDate: Date | null;
    gender: boolean | null;
    employeeImage: string | null;
    isDeleted: boolean | null;
}
const BASE_URL = `${SystemConst.DOMAIN}/Employees`;
export default function ShipperAccountMenu({ collapsed }: ShipperAccountMenuProps) {
    const shipperEmployeeId = localStorage.getItem('shipperEmployeeId');
    const [EmployeesData, setEmployeesData] = useState<DataType | null>(null);
    useEffect(() => {
        handleFetchData();
    }, [EmployeesData]);
    const handleFetchData = () => {
        axios
            .get(`${BASE_URL}/${shipperEmployeeId}`)
            .then((response) => {
                const apiDataEmployee = response.data;
                const newData: DataType = {
                    id: apiDataEmployee.id,
                    firstName: apiDataEmployee.firstName,
                    lastName: apiDataEmployee.lastName,
                    email: apiDataEmployee.email,
                    phoneNumber: apiDataEmployee.phoneNumber,
                    gender: apiDataEmployee.gender,
                    password: apiDataEmployee.password,
                    birthDate: apiDataEmployee.birthDate,
                    employeeImage: apiDataEmployee.employeeImage,
                    isDeleted: apiDataEmployee.isDeleted,
                };
                // console.log(newData);
                setEmployeesData(newData);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const handleLogout = () => {
        localStorage.removeItem('shipperEmployeeToken');
        // localStorage.removeItem('employeeToken');
        // localStorage.removeItem('employeeId');
        window.history.replaceState(null, '', '/shipper/login');
        window.location.replace('/shipper/login');
        window.location.reload(); // Tải lại trang web
    };
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {

    };
    return (
        <React.Fragment>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between', // Distribute items evenly along the main axis
                    textAlign: 'center',
                    margin: '0px 13px 0px 0px', // Add padding if needed
                }}
            >
                {/* Left part */}
                <Tooltip title="Account settings">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-haspopup="true"
                    >
                        <Avatar
                            sx={{ width: 32, height: 32 }}
                            src={`${SystemConst.DOMAIN_HOST}/${EmployeesData?.employeeImage}`}
                            alt={`${EmployeesData?.lastName}`}
                        />
                    </IconButton>
                </Tooltip>
                {/* Center part */}
                {!collapsed && (
                    <span>
                        {EmployeesData?.firstName} {EmployeesData?.lastName}
                    </span>
                )}
                {/* Right part */}
                {!collapsed && <Logout fontSize="small" onClick={handleLogout} />}
            </Box>
        </React.Fragment >
    );
}