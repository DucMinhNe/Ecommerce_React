import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import SystemConst from '../../common/consts/system_const';
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
export default function AccountMenu() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const cusId = localStorage.getItem('employeeId');
    const [EmployeesData, setEmployeesData] = useState<DataType | null>(null);
    useEffect(() => {
        handleFetchData();
    }, [EmployeesData]);
    const handleFetchData = () => {
        axios
            .get(`${BASE_URL}/${cusId}`)
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
        localStorage.removeItem('employeeToken');
        // localStorage.removeItem('employeeToken');
        // localStorage.removeItem('employeeId');
        window.history.replaceState(null, '', '/admin/login');
        window.location.replace('/admin/login');
        window.location.reload(); // Tải lại trang web
    };
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Tooltip title="Account settings">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Avatar sx={{ width: 32, height: 32 }} src={`${SystemConst.DOMAIN_HOST}/${EmployeesData?.employeeImage}`} alt={`${EmployeesData?.lastName}`} />
                    </IconButton>
                </Tooltip>
                {EmployeesData?.firstName} {EmployeesData?.lastName} <Logout fontSize="small" />
            </Box>

            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {/* <MenuItem onClick={handleClose}>
                    <Link to={'/admin/userinfomation'}>
                        <ListItemIcon>
                            <Settings fontSize="small" />
                        </ListItemIcon>
                        Thông Tin
                    </Link>
                </MenuItem> */}
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Đăng Xuất
                </MenuItem>
            </Menu>
        </React.Fragment >
    );
}