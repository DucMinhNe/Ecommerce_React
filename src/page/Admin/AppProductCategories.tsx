import { Button, Modal, Input, Table } from 'antd';
import { EditOutlined, DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import { SearchOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import SystemConst from '../../common/consts/system_const';
interface DataType {
    id: number;
    productCategoryName: string;
    isDeleted: boolean | null;
    action: React.ReactNode;
}
const BASE_URL = `${SystemConst.DOMAIN}/ProductCategories`;
const AppProductCategories = () => {
    const { Search } = Input;
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
            title: 'Loại Sản Phẩm',
            dataIndex: 'productCategoryName',
            sorter: (a, b) => a.productCategoryName.localeCompare(b.productCategoryName),
            sortDirections: ['ascend', 'descend'],
            filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
                <div style={{ padding: 8 }}>
                    <Search
                        placeholder="Search Tên Loại Sản Phẩm"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => {
                            confirm(); // Call confirm() when Enter key is pressed
                        }}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                </div>
            ),
            onFilter: (value, record) => {
                const productCategoryName = String(record.productCategoryName);
                return productCategoryName.toLowerCase().includes(String(value).toLowerCase());
            },
            align: 'center',
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
            align: 'center',
            width: 200,
        },
    ];
    const [dataProductCategories, setDataProductCategories] = useState<DataType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedItemEdit, setSelectedItemEdit] = useState<DataType | null>(null);
    //Xử lý Call API Get Data
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
    const handleFetchData = () => {
        axios
            .get(`${BASE_URL}?isDeleted=${isDeletedFetchData}`)
            .then((response) => {
                const Api_Data_ProductCategories = response.data;
                const newData: DataType[] = Api_Data_ProductCategories.map(
                    (item: DataType) => ({
                        id: item.id,
                        productCategoryName: item.productCategoryName,
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
                    }),
                );
                setDataProductCategories(newData);
            })
            .catch((error) => {
                // Swal.fire({
                //     icon: "error",
                //     title: "Thông Báo",
                //     text: "Có Lỗi Xảy Ra",
                // });
            });
    };
    useEffect(() => {
        handleFetchData();
    }, [isDeletedFetchData]);
    //Xử lý Call API Create
    const handleCreateProductCategories = () => {
        const data = {
            productCategoryName: isValueProductCategoryName,
            isDeleted: false
        };
        axios
            .post(`${BASE_URL}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    // Other headers or authentication tokens if required
                },
            })
            .then((response) => {
                handleFetchData();
                setIsValueProductCategoryName('');
                setOpenModal(false);
                handleClickSuccess();
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Thông Báo",
                    text: "Có Lỗi Xảy Ra",
                });
            });
    };
    const [openModal, setOpenModal] = useState(false);
    const handleShowModal = () => {
        setOpenModal(true);
    };
    const handleClickSuccess = () => {
        Swal.fire({
            icon: 'success',
            title: 'Tạo Loại Sản Phẩm thành công',
            showConfirmButton: false,
            timer: 600,
        });
    };
    const handleCancel = () => {
        setOpenModal(false);
    };
    const [isValueProductCategoryName, setIsValueProductCategoryName] = useState('');
    //Xử lý Call API Update
    const handleUpdateProductCategories = () => {
        const data = {
            id: selectedItemEdit?.id,
            productCategoryName: selectedItemEdit?.productCategoryName,
            isDeleted: isDeletedFetchData
        };
        axios
            .put(`${BASE_URL}/${data.id}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    // Other headers or authentication tokens if required
                },
            })
            .then((response) => {
                handleClickEditSuccess();
                handleFetchData();
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Thông Báo",
                    text: "Có Lỗi Xảy Ra",
                });
            });
    };
    const handleSubmitEdit = () => {
        handleUpdateProductCategories();
        setOpenModalEdit(false);
    };
    //Khai báo các State quản lí trạng thái
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const handleEdit = (item: DataType) => {
        setOpenModalEdit(true);
        setSelectedItemEdit(item);
    };
    const handleCancelEdit = () => {
        setOpenModalEdit(false);
    };
    const handleClickEditSuccess = () => {
        Swal.fire({
            icon: 'success',
            title: 'Cập nhật thành công Loại Sản Phẩm',
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
                    title: 'Xóa thành công Loại Sản Phẩm',
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
                        {isDeletedFetchData ? 'Xem Loại Sản Phẩm' : 'Xem Loại Sản Phẩm Đã Xóa'}
                    </Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={dataProductCategories}
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
            {/* Modal thêm Loại Sản Phẩm */}
            <>
                <Modal
                    className="custom-modal-create-and-edit-productCategories"
                    open={openModal}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <div className="p-5">
                        <span className="text-lg font-medium">Thêm Loại Sản Phẩm</span>
                        <div className="mt-10">
                            <label htmlFor="">Tên Loại Sản Phẩm</label>
                            <Input
                                onChange={(event) => { setIsValueProductCategoryName(event.target.value) }}
                                value={isValueProductCategoryName}
                                className="bg-slate-200"
                            />
                        </div>

                        <div className="flex justify-end items-end ">
                            <Button onClick={handleCreateProductCategories} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: '#fff', marginTop: 8 }} >
                                Lưu
                            </Button>
                        </div>
                    </div>
                </Modal>
            </>
            {/* Modal sửa Loại Sản Phẩm */}
            <>
                <Modal
                    className="custom-modal-create_and_edit_productCategories"
                    open={openModalEdit}
                    onCancel={handleCancelEdit}
                    footer={null}
                >
                    <div className="p-5">
                        <span className="text-lg font-medium">Sửa Loại Sản Phẩm</span>
                        <div className="mt-10">
                            <label htmlFor="">Tên Loại Sản Phẩm</label>
                            <Input
                                onChange={(event) => {
                                    setSelectedItemEdit((prev) =>
                                        prev === null ? prev : { ...prev, productCategoryName: event.target.value }
                                    );
                                }}
                                value={selectedItemEdit?.productCategoryName}
                                style={{ backgroundColor: '#f0f5ff' }}  // Màu nền tùy chọn
                            />
                        </div>
                        <div className="flex justify-end items-end">
                            <Button onClick={handleSubmitEdit} style={{ backgroundColor: '#1890ff', borderColor: '#1890ff', color: '#fff', marginTop: 8 }}  >
                                Lưu
                            </Button>
                        </div>
                    </div>
                </Modal>
            </>
        </>
    );
};

export default AppProductCategories;
