import { Dropdown, Layout, Menu } from 'antd';
// import React, { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import './scss/styleDashboard.scss';
import { MdAccountCircle } from 'react-icons/md';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import PaymentIcon from '@mui/icons-material/Payment';
const { Sider, Content, Header } = Layout;
const Dashboard: React.FC = () => {
    const location = useLocation();
    // const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.history.replaceState(null, '', '/');
        window.location.replace('/');
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
                            {/* <img src={logoTruong} className="w-48" alt="Error" /> */}
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
                    <Sider width={225} theme="dark" className="bg-blue-400">
                        <Menu mode="vertical" selectedKeys={[location.pathname]} className="h-full w-18 bg">
                            <Menu.Item key="/admin/app-providers" className="menu-item" >
                                <div> <CoPresentIcon/> <Link to="/admin/app-providers">Nhà Cung Cấp</Link> </div>
                            </Menu.Item>
                            <Menu.Item key="/admin/app-payment-methods" className="menu-item1">
                                <div> <PaymentIcon/> <Link to="/admin/app-payment-methods">Phương Thức Thanh Toán</Link></div>
                            </Menu.Item>
                            <Menu.Item key="/admin/app-job-titles" className="menu-item2">
                                <Link to="/admin/app-job-titles">Chức Vụ</Link>
                            </Menu.Item>
                            <Menu.Item key="/admin/app-product-categories" className="menu-item3">
                                <Link to="/admin/app-product-categories">Loại Sản Phẩm</Link>
                            </Menu.Item>
                            <Menu.Item key="/admin/app-customers" className="menu-item4">
                                <Link to="/admin/app-customers">Khách Hàng</Link>
                            </Menu.Item>
                            <Menu.Item key="/admin/app-employees" className="menu-item5">
                                <Link to="/admin/app-employees">Nhân Viên</Link>
                            </Menu.Item>
                            <Menu.Item key="/admin/app-products" className="menu-item6">
                                <Link to="/admin/app-products">Sản Phẩm</Link>
                            </Menu.Item>
                            <Menu.Item key="/admin/app-address-customers"className="menu-item7">
                                <Link to="/admin/app-address-customers">Địa Chỉ Khách Hàng</Link>
                            </Menu.Item>
                            <Menu.Item key="/admin/app-carts"className="menu-item8">
                                <Link to="/admin/app-carts">Giỏ Hàng</Link>
                            </Menu.Item>
                            <Menu.Item key="/admin/app-orders"className="menu-item9">
                                <Link to="/admin/app-orders">Đơn Hàng</Link>
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
