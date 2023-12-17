import './scss/styleDashboard.scss';
import type { MenuProps } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Breadcrumb, Card, Layout, Menu, theme } from 'antd';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountMenu from './ShipperAccountMenu';
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
    getItem(<Link to="/shipper/app-orders" >Đơn Hàng</Link>, '/shipper/app-orders', <ReceiptIcon />),
];
const ShipperDashboard: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isShipperEmployeeToken, setIsShipperEmployeeToken] = useState(Boolean(localStorage.getItem('shipperEmployeeToken')));
    useEffect(() => {
        if (!isShipperEmployeeToken) {
            handleRouteCheckLogin();
        }
    }, [isShipperEmployeeToken]);
    const handleRouteCheckLogin = () => {
        setTimeout(() => {
            navigate('/shipper/login', { replace: true });
        }, 0);
    };
    const [collapsed, setCollapsed] = useState(true);
    const pathSnippets = location.pathname.split('/').filter((i) => i);
    const getBreadcrumbLabel = (pathSegment: string): React.ReactNode => {
        switch (pathSegment) {
            case 'app-orders':
                return 'Đơn Hàng';
            default:
                return pathSegment;
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
            <div className='py-4 px-3 rounded-lg'>
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
            <Layout>
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
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Lifetech ©2023</Footer>
            </Layout>
        </Layout>
    );
};

export default ShipperDashboard;