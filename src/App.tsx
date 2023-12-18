
import Login from './page/Admin/Login';
import { BrowserRouter as Router, Routes, Route, Outlet, RouterProvider, Navigate } from 'react-router-dom';

import AppProviders from './page/Admin/AppProviders';
import AppPaymentMethods from './page/Admin/AppPaymentMethod';
import AppJobTitles from './page/Admin/AppJobTitles';
import AppProductCategories from './page/Admin/AppProductCategories';
import AppCustomers from './page/Admin/AppCustomers';
import AppEmployees from './page/Admin/AppEmployees';
import AppProducts from './page/Admin/AppProduct';
import AppAddressCustomers from './page/Admin/AppAddressCustomer';
import AppCarts from './page/Admin/AppCart';
import Header from './page/Ecommerce/components/Header';
import Footer from './page/Ecommerce/components/Footer';
import SignIn from './page/Ecommerce/pages/auth/SignIn';
import SignUp from './page/Ecommerce/pages/auth/SignUp';
import { Cart } from './page/Ecommerce/pages/cart/cart';
import { Product } from './page/Ecommerce/pages/product/product';
import Home from './page/Ecommerce/pages/Home/Home';
import AppOrders from './page/Admin/AppOrder';
import UserInfomation from './page/Ecommerce/pages/UserPage/UserInfomation';
import AddressCustomers from './page/Ecommerce/pages/UserPage/AddressCustomer';
import Orders from './page/Ecommerce/pages/UserPage/Order';
import AppDashboard from './page/Admin/AppDashboard';
import ShipperDashboard from './page/Shipper/ShipperDashboard';
import ShipperOrders from './page/Shipper/ShipperOrder';
import ShipperLogin from './page/Shipper/ShipperLogin';
import CategoryProduct from './page/Ecommerce/pages/CategoryProduct/CategoryProduct';

const Layout = () => {
    return (
        <div>
            <Header />
            {/* <ScrollRestoration /> */}
            <Outlet />
            <Footer />
        </div>
    );
};
function App() {
    return (
        <>
            <Routes>
                <Route path="/admin" element={<AppDashboard />}>
                    <Route path="/admin/app-providers" element={<AppProviders />} />
                    <Route path="/admin/app-payment-methods" element={<AppPaymentMethods />} />
                    <Route path="/admin/app-job-titles" element={<AppJobTitles />} />
                    <Route path="/admin/app-product-categories" element={<AppProductCategories />} />
                    <Route path="/admin/app-customers" element={<AppCustomers />} />
                    <Route path="/admin/app-employees" element={<AppEmployees />} />
                    <Route path="/admin/app-products" element={<AppProducts />} />
                    <Route path="/admin/app-address-customers" element={<AppAddressCustomers />} />
                    <Route path="/admin/app-carts" element={<AppCarts />} />
                    <Route path="/admin/app-orders" element={<AppOrders />} />
                </Route>
                <Route path="/admin/login" element={<div><Login /></div>} />

                <Route path="/shipper" element={<ShipperDashboard />}>
                    <Route path="/shipper/app-orders" element={<ShipperOrders />} />
                </Route>
                <Route path="/shipper/login" element={<div><ShipperLogin /></div>} />

                <Route index element={<Navigate to="ecommerce/home" />} />
                {/* Ecommerce Routes */}
                <Route path="/ecommerce/*" element={<Layout />}>
                    <Route path="home" element={<Home />} />
                    <Route path="product/:id" element={<Product />} />
                    <Route path="categoryProduct/:id" element={<CategoryProduct />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="signin" element={<SignIn />} />
                    <Route path="signup" element={<SignUp />} />
                    <Route path="addresscustomer" element={<AddressCustomers />} />
                    <Route path="userinfomation" element={<UserInfomation />} />
                    <Route path="order" element={<Orders />} />
                </Route>
                {/* Login Route */}

            </Routes >
        </>
    );
}

export default App;
