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
import SystemConst from '../../../common/consts/system_const';
interface DataType {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    birthDate: Date | null;
    gender: boolean | null;
    customerImage: string | null;
    isDeleted: boolean | null;
}
const BASE_URL = `${SystemConst.DOMAIN}/Customers`;
export default function AccountMenu() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const cusId = localStorage.getItem('customerId');
    const [CustomersData, setCustomersData] = useState<DataType | null>(null);
    useEffect(() => {
        handleFetchData();
    }, [CustomersData]);
    const handleFetchData = () => {
        axios
            .get(`${BASE_URL}/${cusId}`)
            .then((response) => {
                const apiDataCustomer = response.data;
                const newData: DataType = {
                    id: apiDataCustomer.id,
                    firstName: apiDataCustomer.firstName,
                    lastName: apiDataCustomer.lastName,
                    email: apiDataCustomer.email,
                    phoneNumber: apiDataCustomer.phoneNumber,
                    gender: apiDataCustomer.gender,
                    password: apiDataCustomer.password,
                    birthDate: apiDataCustomer.birthDate,
                    customerImage: apiDataCustomer.customerImage,
                    isDeleted: apiDataCustomer.isDeleted,
                };
                // console.log(newData);
                setCustomersData(newData);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const handleLogout = () => {
        localStorage.removeItem('customerToken');
        localStorage.removeItem('customerId');
        window.history.replaceState(null, '', '/ecommerce/home');
        window.location.replace('/ecommerce/home');
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
                        <Avatar sx={{ width: 32, height: 32 }} src={`${SystemConst.DOMAIN_HOST}/${CustomersData?.customerImage}`} alt={`${CustomersData?.lastName}`} />
                    </IconButton>
                </Tooltip>
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
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        {CustomersData?.firstName} {CustomersData?.lastName}
                    </ListItemIcon>
                </MenuItem>
                {/* <MenuItem onClick={handleClose}>
                    <Avatar /> My account
                </MenuItem> */}
                <Divider />
                {/* <MenuItem onClick={handleClose}>
                    <ListItemIcon>

                    </ListItemIcon>
                </MenuItem> */}
                <MenuItem onClick={handleClose}>
                    <Link to={'/ecommerce/userinfomation'}>
                        <ListItemIcon>
                            <Settings fontSize="small" />
                        </ListItemIcon>
                        Thông Tin
                    </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <Link to={'/ecommerce/addresscustomer'}>
                        <ListItemIcon>
                            <Settings fontSize="small" />
                        </ListItemIcon>
                        Địa Chỉ
                    </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <Link to={'/ecommerce/order'}>
                        <ListItemIcon>
                            <Settings fontSize="small" />
                        </ListItemIcon>
                        Đơn Hàng
                    </Link>
                </MenuItem>
                {/* <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
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