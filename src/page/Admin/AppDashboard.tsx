import './scss/styleDashboard.scss';
import type { MenuProps } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Breadcrumb, Card, Layout, Menu, theme } from 'antd';
// import LogoLight from '../Ecommerce/assets/index';
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
import AccountMenu from './AccountMenu';
import React, { useEffect, useState } from 'react';
const { Header, Content, Footer, Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number];
function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}
const items: MenuItem[] = [
    getItem(<Link to="/admin/app-providers">Nhà Cung Cấp</Link>, '/admin/app-providers', <CoPresentIcon />),
    getItem(<Link to="/admin/app-payment-methods">Phương Thức Thanh Toán</Link>, '/admin/app-payment-methods', <PaymentIcon />),
    getItem(<Link to="/admin/app-job-titles">Chức Vụ</Link>, '/admin/app-job-titles', <GradeIcon />),
    getItem(<Link to="/admin/app-product-categories" >Loại Sản Phẩm</Link>, '/admin/app-product-categories', <CategoryIcon />),
    getItem(<Link to="/admin/app-customers" >Khách Hàng</Link>, '/admin/app-customers', <EmojiPeopleIcon />),
    getItem(<Link to="/admin/app-employees" >Nhân Viên</Link>, '/admin/app-employees', <ConnectWithoutContactIcon />),
    getItem(<Link to="/admin/app-products" >Sản Phẩm</Link>, '/admin/app-products', <Inventory2Icon />),
    getItem(<Link to="/admin/app-address-customers" >Địa Chỉ Khách Hàng</Link>, '/admin/app-address-customers', <MapsHomeWorkIcon />),
    getItem(<Link to="/admin/app-carts" >Giỏ Hàng</Link>, '/admin/app-carts', <RedeemIcon />),
    getItem(<Link to="/admin/app-orders" >Đơn Hàng</Link>, '/admin/app-orders', <ReceiptIcon />),
];
const AppDashboard: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isEmployeeToken, setIsEmployeeToken] = useState(Boolean(localStorage.getItem('employeeToken')));
    useEffect(() => {
        if (!isEmployeeToken) {
            handleRouteCheckLogin();
        }
    }, [isEmployeeToken]);
    useEffect(() => {
        // console.log(localStorage.getItem('jobTitleId'))
    }, []);
    const handleRouteCheckLogin = () => {
        setTimeout(() => {
            navigate('/admin/login', { replace: true });
        }, 0);
    };
    const [collapsed, setCollapsed] = useState(true);
    const pathSnippets = location.pathname.split('/').filter((i) => i);
    const getBreadcrumbLabel = (pathSegment: string): React.ReactNode => {
        switch (pathSegment) {
            case 'app-providers':
                return 'Nhà Cung Cấp';
            case 'app-payment-methods':
                return 'Phương Thức Thanh Toán';
            case 'app-job-titles':
                return 'Chức Vụ';
            case 'app-product-categories':
                return 'Loại Sản Phẩm';
            case 'app-customers':
                return 'Khách Hàng';
            case 'app-employees':
                return 'Nhân Viên';
            case 'app-products':
                return 'Sản Phẩm';
            case 'app-address-customers':
                return 'Địa Chỉ Khách Hàng';
            case 'app-carts':
                return 'Giỏ Hàng';
            case 'app-orders':
                return 'Đơn Hàng';
            default:
                return pathSegment; // Fallback to the path segment itself
        }
    };
    const breadcrumbItems = pathSnippets.map((segment, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        const label = getBreadcrumbLabel(segment);
        return <Breadcrumb.Item key={url}><Link to={url}>{label}</Link></Breadcrumb.Item>;
    });
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <div className="pt-5 px-3 rounded-lg flex items-center justify-center">
                <Sider collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} onMouseEnter={() => setCollapsed(false)}
                    onMouseLeave={() => setCollapsed(true)} style={{ background: colorBgContainer, borderRadius: '50px' }} width={240}>
                    <Card
                        cover={
                            <img
                                alt=""
                                // src={LogoLight}
                                src="https://www.lifetechvn.net/favicon.png"
                                style={{ width: collapsed ? '90%' : '50%', height: 'auto', margin: '0px auto' }}
                            />
                        }
                        bodyStyle={{ padding: "0" }}
                        actions={[
                            <AccountMenu collapsed={collapsed} />
                        ]}
                    />
                    <div className='w-full'> <Menu theme="light" defaultSelectedKeys={['1']} mode="inline" items={items} className='w-full' /></div>

                </Sider>
            </div>
            <Layout style={{ padding: '5.5vh 0px 0px 0px' }}>
                <Header style={{
                    margin: '15px 16px 0px 16px',
                    background: colorBgContainer,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderRadius: '15px' // Bo tròn góc
                }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        {breadcrumbItems}
                    </Breadcrumb>
                </Header>
                <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 670,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Lifetech ©2023</Footer>
            </Layout>
        </Layout >
    );
};

export default AppDashboard;