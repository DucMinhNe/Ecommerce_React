
import Login from './page/Admin/Login';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
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
                </Route>
                <Route
                    path="/"
                    element={
                        <div>
                            <Login />
                        </div>
                    }
                />
            </Routes>
        </>
    );
}

export default App;
