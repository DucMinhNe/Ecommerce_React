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
    providerName: string;
    isDeleted: boolean | null;
    action: React.ReactNode;
}
const BASE_URL = `${SystemConst.DOMAIN}/Providers`;
const AppProviders = () => {
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
            title: 'Nhà Cung Cấp',
            dataIndex: 'providerName',
            sorter: (a, b) => a.providerName.localeCompare(b.providerName),
            sortDirections: ['ascend', 'descend'],
            filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
                <div style={{ padding: 8 }}>
                    <Search
                        placeholder="Search Tên Nhà Cung Cấp"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}

                        onPressEnter={() => {
                            confirm(); // Call confirm() when Enter key is pressed
                        }}
                        style={{ width: 215, marginBottom: 8, display: 'block' }}
                    />
                </div>
            ),
            onFilter: (value, record) => {
                const providerName = String(record.providerName);
                return providerName.toLowerCase().includes(String(value).toLowerCase());
            },
            align: 'center',
        },
        {
            title: '',
            dataIndex: 'action',
            align: 'center',
            width: 100,
        },
    ];
    const [dataProviders, setDataProviders] = useState<DataType[]>([]);
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
                const Api_Data_Providers = response.data;
                const newData: DataType[] = Api_Data_Providers.map(
                    (item: DataType) => ({
                        id: item.id,
                        providerName: item.providerName,
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
                                                backgroundColor: '#c00118', borderColor: '#ff0000', color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            icon={<DeleteOutlined />}
                                            onClick={() => handleDelete(item)}
                                        >

                                        </Button>
                                    )}
                                </div>
                            </>
                        ),
                    }),
                );
                setDataProviders(newData);
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
    const handleCreateProviders = () => {
        const data = {
            providerName: isValueProviderName,
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
                setIsValueProviderName('');
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
            title: 'Tạo Nhà Cung Cấp thành công',
            showConfirmButton: false,
            timer: 1000,
        });
    };
    const handleCancel = () => {
        setOpenModal(false);
    };
    const [isValueProviderName, setIsValueProviderName] = useState('');
    //Xử lý Call API Update
    const handleUpdateProviders = () => {
        const data = {
            id: selectedItemEdit?.id,
            providerName: selectedItemEdit?.providerName,
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
        handleUpdateProviders();
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
            title: 'Cập nhật thành công Nhà Cung Cấp',
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
                    title: 'Xóa thành công Nhà Cung Cấp',
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
                        className="custom-buttonprovider">
                        {isDeletedFetchData ? 'Xem Nhà Cung Cấp' : 'Xem Nhà Cung Cấp Đã Xóa'}
                    </Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={dataProviders}
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
            {/* Modal thêm Nhà Cung Cấp */}
            <>
                <Modal
                    className="custom-modal-create-and-edit-providers"
                    open={openModal}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <div className="p-5">
                        <span className="text-lg font-medium">Thêm Nhà Cung Cấp</span>
                        <div className="mt-10">
                            <label htmlFor="">Tên Nhà Cung Cấp</label>
                            <Input
                                onChange={(event) => { setIsValueProviderName(event.target.value) }}
                                value={isValueProviderName}
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}
                            />
                        </div>
                        <div className="flex justify-end items-end ">
                            <Button onClick={handleCreateProviders} style={{ backgroundColor: '#121212', borderColor: '#121212', color: '#fff', marginTop: 8 }} >
                                Lưu
                            </Button>
                        </div>
                    </div>
                </Modal>
            </>
            {/* Modal sửa Nhà Cung Cấp */}
            <>
                <Modal
                    className="custom-modal-create_and_edit_providers"
                    open={openModalEdit}
                    onCancel={handleCancelEdit}
                    footer={null}
                >
                    <div className="p-5">
                        <span className="text-lg font-medium">Sửa Nhà Cung Cấp</span>
                        <div className="mt-10">
                            <label htmlFor="">Tên Nhà Cung Cấp</label>
                            <Input
                                onChange={(event) => {
                                    setSelectedItemEdit((prev) =>
                                        prev === null ? prev : { ...prev, providerName: event.target.value }
                                    );
                                }}
                                value={selectedItemEdit?.providerName}
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}
                            />
                        </div>
                        <div className="flex justify-end items-end">
                            <Button onClick={handleSubmitEdit} style={{ backgroundColor: 'Black', borderColor: 'black', color: '#fff', marginTop: 8 }}  >
                                Lưu
                            </Button>
                        </div>
                    </div>
                </Modal>
            </>
        </>
    );
};

export default AppProviders;
