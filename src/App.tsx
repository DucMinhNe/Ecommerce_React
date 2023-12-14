
import Login from './page/Admin/Login';
import { BrowserRouter as Router, Routes, Route, Outlet, ScrollRestoration, createBrowserRouter, RouterProvider } from 'react-router-dom';

import Dashboard from './page/Admin/Dashboard';
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
import UserPage from './page/Ecommerce/pages/UserPage/UserPage';

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
                <Route
                    path="/admin"
                    element={
                        <div>
                            <Dashboard />
                        </div>
                    }
                >
                    <Route
                        path="/admin/app-providers"
                        element={
                            <div>
                                <AppProviders />
                            </div>
                        }
                    ></Route>
                    <Route
                        path="/admin/app-payment-methods"
                        element={
                            <div>
                                <AppPaymentMethods />
                            </div>
                        }
                    ></Route>
                    <Route
                        path="/admin/app-job-titles"
                        element={
                            <div>
                                <AppJobTitles />
                            </div>
                        }
                    ></Route>
                    <Route
                        path="/admin/app-product-categories"
                        element={
                            <div>
                                <AppProductCategories />
                            </div>
                        }
                    ></Route>
                    <Route
                        path="/admin/app-customers"
                        element={
                            <div>
                                <AppCustomers />
                            </div>
                        }
                    ></Route>
                    <Route
                        path="/admin/app-employees"
                        element={
                            <div>
                                <AppEmployees />
                            </div>
                        }
                    ></Route>
                    <Route
                        path="/admin/app-products"
                        element={
                            <div>
                                <AppProducts />
                            </div>
                        }
                    ></Route>
                    <Route
                        path="/admin/app-address-customers"
                        element={
                            <div>
                                <AppAddressCustomers />
                            </div>
                        }
                    ></Route>
                    <Route
                        path="/admin/app-carts"
                        element={
                            <div>
                                <AppCarts />
                            </div>
                        }
                    ></Route>
                    <Route
                        path="/admin/app-orders"
                        element={
                            <div>
                                <AppOrders />
                            </div>
                        }
                    ></Route>
                </Route>
                <Route
                    path="/"
                    element={
                        <div>
                            <Login />
                        </div>
                    }
                />

                {/* Ecommerce Routes */}
                <Route path="/ecommerce/*" element={<Layout />}>
                    <Route path="home" element={<Home />} />
                    <Route path="product/:id" element={<Product />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="signin" element={<SignIn />} />
                    <Route path="signup" element={<SignUp />} />
                    <Route path="userpage" element={<UserPage />} />
                </Route>
                {/* Login Route */}

            </Routes>
        </>
    );
}

export default App;
