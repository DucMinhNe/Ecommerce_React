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
    paymentMethodName: string;
    isDeleted: boolean | null;
    action: React.ReactNode;
}
const BASE_URL = `${SystemConst.DOMAIN}/PaymentMethods`;
const AppPaymentMethods = () => {
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
            title: 'Tên Phương Thức Thanh Toán',
            dataIndex: 'paymentMethodName',
            sorter: (a, b) => a.paymentMethodName.localeCompare(b.paymentMethodName),
            sortDirections: ['ascend', 'descend'],
            filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
                <div style={{ padding: 8 }}>
                    <Search
                        placeholder="Search Tên Phương Thức Thanh Toán"
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
                const paymentMethodName = String(record.paymentMethodName);
                return paymentMethodName.toLowerCase().includes(String(value).toLowerCase());
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
    const [dataPaymentMethods, setDataPaymentMethods] = useState<DataType[]>([]);
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
                const Api_Data_PaymentMethods = response.data;
                const newData: DataType[] = Api_Data_PaymentMethods.map(
                    (item: DataType) => ({
                        id: item.id,
                        paymentMethodName: item.paymentMethodName,
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
                setDataPaymentMethods(newData);
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
    const handleCreatePaymentMethods = () => {
        const data = {
            paymentMethodName: isValuePaymentMethodName,
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
                setIsValuePaymentMethodName('');
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
            title: 'Tạo Phương Thức Thanh Toán thành công',
            showConfirmButton: false,
            timer: 600,
        });
    };
    const handleCancel = () => {
        setOpenModal(false);
    };
    const [isValuePaymentMethodName, setIsValuePaymentMethodName] = useState('');
    //Xử lý Call API Update
    const handleUpdatePaymentMethods = () => {
        const data = {
            id: selectedItemEdit?.id,
            paymentMethodName: selectedItemEdit?.paymentMethodName,
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
        handleUpdatePaymentMethods();
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
            title: 'Cập nhật thành công Phương Thức Thanh Toán',
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
                    title: 'Xóa thành công Phương Thức Thanh Toán',
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
                        {isDeletedFetchData ? 'Xem Phương Thức Thanh Toán' : 'Xem Phương Thức Thanh Toán Đã Xóa'}
                    </Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={dataPaymentMethods}
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
            {/* Modal thêm Phương Thức Thanh Toán */}
            <>
                <Modal
                    className="custom-modal-create-and-edit-paymentMethods"
                    open={openModal}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <div className="p-5">
                        <span className="text-lg font-medium">Thêm Phương Thức Thanh Toán</span>
                        <div className="mt-10">
                            <label htmlFor="">Tên Phương Thức Thanh Toán</label>
                            <Input
                                onChange={(event) => { setIsValuePaymentMethodName(event.target.value) }}
                                value={isValuePaymentMethodName}
                                className="bg-slate-200"
                            />
                        </div>

                        <div className="flex justify-end items-end ">
                            <Button onClick={handleCreatePaymentMethods} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: '#fff', marginTop: 8 }} >
                                Lưu
                            </Button>
                        </div>
                    </div>
                </Modal>
            </>
            {/* Modal sửa Phương Thức Thanh Toán */}
            <>
                <Modal
                    className="custom-modal-create_and_edit_paymentMethods"
                    open={openModalEdit}
                    onCancel={handleCancelEdit}
                    footer={null}
                >
                    <div className="p-5">
                        <span className="text-lg font-medium">Sửa Phương Thức Thanh Toán</span>
                        <div className="mt-10">
                            <label htmlFor="">Tên Phương Thức Thanh Toán</label>
                            <Input
                                onChange={(event) => {
                                    setSelectedItemEdit((prev) =>
                                        prev === null ? prev : { ...prev, paymentMethodName: event.target.value }
                                    );
                                }}
                                value={selectedItemEdit?.paymentMethodName}
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

export default AppPaymentMethods;
