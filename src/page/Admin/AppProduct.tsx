import { Button, Modal, Input, Select } from 'antd';
import { EditOutlined, DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import Table, { ColumnsType } from 'antd/es/table';
import React, { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios';
import SystemConst from '../../common/consts/system_const';
import Swal from 'sweetalert2';
interface DataType {
    id: number;
    productName: string;
    description: string;
    rating: number;
    unitPrice: number;
    stockQuantity: number;
    productImage: string | null;
    productImageFile: File | null;
    productCategoryId: number;
    providerId: number;
    isDeleted: boolean | null;
    action: React.ReactNode;
}
interface ProductCategory {
    id: number;
    productCategoryName: string;
}
interface Provider {
    id: number;
    providerName: string;
}
const BASE_URL = `${SystemConst.DOMAIN}/Products`;
const BASE_URL_ProductCategories = `${SystemConst.DOMAIN}/ProductCategories`;
const BASE_URL_Providers = `${SystemConst.DOMAIN}/Providers`;
const AppProducts = () => {
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
            title: 'Sản Phẩm',
            dataIndex: 'productName',
            align: 'center',
        },
        {
            title: 'Mô Tả',
            dataIndex: 'description',
            align: 'center',
        },
        {
            title: 'Đánh Giá',
            dataIndex: 'rating',
            align: 'center',
        },
        {
            title: 'Giá Bán',
            dataIndex: 'unitPrice',
            align: 'center',
        },
        {
            title: 'Số Lượng Tồn',
            dataIndex: 'stockQuantity',
            align: 'center',
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
        // {
        //     title: 'Nhà Cung Cấp',
        //     dataIndex: 'providerId',
        // },
        {
            title: 'Loại Sản Phẩm',
            dataIndex: 'productCategory',
            align: 'center',
        },
        {
            title: 'Nhà Cung Cấp',
            dataIndex: 'provider',
            align: 'center',
        },
        {
            title: '',
            dataIndex: 'action',
            align: 'center',
            width: 100,
        },
    ];
    const [dataProducts, setDataProducts] = useState<DataType[]>([]);
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
    const fetchProviders = async () => {
        try {
            const response = await axios.get(`${BASE_URL_Providers}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching job titles:', error);
            throw error; // Ném lỗi để xử lý ở nơi gọi hàm nếu cần
        }
    };
    const fetchProductCategories = async () => {
        try {
            const response = await axios.get(`${BASE_URL_ProductCategories}`);
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
                const Api_Data_Products = response.data;
                try {
                    const productCategories = await fetchProductCategories();
                    const providers = await fetchProviders();
                    const newData: DataType[] = Api_Data_Products.map(
                        (item: DataType) => ({
                            id: item.id,
                            productName: item.productName,
                            description: item.description,
                            rating: item.rating,
                            stockQuantity: item.stockQuantity,
                            unitPrice: item.unitPrice,
                            productImage: item.productImage,
                            productImageFile: item.productImageFile,
                            productCategoryId: item.productCategoryId,
                            productCategory: (productCategories.find((productCategory: { id: number; }) => productCategory.id === item.productCategoryId) || {}).productCategoryName || 'N/A',
                            providerId: item.providerId,
                            provider: (providers.find((provider: { id: number; }) => provider.id === item.providerId) || {}).providerName || 'N/A',
                            isDeleted: item.isDeleted,
                            action: (
                                <>
                                    <div className="flex justify-center items-center gap-x-1">
                                        <Button
                                            type="default"
                                            style={{
                                                backgroundColor: '#459664', borderColor: '#459664', color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            icon={<EditOutlined />}
                                            onClick={() => handleEdit(item)}
                                        >
                                            {/* Sửa */}
                                        </Button>
                                        {isDeletedFetchData ? (
                                            <Button
                                                style={{
                                                    backgroundColor: '#e74c3c', borderColor: '#e74c3c', color: '#fff',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                                icon={<UndoOutlined />}
                                                onClick={() => handleRestore(item)}
                                            >
                                                {/* Khôi Phục */}
                                            </Button>
                                        ) : (
                                            <Button
                                                style={{
                                                    backgroundColor: '#c00118', borderColor: '#c00118', color: '#fff',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
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
                    setDataProducts(newData);
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
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setIsValueProductImageFile(file);
        }
    };
    //Xử lý Call API Create
    const handleCreateProducts = () => {
        const formData = new FormData();
        formData.append("productName", isValueProductName);
        formData.append("description", isValueDescription);
        formData.append("rating", isValueRating);
        formData.append("unitPrice", isValueUnitPrice);
        formData.append("stockQuantity", isValueStockQuantity);
        if (isValueProductImageFile !== null) {
            formData.append("productImageFile", isValueProductImageFile);
        }
        formData.append("productCategoryId", isValueProductCategoryId);
        formData.append("providerId", isValueProviderId);

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
        setIsValueProductImageFile(null);
    }
    const handleUpdateProducts = () => {
        if (!selectedItemEdit) {
            return;
        }
        const formData = new FormData();
        formData.append("productName", selectedItemEdit.productName || '');
        formData.append("description", selectedItemEdit.description || '');
        formData.append("rating", String(selectedItemEdit.rating || ''));
        formData.append("unitPrice", String(selectedItemEdit.unitPrice || ''));
        formData.append("stockQuantity", String(selectedItemEdit.stockQuantity || ''));
        if (isValueProductImageFile !== null) {
            formData.append("productImageFile", isValueProductImageFile);
            formData.append("productImage", selectedItemEdit.productImage || '');
        }
        formData.append("productCategoryId", String(selectedItemEdit.productCategoryId || ''));
        formData.append("providerId", String(selectedItemEdit.providerId || ''));
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
    const handleSubmitEditProducts = () => {
        handleUpdateProducts();
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
    const [isValueProductName, setIsValueProductName] = useState('');
    const [isValueDescription, setIsValueDescription] = useState('');
    const [isValueRating, setIsValueRating] = useState('');
    const [isValueUnitPrice, setIsValueUnitPrice] = useState('');
    const [isValueStockQuantity, setIsValueStockQuantity] = useState('');
    const [isValueProductImageFile, setIsValueProductImageFile] = useState<File | null>(null);
    const [isValueProductCategoryId, setIsValueProductCategoryId] = useState('');
    const [isValueProviderId, setIsValueProviderId] = useState('');
    const [providers, setProviders] = useState<Provider[]>([]);
    const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
    // Fetch Providers on component mount
    useEffect(() => {
        const fetchProvidersAndSetState = async () => {
            try {
                const providersData = await fetchProviders();
                setProviders(providersData || []); // Ensure providersData is an array, or set it to an empty array if it's falsy
            } catch (error) {
                console.error('Error fetching job titles:', error);
            }
        };

        fetchProvidersAndSetState();
    }, []);
    // Fetch ProductCategories on component mount
    useEffect(() => {
        const fetchProductCategoriesAndSetState = async () => {
            try {
                const productCategoriesData = await fetchProductCategories();
                setProductCategories(productCategoriesData || []); // Ensure productCategoriesData is an array, or set it to an empty array if it's falsy
            } catch (error) {
                console.error('Error fetching job titles:', error);
            }
        };

        fetchProductCategoriesAndSetState();
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
                handleDeleteAddressCustomer(item.id);
            }
        });
    };
    //Xử lý Call API Delete
    const handleDeleteAddressCustomer = (itemId: number) => {
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
                handleRestoreAddressCustomer(item.id);
            }
        });
    };
    const handleRestoreAddressCustomer = (itemId: number) => {
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
                    <Button onClick={handleShowModal}
                        style={{
                            backgroundColor: '#6f9643',
                            borderColor: '#6f9643',
                            color: '#fff',
                            marginRight: '8px'
                        }}>
                        Thêm
                    </Button>
                    <Button onClick={handleToggleIsDeletedFetchData}
                        style={{
                            borderColor: '#c00118',
                            transition: 'background-color 0.3s, color 0.3s'
                        }}
                        className="custom-buttonproducts">
                        {isDeletedFetchData ? 'Xem Sản Phẩm' : 'Xem Sản Phẩm Đã Xóa'}
                    </Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={dataProducts}
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
            {/* Modal thêm Sản Phẩm */}
            <>
                <Modal
                    className="custom-modal-create_and_edit_products"
                    open={openModal}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <div className="p-5">
                        <span className="text-lg font-medium">Thêm Sản Phẩm</span>
                        <div className="mt-10">
                            <label htmlFor="">Tên Sản Phẩm</label>
                            <Input
                                onChange={(event) => { setIsValueProductName(event.target.value) }}
                                value={isValueProductName}
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Mô Tả</label>
                            <Input
                                onChange={(event) => { setIsValueDescription(event.target.value) }}
                                value={isValueDescription}
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Đánh Giá</label>
                            <Input
                                onChange={(event) => { setIsValueRating(event.target.value) }}
                                value={isValueRating}
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Giá Bán</label>
                            <Input
                                onChange={(event) => { setIsValueUnitPrice(event.target.value) }}
                                value={isValueUnitPrice}
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Số Lượng Tồn</label>
                            <Input
                                onChange={(event) => { setIsValueStockQuantity(event.target.value) }}
                                value={isValueStockQuantity}
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="formFile">Hình Ảnh</label>
                            <input
                                type="file"
                                onChange={(event) => handleFileChange(event)}
                                className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                                id="formFile"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="productCategory">Loại Sản Phẩm</label>
                            <select
                                id="productCategory"
                                onChange={(event) => { setIsValueProductCategoryId(event.target.value) }}
                                value={isValueProductCategoryId}
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}
                            >
                                <option value="">-- Chọn Loại Sản Phẩm --</option>
                                {productCategories.map((productCategory) => (
                                    <option key={productCategory.id} value={productCategory.id}>
                                        {productCategory.productCategoryName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-10">
                            <label htmlFor="provider">Nhà Cung Cấp</label>
                            <select
                                id="provider"
                                onChange={(event) => { setIsValueProviderId(event.target.value) }}
                                value={isValueProviderId}
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}
                            >
                                <option value="">-- Chọn Nhà Cung Cấp --</option>
                                {providers.map((provider) => (
                                    <option key={provider.id} value={provider.id}>
                                        {provider.providerName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end items-end">
                            <Button onClick={handleCreateProducts} style={{ backgroundColor: 'black', borderColor: 'black', color: '#fff', marginTop: 8 }} >
                                Lưu
                            </Button>
                        </div>
                    </div>
                </Modal>
            </>
            {/* Modal sửa Sản Phẩm */}
            <>
                <Modal
                    className="custom-modal-create_and_edit_products"
                    open={openModalEdit}
                    onCancel={handleCancelEdit}
                    footer={null}
                >
                    <div className="p-5">
                        <span className="text-lg font-medium">Sửa Sản Phẩm</span>
                        <div className="mt-10">
                            <label htmlFor="productName">Tên Sản Phẩm</label>
                            <Input
                                onChange={(event) => {
                                    setSelectedItemEdit((prev) =>
                                        prev === null ? prev : { ...prev, productName: event.target.value }
                                    );
                                }}
                                value={selectedItemEdit?.productName || ''}
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="description">Mô tả</label>
                            <Input
                                onChange={(event) => {
                                    setSelectedItemEdit((prev) =>
                                        prev === null ? prev : { ...prev, description: event.target.value }
                                    );
                                }}
                                value={selectedItemEdit?.description || ''}
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Đánh Giá</label>
                            <Input
                                onChange={(event) => {
                                    setSelectedItemEdit((prev) =>
                                        prev === null ? prev : { ...prev, rating: Number(event.target.value) }
                                    );
                                }}
                                value={selectedItemEdit?.rating}
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Giá Bán</label>
                            <Input
                                onChange={(event) => {
                                    setSelectedItemEdit((prev) =>
                                        prev === null ? prev : { ...prev, unitPrice: Number(event.target.value) }
                                    );
                                }}
                                value={selectedItemEdit?.unitPrice}
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Số Lượng Tồn</label>
                            <Input
                                onChange={(event) => {
                                    setSelectedItemEdit((prev) =>
                                        prev === null ? prev : { ...prev, stockQuantity: Number(event.target.value) }
                                    );
                                }}
                                value={selectedItemEdit?.stockQuantity || ''}
                                readOnly={false}
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="formFile">Hình Ảnh</label>
                            <input
                                type="file"
                                onChange={(event) => handleFileChange(event)}
                                className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                                id="formFile"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="productCategoryId">Loại Sản Phẩm</label>
                            <select
                                id="productCategoryId"
                                onChange={(event) => {
                                    const selectedProductCategoryId = Number(event.target.value);
                                    setSelectedItemEdit((prev) =>
                                        prev === null ? prev : { ...prev, productCategoryId: selectedProductCategoryId }
                                    );
                                }}
                                value={selectedItemEdit?.productCategoryId ?? ''}
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}
                            >
                                <option value="" disabled>-- Chọn Loại Sản Phẩm --</option>
                                {productCategories.map((productCategory) => (
                                    <option key={productCategory.id} value={productCategory.id}>
                                        {productCategory.productCategoryName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-10">
                            <label htmlFor="providerId">Nhà Cung Cấp</label>
                            <select
                                id="providerId"
                                onChange={(event) => {
                                    const selectedProviderId = Number(event.target.value);
                                    setSelectedItemEdit((prev) =>
                                        prev === null ? prev : { ...prev, providerId: selectedProviderId }
                                    );
                                }}
                                value={selectedItemEdit?.providerId ?? ''}
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}
                            >
                                <option value="" disabled>-- Chọn Nhà Cung Cấp --</option>
                                {providers.map((provider) => (
                                    <option key={provider.id} value={provider.id}>
                                        {provider.providerName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end items-end">
                            <Button onClick={handleSubmitEditProducts} style={{ backgroundColor: 'black', borderColor: 'black', color: '#fff', marginTop: 8 }}  >
                                Lưu
                            </Button>
                        </div>
                    </div>
                </Modal>
            </>
        </>
    );
};

export default AppProducts;
