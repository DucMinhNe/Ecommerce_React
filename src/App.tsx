
import Login from './page/Login/Login';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import Dashboard from './page/Dashboard/Dashboard';
import AppProviders from './page/Dashboard/AppProviders';
import AppPaymentMethods from './page/Dashboard/AppPaymentMethod';
import AppJobTitles from './page/Dashboard/AppJobTitles';
import AppProductCategories from './page/Dashboard/AppProductCategories';
import AppCustomers from './page/Dashboard/AppCustomers';

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
                        path="/admin/app-customers"
                        element={
                            <div>
                                <AppCustomers />
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
