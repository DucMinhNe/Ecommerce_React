import { Button, Modal, Input, Select } from 'antd';
import { EditOutlined, DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import Table, { ColumnsType } from 'antd/es/table';
import React, { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios';
import SystemConst from '../../common/consts/system_const';
import Swal from 'sweetalert2';
interface DataType {
    id: number;
    customerId: number;
    employeeId: number;
    addressCustomerId: number;
    orderDateTime: Date | null;
    totalPrice: number;
    shippingCost: number;
    orderStatus: string;
    isDeleted: boolean | null;
    action: React.ReactNode;
}
interface Customer {
    id: number;
    firstName: string;
    lastName: string;
}
interface Employee {
    id: number;
    firstName: string;
    lastName: string;
}
interface AddressCustomer {
    id: number;
    addressCustomerName: string;
    phoneNumber: string;
    address: string;
}
interface OrderDetails {
    id: number;
    orderId: number;
    productImage: string | null;
    productId: number;
    quantity: number;
    unitPrice: number;
    isDeleted: boolean | null;
}
interface Product {
    id: number;
    productName: string;
    description: string;
    rating: number;
    unitPrice: number;
    stockQuantity: number;
    productImage: string | null;
    isDeleted: boolean | null;
}
const BASE_URL = `${SystemConst.DOMAIN}/Orders`;
const BASE_URL_Customers = `${SystemConst.DOMAIN}/Customers`;
const BASE_URL_Employees = `${SystemConst.DOMAIN}/Employees`;
const BASE_URL_AddressCustomers = `${SystemConst.DOMAIN}/AddressCustomers`;
const BASE_URL_OrderDetails = `${SystemConst.DOMAIN}/OrderDetails`;
const BASE_URL_Products = `${SystemConst.DOMAIN}/Products`;
const ShipperOrders = () => {
    const shipperEmployeeId = localStorage.getItem('shipperEmployeeId');
    const columns: ColumnsType<DataType> = [
        {
            title: 'ID',
            dataIndex: 'id',
            sorter: (a, b) => a.id - b.id,
            sortDirections: ['ascend', 'descend'],
            align: 'center',
            width: 100,
            onCell: (record) => {
                return {
                    onClick: () => {
                        setIsOrderIdFetchData(record.id);
                        setModalOderDetails(true);
                    },
                };
            },
        },
        {
            title: 'Tài khoản',
            dataIndex: 'customer',
            align: 'center',
        },
        {
            title: 'Nhân Viên',
            dataIndex: 'employee',
            align: 'center',
        },
        {
            title: 'Thông Tin Giao Hàng',
            dataIndex: 'addressCustomer',
            align: 'center',
        },
        {
            title: 'Ngày Đặt Hàng',
            dataIndex: 'orderDateTime',
            align: 'center',
        },
        {
            title: 'Tổng Tiền',
            dataIndex: 'totalPrice',
            align: 'center',
        },
        {
            title: 'Tiền Ship',
            dataIndex: 'shippingCost',
            align: 'center',
        },
        {
            title: 'Trạng Thái Giao Hàng',
            dataIndex: 'orderStatus',
            align: 'center',
        },
        {
            title: '',
            dataIndex: 'action',
            align: 'center',
            width: 100,
        },
    ];
    const OrderDetailcolumns: ColumnsType<OrderDetails> = [
        {
            title: 'ID',
            dataIndex: 'id',
            sorter: (a, b) => a.id - b.id,
            sortDirections: ['ascend', 'descend'],
            align: 'center',
            width: 100,
        },
        {
            title: 'Hình Ảnh',
            dataIndex: 'productImage',
            render: (productImage: string) => (
                <img
                    src={`${SystemConst.DOMAIN_HOST}/${productImage}`}
                    alt="Product Avatar"
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                />
            ),
            align: 'center',
        },
        {
            title: 'Sản Phẩm',
            dataIndex: 'product',
            align: 'center',
        },
        {
            title: 'Số Lượng',
            dataIndex: 'quantity',
            align: 'center',
        },
        {
            title: 'Giá',
            dataIndex: 'unitPrice',
            align: 'center',
        },
    ];
    const [dataOrderDetails, setDataOrderDetails] = useState<OrderDetails[]>([]);
    const handleFetchDataOrderDetails = () => {
        axios
            .get(`${BASE_URL_OrderDetails}?orderId=${isOrderIdFetchData}`)
            .then(async (response) => {
                const Api_Data_OrderDetails = response.data;
                try {
                    const products = await fetchProducts();
                    const newData: OrderDetails[] = Api_Data_OrderDetails.map(
                        (item: OrderDetails) => ({
                            id: item.id,
                            productId: item.productId,
                            productImage: (products.find((product: { id: number; }) => product.id === item.productId) || {}).productImage || 'N/A',
                            product: (products.find((product: { id: number; }) => product.id === item.productId) || {}).productName || 'N/A',
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                            isDeleted: item.isDeleted,
                        })
                    );
                    setDataOrderDetails(newData);
                } catch (error) {
                    // console.log(error);
                }
            })
            .catch((error) => {
            });
    };
    const [openModalOderDetails, setModalOderDetails] = useState(false);
    const handleCancelOderDetails = () => {
        setModalOderDetails(false);
    };
    const [isOrderIdFetchData, setIsOrderIdFetchData] = useState(0);
    useEffect(() => {
        handleFetchDataOrderDetails();
    }, [isOrderIdFetchData]);
    const [dataOrders, setDataOrders] = useState<DataType[]>([]);
    const [selectedItemEdit, setSelectedItemEdit] = useState<DataType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        handleFetchData();
    },);
    const [isDeletedFetchData, setIsDeletedFetchData] = useState(false);
    const handleToggleIsDeletedFetchData = () => {
        setIsDeletedFetchData((prevIsDeleted) => !prevIsDeleted);
    };
    const fetchCustomers = async () => {
        try {
            const response = await axios.get(`${BASE_URL_Customers}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching job titles:', error);
            throw error; // Ném lỗi để xử lý ở nơi gọi hàm nếu cần
        }
    };
    const fetchEmployees = async () => {
        try {
            const response = await axios.get(`${BASE_URL_Employees}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching job titles:', error);
            throw error; // Ném lỗi để xử lý ở nơi gọi hàm nếu cần
        }
    };
    const fetchAddressCustomers = async () => {
        try {
            const response = await axios.get(`${BASE_URL_AddressCustomers}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching job titles:', error);
            throw error; // Ném lỗi để xử lý ở nơi gọi hàm nếu cần
        }
    };
    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${BASE_URL_Products}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching Products:', error);
            throw error;
        }
    };
    const handleFetchData = () => {
        axios
            .get(`${BASE_URL}?employeeId=${shipperEmployeeId}&isDeleted=${isDeletedFetchData}`)
            .then(async (response) => {
                const Api_Data_Orders = response.data;
                try {
                    const customers = await fetchCustomers();
                    const employees = await fetchEmployees();
                    const addressCustomers = await fetchAddressCustomers();
                    const newData: DataType[] = Api_Data_Orders.map(
                        (item: DataType) => ({
                            id: item.id,
                            customerId: item.customerId,
                            customer: (customers.find((customer: { id: number; }) => customer.id === item.customerId) || {}).firstName || 'N/A',
                            employeeId: item.employeeId,
                            employee: (employees.find((employee: { id: number; }) => employee.id === item.employeeId) || {}).firstName || 'N/A',
                            addressCustomerId: item.addressCustomerId,
                            addressCustomer: (addressCustomers.find((addressCustomer: { id: number; phoneNumber: string; addressCustomerName: string; address: string; }) => addressCustomer.id === item.addressCustomerId) || { addressCustomerName: 'N/A', phoneNumber: 'N/A', address: 'N/A' }).addressCustomerName + '-' + (addressCustomers.find((addressCustomer: { id: number; phoneNumber: string; addressCustomerName: string; address: string; }) => addressCustomer.id === item.addressCustomerId) || { addressCustomerName: 'N/A', phoneNumber: 'N/A', address: 'N/A' }).phoneNumber + '-' + (addressCustomers.find((addressCustomer: { id: number; phoneNumber: string; addressCustomerName: string; address: string; }) => addressCustomer.id === item.addressCustomerId) || { addressCustomerName: 'N/A', phoneNumber: 'N/A', address: 'N/A' }).address,
                            orderDateTime: item.orderDateTime,
                            totalPrice: item.totalPrice,
                            shippingCost: item.shippingCost,
                            orderStatus: item.orderStatus,
                            isDeleted: item.isDeleted,
                            action: (
                                <>
                                    <div className="flex justify-center items-center gap-x-1">
                                        <Button
                                            type="default"
                                            style={{ backgroundColor: '#459664', borderColor: '#459664', color: '#fff' }}
                                            icon={<EditOutlined />}
                                            onClick={() => handleEdit(item)}
                                        >
                                            {/* Sửa */}
                                        </Button>
                                    </div>
                                </>
                            ),
                        })
                    );
                    setDataOrders(newData);
                } catch (error) {
                    console.log(error);
                }
            })
            .catch((error) => {
            });
    };
    useEffect(() => {
        handleFetchData();
    }, [isDeletedFetchData]);
    const clearAllValue = () => {
        setSelectedItemEdit(null);
    }
    const handleUpdateOrders = () => {
        if (!selectedItemEdit) {
            return;
        }
        const formData = new FormData();
        formData.append("customerId", String(selectedItemEdit.customerId || ''));
        formData.append("employeeId", String(selectedItemEdit.employeeId || ''));
        formData.append("addressCustomerId", String(selectedItemEdit.addressCustomerId || ''));
        if (selectedItemEdit.orderDateTime instanceof Date) {
            formData.append("orderDateTime", selectedItemEdit.orderDateTime.toISOString().split('T')[0]);
        }
        formData.append("totalPrice", String(selectedItemEdit.totalPrice || ''));
        formData.append("shippingCost", String(selectedItemEdit.shippingCost || ''));
        formData.append("orderStatus", selectedItemEdit.orderStatus || '');
        formData.append("isDeleted", `${isDeletedFetchData}`);
        axios
            .put(`${BASE_URL}/${selectedItemEdit.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                handleFetchData();
                setOpenModalEdit(false);
                handleClickEditSuccess();
                clearAllValue();
                console.log('Data', response);
            })
            .catch((error) => {
            });
    };
    const handleSubmitEditOrders = () => {
        handleUpdateOrders();
        setOpenModalEdit(false);
    };
    const handleEdit = (item: DataType) => {
        const formattedItem = {
            ...item,
        };
        setSelectedItemEdit(formattedItem);
        setOpenModalEdit(true);
        console.log('Selected item for editing:', item);
    };
    const handleClickEditSuccess = () => {
        Swal.fire({
            icon: 'success',
            title: 'Cập nhật thành công',
            showConfirmButton: false,
            timer: 1500,
        });
    };
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [addressCustomers, setAddressCustomers] = useState<AddressCustomer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    // Fetch Customers on component mount
    useEffect(() => {
        const fetchCustomersAndSetState = async () => {
            try {
                const customersData = await fetchCustomers();
                setCustomers(customersData || []); // Ensure customersData is an array, or set it to an empty array if it's falsy
            } catch (error) {
                console.error('Error fetching job titles:', error);
            }
        };
        fetchCustomersAndSetState();
    }, []);
    // Fetch Employees on component mount
    useEffect(() => {
        const fetchEmployeesAndSetState = async () => {
            try {
                const employeesData = await fetchEmployees();
                setEmployees(employeesData || []); // Ensure employeesData is an array, or set it to an empty array if it's falsy
            } catch (error) {
                console.error('Error fetching job titles:', error);
            }
        };
        fetchEmployeesAndSetState();
    }, []);
    // Fetch AddressCustomers on component mount
    useEffect(() => {
        const fetchAddressCustomersAndSetState = async () => {
            try {
                const addressCustomersData = await fetchAddressCustomers();
                setAddressCustomers(addressCustomersData || []); // Ensure addressCustomersData is an array, or set it to an empty array if it's falsy
            } catch (error) {
                console.error('Error fetching job titles:', error);
            }
        };
        fetchAddressCustomersAndSetState();
    }, []);
    // Fetch Products on component mount
    useEffect(() => {
        const fetchProductsAndSetState = async () => {
            try {
                const productsData = await fetchProducts();
                setProducts(productsData || []); // Ensure productsData is an array, or set it to an empty array if it's falsy
            } catch (error) {
                console.error('Error fetching job titles:', error);
            }
        };
        fetchProductsAndSetState();
    }, []);
    const handleCancelEdit = () => {
        setOpenModalEdit(false);
    };
    return (
        <>
            <div className="container mt-5 ">
                <Table
                    columns={columns}
                    dataSource={dataOrders}
                    loading={isLoading}
                    pagination={{
                        defaultPageSize: 6,
                        showSizeChanger: true,
                        pageSizeOptions: ['4', '6', '8', '12', '16'],
                        showQuickJumper: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    }}
                    rowKey={(record) => record.id}
                    scroll={{ x: 'max-content' }}
                    size="middle"
                    bordered
                />
            </div>
            {/* Modal sửa Đơn Hàng */}
            <>
                <Modal
                    className="custom-modal-create_and_edit_orders"
                    open={openModalEdit}
                    onCancel={handleCancelEdit}
                    footer={null}
                >
                    <div className="p-5">
                        <span className="text-lg font-medium">Sửa Đơn Hàng</span>
                        <div className="mt-10">
                            <label htmlFor="customerId">Tài khoản</label>
                            <select
                                id="customerId"
                                value={selectedItemEdit?.customerId ?? ''}
                                disabled
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            >
                                {customers.map((customer) => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.firstName} {' '} {customer.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-10">
                            <label htmlFor="employeeId">Nhân Viên</label>
                            <select
                                id="employeeId"
                                disabled
                                value={selectedItemEdit?.employeeId ?? ''}
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}
                            >
                                {employees.map((employee) => (
                                    <option key={employee.id} value={employee.id}>
                                        {employee.firstName}{' '} {employee.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-10">
                            <label htmlFor="addressCustomerId">Thông Tin Giao Hàng</label>
                            <select
                                id="addressCustomerId"
                                value={selectedItemEdit?.addressCustomerId ?? ''}
                                disabled
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}
                            >
                                {addressCustomers.map((addressCustomer) => (
                                    <option key={addressCustomer.id} value={addressCustomer.id}>
                                        {addressCustomer.addressCustomerName} {'-'}  {addressCustomer.phoneNumber}  {'-'} {addressCustomer.address}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Ngày Đặt Hàng</label>
                            <Input
                                type="date"
                                value={
                                    selectedItemEdit?.orderDateTime instanceof Date
                                        ? selectedItemEdit?.orderDateTime.toISOString().split('T')[0]
                                        : ''
                                }
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Tổng Tiền</label>
                            <Input
                                value={selectedItemEdit?.totalPrice}
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Tiền Ship</label>
                            <Input
                                value={selectedItemEdit?.shippingCost}
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Trạng Thái Giao Hàng</label>
                            <select
                                onChange={(event) => {
                                    setSelectedItemEdit((prev) =>
                                        prev === null ? prev : { ...prev, orderStatus: event.target.value }
                                    );
                                }}
                                value={selectedItemEdit?.orderStatus}
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            >

                                <option value="Đang Giao Hàng">Đang Giao Hàng</option>
                                <option value="Đã Giao Hàng">Đã Giao Hàng</option>

                            </select>
                        </div>
                        <div className="flex justify-end items-end">
                            <Button onClick={handleSubmitEditOrders} style={{ backgroundColor: 'black', borderColor: 'black', color: '#fff', marginTop: 8 }}  >
                                Lưu
                            </Button>
                        </div>
                    </div>
                </Modal>
                {/* Modal sửa Chi tiết đơn hàng */}
                <>
                    <Modal
                        className="custom-modal-order_details"
                        open={openModalOderDetails}
                        onCancel={handleCancelOderDetails}
                        footer={null}
                    >
                        <Table
                            columns={OrderDetailcolumns}
                            dataSource={dataOrderDetails}
                            loading={isLoading}
                            pagination={{
                                defaultPageSize: 6,
                                showSizeChanger: true,
                                pageSizeOptions: ['4', '6', '8', '12', '16'],
                                showQuickJumper: true,
                                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                            }}
                            rowKey={(record) => record.id}
                            scroll={{ x: 'max-content' }}
                            size="middle"
                            bordered
                        />
                    </Modal>
                </>
            </>
        </>
    );
};

export default ShipperOrders;
