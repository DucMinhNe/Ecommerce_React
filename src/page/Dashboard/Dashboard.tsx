import { Dropdown, Layout, Menu, Space } from 'antd';
import React, { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import './scss/styleDashboard.scss';
import { MdAccountCircle } from 'react-icons/md';
const { Sider, Content, Header } = Layout;
const Dashboard: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

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
            <Layout className="min-h-screen">
                <Header className="bg-blue-400 py-2 ">
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
                    <Sider width={200} theme="dark" className="bg-blue-400">
                        <Menu mode="vertical" selectedKeys={[location.pathname]} className="h-full bg-slate-300">
                            <Menu.Item key="admin/app-providers">
                                <Link to="/admin/app-providers">Nhà Cung Cấp</Link>
                            </Menu.Item>
                            <Menu.Item key="admin/app-payment-methods">
                                <Link to="/admin/app-payment-methods">Phương Thức Thanh Toán</Link>
                            </Menu.Item>
                            <Menu.Item key="admin/app-job-titles">
                                <Link to="/admin/app-job-titles">Chức Vụ</Link>
                            </Menu.Item>
                            <Menu.Item key="/admin/app-product-categories">
                                <Link to="/admin/app-product-categories">Loại Sản Phẩm</Link>
                            </Menu.Item>
                            <Menu.Item key="/admin/app-customers">
                                <Link to="/admin/app-customers">Khách Hàng</Link>
                            </Menu.Item>
                            <Menu.Item key="/admin/app-employees">
                                <Link to="/admin/app-employees">Nhân Viên</Link>
                            </Menu.Item>
                            <Menu.Item key="/admin/app-products">
                                <Link to="/admin/app-products">Sản Phẩm</Link>
                            </Menu.Item>
                            <Menu.Item key="/admin/app-address-customers">
                                <Link to="/admin/app-address-customers">Địa Chỉ Khách Hàng</Link>
                            </Menu.Item>
                            <Menu.Item key="/admin/app-carts">
                                <Link to="/admin/app-carts">Giỏ Hàng</Link>
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
