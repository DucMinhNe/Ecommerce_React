import { Button, Modal, Input } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import React, { ChangeEvent, useEffect, useState } from 'react';
import Notification from '../../components/Notification';
import axios from 'axios';
import SystemConst from '../../common/consts/system_const';
import UnauthorizedError from '../../common/exception/unauthorized_error';
import ErrorCommon from '../../common/Screens/ErrorCommon';
import moment from 'moment';
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
            title: 'Tên Sản Phẩm',
            dataIndex: 'productName',
        },
        {
            title: 'Mô Tả',
            dataIndex: 'description',
        },
        {
            title: 'Đánh Giá',
            dataIndex: 'rating',
        },
        {
            title: 'Giá Bán',
            dataIndex: 'unitPrice',
        },
        {
            title: 'Số Lượng Tồn',
            dataIndex: 'stockQuantity',
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
        },
        // {
        //     title: 'Nhà Cung Cấp',
        //     dataIndex: 'providerId',
        // },
        {
            title: 'Loại Sản Phẩm',
            dataIndex: 'productCategory',
        },
        {
            title: 'Nhà Cung Cấp',
            dataIndex: 'provider',
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
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
                                    <div className="flex gap-x-1">
                                        <button
                                            className="bg-green-400 px-3 py-2 rounded-lg hover:bg-green-600 hover:text-white"
                                            onClick={() => handleEdit(item)}
                                        >
                                            Sửa
                                        </button>
                                        {isDeletedFetchData ? (
                                            <button
                                                className="bg-blue-500 px-3 py-2 rounded-lg hover:bg-blue-700 hover:text-white"
                                                onClick={() => handleRestore(item)}
                                            >
                                                Khôi Phục
                                            </button>
                                        ) : (
                                            <button
                                                className="bg-red-500 px-3 py-2 rounded-lg hover:bg-red-700 hover:text-white"
                                                onClick={() => handleDelete(item)}
                                            >
                                                Xóa
                                            </button>
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
                const isError = UnauthorizedError.checkError(error);
                if (!isError) {
                    const content = 'Lỗi máy chủ';
                    const title = 'Lỗi';
                    ErrorCommon(title, content);
                }
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
        Notification('success', 'Thông báo', 'Cập nhật thành công Sản Phẩm');
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
        Notification('success', 'Thông báo', 'Tạo Sản Phẩm thành công');
    };
    const handleDelete = (item: { id: number }) => {
        setDeleteModalVisible(true);
        setSelectedItemDelete(item);
    };
    const handleSubmitDelete = () => {
        handleDeleteProduct();
        setDeleteModalVisible(false);
    };
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedItemDetele, setSelectedItemDelete] = useState<{ id?: number } | null>(null);
    const handleClickDeleteSuccess = () => {
        Notification('success', 'Thông báo', 'Xóa thành công Sản Phẩm');
    };
    //Xử lý Call API Delete
    const handleDeleteProduct = () => {
        const dataDelete = selectedItemDetele?.id;
        axios
            .delete(`${BASE_URL}/${dataDelete}`)
            .then((response) => {
                handleFetchData();
                handleClickDeleteSuccess();
            })
            .catch((error) => {
            });
    };
    const handleRestore = (item: { id: number }) => {
        setRestoreModalVisible(true);
        setSelectedItemRestore(item);
    };
    const handleSubmitRestore = () => {
        handleRestoreProduct();
        setRestoreModalVisible(false);
    };
    const [restoreModalVisible, setRestoreModalVisible] = useState(false);
    const [selectedItemRestore, setSelectedItemRestore] = useState<{ id?: number } | null>(null);
    const handleClickRestoreSuccess = () => {
        Notification('success', 'Thông báo', 'Khôi phục thành công');
    };
    //Xử lý Call API Restore
    const handleRestoreProduct = () => {
        const dataRestore = selectedItemRestore?.id;
        axios
            .put(`${BASE_URL}/Restore/${dataRestore}`)
            .then((response) => {
                handleFetchData();
                handleClickRestoreSuccess();
            })
            .catch((error) => {
            });
    };
    return (
        <>
            <div className="container mt-5 ">
                <div className="flex justify-end mb-5">
                    <Button onClick={handleShowModal}>
                        Thêm
                    </Button>
                    <Button onClick={handleToggleIsDeletedFetchData}>
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
                    }}
                >
                    {/* <Spin spinning={isLoading} size="large"></Spin> */}
                </Table>
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
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Mô Tả</label>
                            <Input
                                onChange={(event) => { setIsValueDescription(event.target.value) }}
                                value={isValueDescription}
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Đánh Giá</label>
                            <Input
                                onChange={(event) => { setIsValueRating(event.target.value) }}
                                value={isValueRating}
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Giá Bán</label>
                            <Input
                                onChange={(event) => { setIsValueUnitPrice(event.target.value) }}
                                value={isValueUnitPrice}
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Số Lượng Tồn</label>
                            <Input
                                onChange={(event) => { setIsValueStockQuantity(event.target.value) }}
                                value={isValueStockQuantity}
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Hình Ảnh</label>
                            <input
                                type="file"
                                onChange={(event) => handleFileChange(event)}
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="productCategory">Loại Sản Phẩm</label>
                            <select
                                id="productCategory"
                                onChange={(event) => { setIsValueProductCategoryId(event.target.value) }}
                                value={isValueProductCategoryId}
                                className="bg-slate-200"
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
                                className="bg-slate-200"
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
                            <Button onClick={handleCreateProducts} className="bg-green-400 px-3 py-2 rounded-lg hover:bg-green-600 hover:text-white">
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
                                className="bg-slate-200"
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
                                className="bg-slate-200"
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
                                className="bg-slate-200"
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
                                className="bg-slate-200"
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
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Hình Ảnh</label>
                            <input
                                type="file"
                                onChange={(event) => handleFileChange(event)}
                                className="bg-slate-200"
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
                                className="bg-slate-200"
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
                                className="bg-slate-200"
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
                            <Button onClick={handleSubmitEditProducts} className="bg-green-400 px-3 py-2 rounded-lg hover:bg-green-600 hover:text-white">
                                Lưu
                            </Button>
                        </div>
                    </div>
                </Modal>
            </>
            {/* Modal xóa và khôi phục */}
            <>
                <Modal
                    title={deleteModalVisible ? "Xác nhận xóa" : "Xác nhận khôi phục"}
                    className={deleteModalVisible ? "delete" : "restore"}
                    visible={deleteModalVisible || restoreModalVisible}
                    onCancel={() => {
                        setDeleteModalVisible(false);
                        setRestoreModalVisible(false);
                    }}
                    footer={null}
                >
                    <div>
                        <p>
                            {deleteModalVisible
                                ? "Bạn có chắc chắn muốn xóa không?"
                                : "Bạn có chắc chắn muốn khôi phục không?"}
                        </p>
                    </div>
                    <div className="flex justify-end h-full mt-20">
                        <Button
                            onClick={deleteModalVisible ? handleSubmitDelete : handleSubmitRestore}

                            className="mr-5"
                        >
                            {deleteModalVisible ? "Xóa" : "Khôi Phục"}
                        </Button>
                        <Button
                            onClick={() => {
                                setDeleteModalVisible(false);
                                setRestoreModalVisible(false);
                            }}
                            type="default"
                            className="mr-5"
                        >
                            Hủy
                        </Button>
                    </div>
                </Modal>
            </>
        </>
    );
};

export default AppProducts;
