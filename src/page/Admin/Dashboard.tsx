import { Dropdown, Layout, Menu } from 'antd';
// import React, { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import './scss/styleDashboard.scss';
import { MdAccountCircle } from 'react-icons/md';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import PaymentIcon from '@mui/icons-material/Payment';
import CategoryIcon from '@mui/icons-material/Category';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import RedeemIcon from '@mui/icons-material/Redeem';
import ReceiptIcon from '@mui/icons-material/Receipt';
import GradeIcon from '@mui/icons-material/Grade';
import { useEffect, useState } from 'react';
const { Sider, Content, Header } = Layout;
const Dashboard: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isToken, setIsToken] = useState(Boolean(localStorage.getItem('token')));
    useEffect(() => {
        if (!isToken) {
            handleRouteCheckLogin();
        }
    }, [isToken]);
    const handleRouteCheckLogin = () => {
        setTimeout(() => {
            navigate('/admin/login', { replace: true });
        }, 0);
    };
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.history.replaceState(null, '', '/admin/login');
        window.location.replace('/admin/login');
        window.location.reload(); // Tải lại trang web
    };
    const items = [
        {
            label: <button onClick={handleLogout}>Đăng xuất</button>,
            key: 1,
        },
    ];
    return (
        <>
            <Layout className="bg-green min-h-screen">
                <Header className="bg-green-800 py-2">

                    <div className="flex justify-between items-center">
                        <div className="min-w-full">
                            {/* <img src={img} className="w-48" alt="Error" /> */}
                        </div>
                        <div>
                            <div>
                                <Dropdown
                                    className="w-24"
                                    menu={{
                                        items,
                                    }}
                                    trigger={['click']}
                                    overlayClassName="w-[10rem] z-50 mt-2 bg-white border border-gray-200 rounded-md shadow-md text-center cursor-pointer"
                                >
                                    <a onClick={(e) => e.preventDefault()}>
                                        <MdAccountCircle size={40} />
                                    </a>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </Header>
                <Layout>
                    <Sider width={245} theme="dark" className="bg-blue-400">
                        <Menu mode="vertical" selectedKeys={[location.pathname]} className="h-full w-18 bg">
                            <Menu.Item key="/admin/app-providers" className="menu-item" >
                                <div> <CoPresentIcon /> <Link to="/admin/app-providers" style={{ paddingLeft: '20px' }}>Nhà Cung Cấp</Link> </div>
                            </Menu.Item>
                            <Menu.Item key="/admin/app-payment-methods" className="menu-item1">
                                <div> <PaymentIcon /> <Link to="/admin/app-payment-methods" style={{ paddingLeft: '20px' }}>Phương Thức Thanh Toán</Link></div>
                            </Menu.Item>
                            <Menu.Item key="/admin/app-job-titles" className="menu-item2">
                                <div> <GradeIcon /> <Link to="/admin/app-job-titles" style={{ paddingLeft: '20px' }}>Chức Vụ</Link></div>
                            </Menu.Item>
                            <Menu.Item key="/admin/app-product-categories" className="menu-item3">
                                <div> <CategoryIcon />    <Link to="/admin/app-product-categories" style={{ paddingLeft: '20px' }}>Loại Sản Phẩm</Link></div>
                            </Menu.Item>
                            <Menu.Item key="/admin/app-customers" className="menu-item4">
                                <div> <EmojiPeopleIcon /> <Link to="/admin/app-customers" style={{ paddingLeft: '20px' }}>Khách Hàng</Link></div>
                            </Menu.Item>
                            <Menu.Item key="/admin/app-employees" className="menu-item5">
                                <div> <ConnectWithoutContactIcon /> <Link to="/admin/app-employees" style={{ paddingLeft: '20px' }}>Nhân Viên</Link></div>
                            </Menu.Item>
                            <Menu.Item key="/admin/app-products" className="menu-item6">
                                <div> <Inventory2Icon /> <Link to="/admin/app-products" style={{ paddingLeft: '20px' }}>Sản Phẩm</Link></div>
                            </Menu.Item>
                            <Menu.Item key="/admin/app-address-customers" className="menu-item7">
                                <div> <MapsHomeWorkIcon /> <Link to="/admin/app-address-customers" style={{ paddingLeft: '20px' }}>Địa Chỉ Khách Hàng</Link></div>
                            </Menu.Item>
                            <Menu.Item key="/admin/app-carts" className="menu-item8">
                                <div> <RedeemIcon /> <Link to="/admin/app-carts" style={{ paddingLeft: '20px' }}>Giỏ Hàng</Link></div>
                            </Menu.Item>
                            <Menu.Item key="/admin/app-orders" className="menu-item9">
                                <div> <ReceiptIcon /> <Link to="/admin/app-orders" style={{ paddingLeft: '20px' }}>Đơn Hàng</Link></div>
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Content className="custom-main p-5">
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </>
    );
};

export default Dashboard;
