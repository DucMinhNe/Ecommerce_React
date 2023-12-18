import { Button, Modal, Input, Select } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import React, { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios';
import SystemConst from '../../../../common/consts/system_const';
import Swal from 'sweetalert2';
import StarPicker from './StarPicker';
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
    phoneNumber: string;
    address: string;
}
interface OrderDetails {
    id: number;
    orderId: number;
    productId: number;
    productImage: string | null;
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
const BASE_URL_Comments = `${SystemConst.DOMAIN}/Comments`;
const Orders = () => {
    const columns: ColumnsType<DataType> = [
        {
            title: 'Mã Đơn Hàng',
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
        // {
        //     title: 'Khách Hàng',
        //     dataIndex: 'customer',
        //     align: 'center',
        // },
        // {
        //     title: 'Nhân Viên',
        //     dataIndex: 'employee',
        //     align: 'center',
        // },
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
        {
            title: '',
            dataIndex: 'action',
            align: 'center',
            width: 100,
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
        var cusId = localStorage.getItem('customerId');
        axios
            .get(`${BASE_URL}?customerId=${cusId}&isDeleted=${isDeletedFetchData}`)
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
                                    {item.orderStatus === 'Đã Nhận Hàng' && (
                                        <div className="flex gap-x-1">
                                            <Button
                                                type="default"
                                                style={{ backgroundColor: '#1890ff', borderColor: '#1890ff', color: '#fff' }}
                                                onClick={() => handleComment(item)}
                                            >
                                                Đánh Giá
                                            </Button>
                                        </div>
                                    )}
                                    {item.orderStatus === 'Đã Giao Hàng' && (
                                        <div className="flex gap-x-1">
                                            <Button
                                                type="default"
                                                style={{ backgroundColor: '#30B420', borderColor: '#1890ff', color: '#fff' }}
                                                onClick={() => handleEdit(item)}
                                            >
                                                Xác Nhận
                                            </Button>
                                        </div>
                                    )}
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
    const clearAllValue = () => {
        setSelectedItemEdit(null);
        setIsValueCommentImageFile(null);
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
        formData.append("orderStatus", 'Đã Nhận Hàng');
        formData.append("isDeleted", `${isDeletedFetchData}`);

        // console.log(formData);
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
            timer: 600,
        });
    };
    const handleCommentOrders = () => {
        var cusId = localStorage.getItem('customerId');
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
        formData.append("orderStatus", 'Đã Nhận Hàng Và Đánh Giá');
        formData.append("isDeleted", `${isDeletedFetchData}`);

        const formDataComment = new FormData();
        if (isValueCommentImageFile !== null) {
            formDataComment.append("commentImageFile", isValueCommentImageFile);
        }
        formDataComment.append("customerId", String(cusId));
        formDataComment.append("content", isValueContent);
        formDataComment.append("rating", isValueRating);
        formDataComment.append("isDeleted", 'false');

        // console.log(isValueContent)
        // console.log(isValueRating)
        axios
            .put(`${BASE_URL}/${selectedItemEdit.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                // handleFetchData();
                // setOpenModalComment(false);
                // handleClickCommentSuccess();
                // clearAllValue();
                // console.log('Data', response);
                axios
                    .post(`${BASE_URL_Comments}`, formDataComment, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    })
                    .then((response) => {
                        handleFetchData();
                        setOpenModalComment(false);
                        handleClickCommentSuccess();
                        clearAllValue();
                        console.log('Data', response);
                    })
                    .catch((error) => {
                    });
            })
            .catch((error) => {
            });
    };
    const handleSubmitCommentOrders = () => {
        handleCommentOrders();
        setOpenModalComment(false);
    };
    const handleComment = (item: DataType) => {
        const formattedItem = {
            ...item,
        };
        setSelectedItemEdit(formattedItem);
        setOpenModalComment(true);
    };
    const handleClickCommentSuccess = () => {
        Swal.fire({
            icon: 'success',
            title: 'Cập nhật thành công',
            showConfirmButton: false,
            timer: 600,
        });
    };
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setIsValueCommentImageFile(file);
        }
    };
    const handleRatingChange = (newRating: React.SetStateAction<string>) => {
        setIsValueRating(newRating);
    };
    const [selectedItemComment, setSelectedItemComment] = useState<DataType | null>(null);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [openModalComment, setOpenModalComment] = useState(false);
    const [isValueCustomerId, setIsValueCustomerId] = useState('');
    const [isValueEmployeeId, setIsValueEmployeeId] = useState('');
    const [isValueAddressCustomerId, setIsValueAddressCustomerId] = useState('');
    const [isValueOrderDateTime, setIsValueOrderDateTime] = useState('');
    const [isValueTotalPrice, setIsValueTotalPrice] = useState('');
    const [isValueShippingCost, setIsValueShippingCost] = useState('');
    const [isValueOrderStatus, setIsValueOrderStatus] = useState('');
    const [isValueContent, setIsValueContent] = useState('');
    const [isValueRating, setIsValueRating] = useState('');
    const [isValueCommentImageFile, setIsValueCommentImageFile] = useState<File | null>(null);
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
    const handleCancelComment = () => {
        setOpenModalComment(false);
    };
    return (
        <>
            <div className="container mt-5 pl-20">
                <div className="flex justify-end mb-10">

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
            {/* Modal sửa Đơn Hàng */}
            <>
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
                {/* Modal Xác Nhận Đơn Hàng */}
                <>
                    <Modal
                        className="custom-modal-create_and_edit_orders"
                        open={openModalEdit}
                        onCancel={handleCancelEdit}
                        footer={null}
                    >
                        <div className="p-5">
                            <span className="text-lg font-medium">Xác Nhận Nhận Hàng</span>
                            <div className="mt-10">
                                <label htmlFor="">Trạng Thái Giao Hàng</label>
                                <select
                                    onChange={(event) => {
                                        setSelectedItemEdit((prev) =>
                                            prev === null ? prev : { ...prev, orderStatus: event.target.value }
                                        );
                                    }}
                                    disabled
                                    value={selectedItemEdit?.orderStatus}
                                    className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                >
                                    <option value="Đã Nhận Hàng">Đã Nhận Hàng</option>
                                </select>
                            </div>
                            <div className="flex justify-end items-end">
                                <Button onClick={handleSubmitEditOrders} style={{ backgroundColor: 'black', borderColor: 'black', color: '#fff', marginTop: 8 }}  >
                                    Xác Nhận
                                </Button>
                            </div>
                        </div>
                    </Modal>
                </>
                {/* Modal Xác Nhận Đơn Hàng */}
                <>
                    <Modal
                        className="custom-modal-create_and_edit_orders"
                        open={openModalComment}
                        onCancel={handleCancelComment}
                        footer={null}
                    >
                        <div className="p-5">
                            <span className="text-lg font-medium">Đánh Giá</span>
                            <div className="mt-10">
                                <label htmlFor="">Nội Dung</label>
                                <Input
                                    onChange={(event) => { setIsValueContent(event.target.value) }}
                                    value={isValueContent}
                                    className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                // style={{ borderColor: 'black' }}
                                />
                            </div>
                            <div className="mt-10">
                                <label htmlFor="">Đánh Giá</label>
                                <StarPicker onChange={handleRatingChange} />
                                {/* Hiển thị giá trị xếp hạng nếu cần */}
                                <p>Đánh giá của bạn: {isValueRating}</p>
                            </div>
                            <div className="mt-10">
                                <label htmlFor="formFile" className='mb-2 inline-block'>Hình Ảnh</label>
                                <input
                                    type="file"
                                    onChange={(event) => handleFileChange(event)}
                                    className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                                    id="formFile"
                                />
                            </div>
                            <div className="flex justify-end items-end">
                                <Button onClick={handleSubmitCommentOrders} style={{ backgroundColor: 'black', borderColor: 'black', color: '#fff', marginTop: 8 }}  >
                                    Xác Nhận
                                </Button>
                            </div>
                        </div>
                    </Modal>
                </>
            </>
        </>
    );
};

export default Orders;
