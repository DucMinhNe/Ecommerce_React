import { Button, Modal, Input, Select } from 'antd';
import { EditOutlined, DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import Table, { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SystemConst from '../../common/consts/system_const';
import Swal from 'sweetalert2';
interface DataType {
    id: number;
    customerId: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    isDeleted: boolean | null;
    action: React.ReactNode;
}
interface Customer {
    id: number;
    firstName: string;
}
interface Product {
    id: number;
    productName: string;
}
const BASE_URL = `${SystemConst.DOMAIN}/Carts`;
const BASE_URL_Customers = `${SystemConst.DOMAIN}/Customers`;
const BASE_URL_Products = `${SystemConst.DOMAIN}/Products`;
const AppCarts = () => {
    const columns: ColumnsType<DataType> = [
        {
            title: 'ID',
            dataIndex: 'id',
            sorter: (a, b) => a.id - b.id,
            sortDirections: ['ascend', 'descend'],
            align: 'center',
            width: 100,
        },
        {
            title: 'Khách Hàng',
            dataIndex: 'customer',
            align: 'center',
        },
        {
            title: 'Sản Phẩm',
            dataIndex: 'productId',
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

        // {
        //     title: 'Khách Hàng',
        //     dataIndex: 'customerId',
        // },
        {
            title: 'Hành động',
            dataIndex: 'action',
            align: 'center',
            width: 200,
        },
    ];
    const [dataCarts, setDataCarts] = useState<DataType[]>([]);
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
    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${BASE_URL_Products}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching job titles:', error);
            throw error; // Ném lỗi để xử lý ở nơi gọi hàm nếu cần
        }
    };
    const handleFetchData = () => {
        axios
            .get(`${BASE_URL}?isDeleted=${isDeletedFetchData}`)
            .then(async (response) => {
                const Api_Data_Carts = response.data;
                try {
                    const customers = await fetchCustomers();
                    const products = await fetchProducts();
                    const newData: DataType[] = Api_Data_Carts.map(
                        (item: DataType) => ({
                            id: item.id,
                            customerId: item.customerId,
                            customer: (customers.find((customer: { id: number; }) => customer.id === item.customerId) || {}).firstName || 'N/A',
                            productId: item.productId,
                            product: (products.find((product: { id: number; }) => product.id === item.productId) || {}).productName || 'N/A',
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                            isDeleted: item.isDeleted,
                            action: (
                                <>
                                    <div className="flex gap-x-1">
                                        <Button
                                            type="default"
                                            style={{ backgroundColor: '#1890ff', borderColor: '#1890ff', color: '#fff' }}
                                            icon={<EditOutlined />}
                                            onClick={() => handleEdit(item)}
                                        >
                                            Sửa
                                        </Button>
                                        {isDeletedFetchData ? (
                                            <Button
                                                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: '#fff' }}
                                                icon={<UndoOutlined />}
                                                onClick={() => handleRestore(item)}
                                            >
                                                Khôi Phục
                                            </Button>
                                        ) : (
                                            <Button
                                                style={{ backgroundColor: '#ff0000', borderColor: '#ff0000', color: '#fff' }}
                                                icon={<DeleteOutlined />}
                                                onClick={() => handleDelete(item)}
                                            >
                                                Xóa
                                            </Button>
                                        )}
                                    </div>
                                </>
                            ),
                        })
                    );
                    setDataCarts(newData);
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
    const handleCreateCarts = () => {
        const formData = new FormData();
        formData.append("customerId", isValueCustomerId);
        formData.append("productId", isValueProductId);
        formData.append("quantity", isValueQuantity);
        formData.append("unitPrice", isValueUnitPrice);
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
    const handleUpdateCarts = () => {
        if (!selectedItemEdit) {
            return;
        }
        const formData = new FormData();
        formData.append("customerId", String(selectedItemEdit.customerId || ''));
        formData.append("productId", String(selectedItemEdit.productId || ''));
        formData.append("quantity", String(selectedItemEdit.quantity || ''));
        formData.append("unitPrice", String(selectedItemEdit.unitPrice || ''));
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
    const handleSubmitEditCarts = () => {
        handleUpdateCarts();
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
    const [openModal, setOpenModal] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [isValueCustomerId, setIsValueCustomerId] = useState('');
    const [isValueProductId, setIsValueProductId] = useState('');
    const [isValueQuantity, setIsValueQuantity] = useState('');
    const [isValueUnitPrice, setIsValueUnitPrice] = useState('');
    const [customers, setCustomers] = useState<Customer[]>([]);
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
            title: 'Tạo Khách Hàng thành công',
            showConfirmButton: false,
            timer: 600,
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
                handleDeleteCart(item.id);
            }
        });
    };
    //Xử lý Call API Delete
    const handleDeleteCart = (itemId: number) => {
        const dataDelete = itemId;
        axios
            .delete(`${BASE_URL}/${dataDelete}`)
            .then((response) => {
                handleFetchData();
                Swal.fire({
                    icon: 'success',
                    title: 'Xóa thành công Khách Hàng',
                    showConfirmButton: false,
                    timer: 600,
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
                handleRestoreCart(item.id);
            }
        });
    };
    const handleRestoreCart = (itemId: number) => {
        const dataRestore = itemId;
        axios
            .put(`${BASE_URL}/Restore/${dataRestore}`)
            .then((response) => {
                handleFetchData();
                Swal.fire({
                    icon: 'success',
                    title: 'Khôi phục thành công',
                    showConfirmButton: false,
                    timer: 600,
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
                    <Button onClick={handleShowModal} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: '#fff', marginRight: '8px' }}>
                        +
                    </Button>
                    <Button onClick={handleToggleIsDeletedFetchData} style={{ backgroundColor: '#1890ff', borderColor: '#1890ff', color: '#fff' }}>
                        {isDeletedFetchData ? 'Xem Giỏ Hàng' : 'Xem Giỏ Hàng Đã Xóa'}
                    </Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={dataCarts}
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
            {/* Modal thêm Nhân Viên */}
            <>
                <Modal
                    className="custom-modal-create_and_edit_carts"
                    open={openModal}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <div className="p-5">
                        <span className="text-lg font-medium">Thêm Nhân Viên</span>
                        <div className="mt-10">
                            <label htmlFor="customer">Khách Hàng</label>
                            <select
                                id="customer"
                                onChange={(event) => { setIsValueCustomerId(event.target.value) }}
                                value={isValueCustomerId}
                                className="bg-slate-200"
                            >
                                <option value="">-- Chọn Khách Hàng --</option>
                                {customers.map((customer) => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.firstName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-10">
                            <label htmlFor="product">Sản Phẩm</label>
                            <select
                                id="product"
                                onChange={(event) => { setIsValueProductId(event.target.value) }}
                                value={isValueProductId}
                                className="bg-slate-200"
                            >
                                <option value="">-- Chọn Sản Phẩm --</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.productName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Số Lượng</label>
                            <Input
                                onChange={(event) => { setIsValueQuantity(event.target.value) }}
                                value={isValueQuantity}
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Giá</label>
                            <Input
                                onChange={(event) => { setIsValueUnitPrice(event.target.value) }}
                                value={isValueUnitPrice}
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="flex justify-end items-end">
                            <Button onClick={handleCreateCarts} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: '#fff', marginTop: 8 }} >
                                Lưu
                            </Button>
                        </div>
                    </div>
                </Modal>
            </>
            {/* Modal sửa Nhân Viên */}
            <>
                <Modal
                    className="custom-modal-create_and_edit_carts"
                    open={openModalEdit}
                    onCancel={handleCancelEdit}
                    footer={null}
                >
                    <div className="p-5">
                        <span className="text-lg font-medium">Sửa Nhân Viên</span>
                        <div className="mt-10">
                            <label htmlFor="customerId">Khách Hàng</label>
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
                                <option value="" disabled>-- Chọn Khách Hàng --</option>
                                {customers.map((customer) => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.firstName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-10">
                            <label htmlFor="productId">Sản Phẩm</label>
                            <select
                                id="productId"
                                onChange={(event) => {
                                    const selectedProductId = Number(event.target.value);
                                    setSelectedItemEdit((prev) =>
                                        prev === null ? prev : { ...prev, productId: selectedProductId }
                                    );
                                }}
                                value={selectedItemEdit?.productId ?? ''}
                                className="bg-slate-200"
                            >
                                <option value="" disabled>-- Chọn Sản Phẩm --</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.productName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Số Lượng</label>
                            <Input
                                onChange={(event) => {
                                    setSelectedItemEdit((prev) =>
                                        prev === null ? prev : { ...prev, quantity: Number(event.target.value) }
                                    );
                                }}
                                value={selectedItemEdit?.quantity || ''}
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Giá</label>
                            <Input
                                onChange={(event) => {
                                    setSelectedItemEdit((prev) =>
                                        prev === null ? prev : { ...prev, unitPrice: Number(event.target.value) }
                                    );
                                }}
                                value={selectedItemEdit?.unitPrice}
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="flex justify-end items-end">
                            <Button onClick={handleSubmitEditCarts} style={{ backgroundColor: '#1890ff', borderColor: '#1890ff', color: '#fff', marginTop: 8 }}  >
                                Lưu
                            </Button>
                        </div>
                    </div>
                </Modal>
            </>
        </>
    );
};

export default AppCarts;
