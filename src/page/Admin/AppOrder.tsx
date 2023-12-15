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
}
interface Employee {
    id: number;
    firstName: string;
}
interface AddressCustomer {
    id: number;
    addressCustomerName: string;
}
interface OrderDetails {
    id: number;
    orderId: number;
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
const AppOrders = () => {
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
            .get(`${BASE_URL}?isDeleted=${isDeletedFetchData}`)
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
                            addressCustomer: (addressCustomers.find((addressCustomer: { id: number; }) => addressCustomer.id === item.addressCustomerId) || {}).addressCustomerName || 'N/A',
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
                                        {isDeletedFetchData ? (
                                            <Button
                                                style={{ backgroundColor: '#e74c3c', borderColor: '#e74c3c', color: '#fff' }}
                                                icon={<UndoOutlined />}
                                                onClick={() => handleRestore(item)}
                                            >
                                                {/* Khôi Phục */}
                                            </Button>
                                        ) : (
                                            <Button
                                                style={{ backgroundColor: '#c00118', borderColor: '#c00118', color: '#fff' }}
                                                icon={<DeleteOutlined />}
                                                onClick={() => handleDelete(item)}
                                            >
                                                {/* Xóa */}
                                            </Button>
                                        )}
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
    //Xử lý Call API Create
    const handleCreateOrders = () => {
        const formData = new FormData();
        formData.append("customerId", isValueCustomerId);
        formData.append("employeeId", isValueEmployeeId);
        formData.append("addressCustomerId", isValueAddressCustomerId);
        formData.append("orderDateTime", isValueOrderDateTime);
        formData.append("totalPrice", isValueTotalPrice);
        formData.append("shippingCost", isValueShippingCost);
        formData.append("orderStatus", isValueOrderStatus);
        formData.append("isDeleted", 'false');
        console.log(formData);
        axios
            .post(`${BASE_URL}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                handleFetchData();
                setOpenModal(false);
                handleClickSuccess();
                console.log('Data', response);
                // const data = response.data.respone_data;
            })
            .catch((error) => {
            });
    };
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

        console.log(formData);
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
    const [openModal, setOpenModal] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [isValueCustomerId, setIsValueCustomerId] = useState('');
    const [isValueEmployeeId, setIsValueEmployeeId] = useState('');
    const [isValueAddressCustomerId, setIsValueAddressCustomerId] = useState('');
    const [isValueOrderDateTime, setIsValueOrderDateTime] = useState('');
    const [isValueTotalPrice, setIsValueTotalPrice] = useState('');
    const [isValueShippingCost, setIsValueShippingCost] = useState('');
    const [isValueOrderStatus, setIsValueOrderStatus] = useState('');
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
    const handleShowModal = () => {
        setOpenModal(true);
    };
    const handleCancel = () => {
        setOpenModal(false);
    };
    const handleCancelEdit = () => {
        setOpenModalEdit(false);
    };
    const handleClickSuccess = () => {
        Swal.fire({
            icon: 'success',
            title: 'Tạo thành công',
            showConfirmButton: false,
            timer: 1500,
        });
    };
    const handleDelete = (item: { id: number }) => {
        Swal.fire({
            title: 'Xác nhận xóa',
            text: 'Bạn có chắc chắn muốn xóa không?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                handleDeleteOrder(item.id);
            }
        });
    };
    //Xử lý Call API Delete
    const handleDeleteOrder = (itemId: number) => {
        const dataDelete = itemId;
        axios
            .delete(`${BASE_URL}/${dataDelete}`)
            .then((response) => {
                handleFetchData();
                Swal.fire({
                    icon: 'success',
                    title: 'Xóa thành công',
                    showConfirmButton: false,
                    timer: 1500,
                });
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Thông Báo",
                    text: "Có Lỗi Xảy Ra",
                });
            });
    };
    const handleRestore = (item: { id: number }) => {
        Swal.fire({
            title: 'Xác nhận khôi phục',
            text: 'Bạn có chắc chắn muốn khôi phục không?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Khôi phục',
            cancelButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                handleRestoreOrder(item.id);
            }
        });
    };
    const handleRestoreOrder = (itemId: number) => {
        const dataRestore = itemId;
        axios
            .put(`${BASE_URL}/Restore/${dataRestore}`)
            .then((response) => {
                handleFetchData();
                Swal.fire({
                    icon: 'success',
                    title: 'Khôi phục thành công',
                    showConfirmButton: false,
                    timer: 1500,
                });
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Thông Báo",
                    text: "Có Lỗi Xảy Ra",
                });
            });
    };
    return (
        <>
            <div className="container mt-5 ">
                <div className="flex justify-end mb-5">
                    <Button onClick={handleShowModal} style={{ backgroundColor: '#6f9643', borderColor: '#6f9643', color: '#fff', marginRight: '8px' }}>
                        Thêm
                    </Button>
                    <Button onClick={handleToggleIsDeletedFetchData} 
                   style={{ 
                    borderColor: '#c00118', 
                    transition: 'background-color 0.3s, color 0.3s' }}
                    className="custom-buttonorders">
                        {isDeletedFetchData ? 'Xem Đơn Hàng' : 'Xem Đơn Hàng Đã Xóa'}
                    </Button>
                </div>
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
            {/* Modal thêm Đơn Hàng */}
            <>
                <Modal
                    className="custom-modal-create_and_edit_orders"
                    open={openModal}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <div className="p-5">
                        <span className="text-lg font-medium">Thêm Đơn Hàng</span>
                        <div className="mt-10">
                            <label htmlFor="customer">Tài khoản</label>
                            <select
                                id="customer"
                                onChange={(event) => { setIsValueCustomerId(event.target.value) }}
                                value={isValueCustomerId}
                                className="bg-slate-200"
                            >
                                <option value="">-- Chọn Tài khoản --</option>
                                {customers.map((customer) => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.firstName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-10">
                            <label htmlFor="employee">Nhân Viên</label>
                            <select
                                id="employee"
                                onChange={(event) => { setIsValueEmployeeId(event.target.value) }}
                                value={isValueEmployeeId}
                                className="bg-slate-200"
                            >
                                <option value="">-- Chọn Nhân Viên --</option>
                                {employees.map((employee) => (
                                    <option key={employee.id} value={employee.id}>
                                        {employee.firstName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-10">
                            <label htmlFor="addressCustomer">Thông Tin Giao Hàng</label>
                            <select
                                id="addressCustomer"
                                onChange={(event) => { setIsValueAddressCustomerId(event.target.value) }}
                                value={isValueAddressCustomerId}
                                className="bg-slate-200"
                            >
                                <option value="">-- Chọn Thông Tin Giao Hàng --</option>
                                {addressCustomers.map((addressCustomer) => (
                                    <option key={addressCustomer.id} value={addressCustomer.id}>
                                        {addressCustomer.addressCustomerName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Ngày Đặt Hàng</label>
                            <Input
                                type="date"
                                onChange={(event) => {
                                    setIsValueOrderDateTime(event.target.value);
                                }}
                                value={isValueOrderDateTime}
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Tổng Tiền</label>
                            <Input
                                onChange={(event) => { setIsValueTotalPrice(event.target.value) }}
                                value={isValueTotalPrice}
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Tiền Ship</label>
                            <Input
                                onChange={(event) => { setIsValueShippingCost(event.target.value) }}
                                value={isValueShippingCost}
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Trạng Thái Giao Hàng</label>
                            <Input
                                onChange={(event) => { setIsValueOrderStatus(event.target.value) }}
                                value={isValueOrderStatus}
                                className="bg-slate-200"
                            />
                        </div>

                        <div className="flex justify-end items-end">
                            <Button onClick={handleCreateOrders} style={{ backgroundColor: 'black', borderColor: 'black', color: '#fff', marginTop: 8 }} >
                                Lưu
                            </Button>
                        </div>
                    </div>
                </Modal>
            </>
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
                                onChange={(event) => {
                                    const selectedCustomerId = Number(event.target.value);
                                    setSelectedItemEdit((prev) =>
                                        prev === null ? prev : { ...prev, customerId: selectedCustomerId }
                                    );
                                }}
                                value={selectedItemEdit?.customerId ?? ''}
                                className="bg-slate-200"
                            >
                                <option value="" disabled>-- Chọn Tài khoản --</option>
                                {customers.map((customer) => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.firstName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-10">
                            <label htmlFor="employeeId">Nhân Viên</label>
                            <select
                                id="employeeId"
                                onChange={(event) => {
                                    const selectedEmployeeId = Number(event.target.value);
                                    setSelectedItemEdit((prev) =>
                                        prev === null ? prev : { ...prev, employeeId: selectedEmployeeId }
                                    );
                                }}
                                value={selectedItemEdit?.employeeId ?? ''}
                                className="bg-slate-200"
                            >
                                <option value="" disabled>-- Chọn Nhân Viên --</option>
                                {customers.map((customer) => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.firstName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-10">
                            <label htmlFor="addressCustomerId">Thông Tin Giao Hàng</label>
                            <select
                                id="addressCustomerId"
                                onChange={(event) => {
                                    const selectedAddressCustomerId = Number(event.target.value);
                                    setSelectedItemEdit((prev) =>
                                        prev === null ? prev : { ...prev, addressCustomerId: selectedAddressCustomerId }
                                    );
                                }}
                                value={selectedItemEdit?.addressCustomerId ?? ''}
                                className="bg-slate-200"
                            >
                                <option value="" disabled>-- Chọn Nhân Viên --</option>
                                {customers.map((customer) => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.firstName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Ngày Đặt Hàng</label>
                            <Input
                                type="date"
                                onChange={(event) => {
                                    const selectedOrderDateTime = new Date(event.target.value);
                                    setSelectedItemEdit((prev) =>
                                        prev === null ? prev : { ...prev, orderDateTime: selectedOrderDateTime }
                                    );
                                }}
                                value={
                                    selectedItemEdit?.orderDateTime instanceof Date
                                        ? selectedItemEdit?.orderDateTime.toISOString().split('T')[0]
                                        : ''
                                }
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Tổng Tiền</label>
                            <Input
                                onChange={(event) => {
                                    setSelectedItemEdit((prev) =>
                                        prev === null ? prev : { ...prev, totalPrice: Number(event.target.value) }
                                    );
                                }}
                                value={selectedItemEdit?.totalPrice}
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Tiền Ship</label>
                            <Input
                                onChange={(event) => {
                                    setSelectedItemEdit((prev) =>
                                        prev === null ? prev : { ...prev, shippingCost: Number(event.target.value) }
                                    );
                                }}
                                value={selectedItemEdit?.shippingCost}
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Trạng Thái Giao Hàng</label>
                            <Input
                                onChange={(event) => {
                                    setSelectedItemEdit((prev) =>
                                        prev === null ? prev : { ...prev, orderStatus: event.target.value }
                                    );
                                }}
                                value={selectedItemEdit?.orderStatus}
                                className="bg-slate-200"
                            />
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

export default AppOrders;
