import { Outlet } from "react-router-dom";
import Nav from "./Nav";
import { Dropdown, Layout, Menu } from 'antd';
import AddressCustomers from "./AddressCustomer";
const { Sider, Content, Header } = Layout;

const UserPage: React.FC = () => {
    return (
        <>

            <div className="pl-20"> <AddressCustomers /></div>



        </>
    );
};
export default UserPage;