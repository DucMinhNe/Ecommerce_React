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
    jobTitleName: string;
    isDeleted: boolean | null;
    action: React.ReactNode;
}
const BASE_URL = `${SystemConst.DOMAIN}/JobTitles`;
const AppJobTitles = () => {
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
            title: 'Chức Vụ',
            dataIndex: 'jobTitleName',
            sorter: (a, b) => a.jobTitleName.localeCompare(b.jobTitleName),
            sortDirections: ['ascend', 'descend'],
            filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
                <div style={{ padding: 8 }}>
                    <Search
                        placeholder="Search Tên Chức Vụ"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => {
                            confirm(); // Call confirm() when Enter key is pressed
                        }}
                        style={{ width: 180, marginBottom: 8, display: 'block' }}
                    />
                </div>
            ),
            onFilter: (value, record) => {
                const jobTitleName = String(record.jobTitleName);
                return jobTitleName.toLowerCase().includes(String(value).toLowerCase());
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
    const [dataJobTitles, setDataJobTitles] = useState<DataType[]>([]);
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
                const Api_Data_JobTitles = response.data;
                const newData: DataType[] = Api_Data_JobTitles.map(
                    (item: DataType) => ({
                        id: item.id,
                        jobTitleName: item.jobTitleName,
                        isDeleted: item.isDeleted,
                        action: (
                            <>
                                <div className="flex justify-center item-center gap-x-1">
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
                    }),
                );
                setDataJobTitles(newData);
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
    const handleCreateJobTitles = () => {
        const data = {
            jobTitleName: isValueJobTitleName,
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
                setIsValueJobTitleName('');
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
            title: 'Tạo Chức Vụ thành công',
            showConfirmButton: false,
            timer: 1500,
        });
    };
    const handleCancel = () => {
        setOpenModal(false);
    };
    const [isValueJobTitleName, setIsValueJobTitleName] = useState('');
    //Xử lý Call API Update
    const handleUpdateJobTitles = () => {
        const data = {
            id: selectedItemEdit?.id,
            jobTitleName: selectedItemEdit?.jobTitleName,
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
        handleUpdateJobTitles();
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
            title: 'Cập nhật thành công Chức Vụ',
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
                    title: 'Xóa thành công Chức Vụ',
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
                    <Button onClick={handleShowModal} style={{ backgroundColor: '#6f9643', borderColor: '#6f9643', color: '#fff', marginRight: '8px' }}>
                        Thêm
                    </Button>
                    <Button onClick={handleToggleIsDeletedFetchData} 
                    style={{ 
                        borderColor: '#c00118', 
                        transition: 'background-color 0.3s, color 0.3s' }}
                        className='custom-buttonjobtitles'>
                        {isDeletedFetchData ? 'Xem Chức Vụ' : 'Xem Chức Vụ Đã Xóa'}
                    </Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={dataJobTitles}
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
            {/* Modal thêm Chức Vụ */}
            <>
                <Modal
                    className="custom-modal-create-and-edit-jobTitles"
                    open={openModal}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <div className="p-5">
                        <span className="text-lg font-medium">Thêm Chức Vụ</span>
                        <div className="mt-10">
                            <label htmlFor="">Tên Chức Vụ</label>
                            <Input
                                onChange={(event) => { setIsValueJobTitleName(event.target.value) }}
                                value={isValueJobTitleName}
                                className="bg-slate-200"
                                style={{borderColor:'black'}}
                            />
                        </div>

                        <div className="flex justify-end items-end ">
                            <Button onClick={handleCreateJobTitles} style={{ backgroundColor: 'black', borderColor: 'black', color: '#fff', marginTop: 8 }} >
                                Lưu
                            </Button>
                        </div>
                    </div>
                </Modal>
            </>
            {/* Modal sửa Chức Vụ */}
            <>
                <Modal
                    className="custom-modal-create_and_edit_jobTitles"
                    open={openModalEdit}
                    onCancel={handleCancelEdit}
                    footer={null}
                >
                    <div className="p-5">
                        <span className="text-lg font-medium">Sửa Chức Vụ</span>
                        <div className="mt-10">
                            <label htmlFor="">Tên Chức Vụ</label>
                            <Input
                                onChange={(event) => {
                                    setSelectedItemEdit((prev) =>
                                        prev === null ? prev : { ...prev, jobTitleName: event.target.value }
                                    );
                                }}
                                value={selectedItemEdit?.jobTitleName}
                                style={{ backgroundColor: '#f0f5ff', borderColor:'black' }}  // Màu nền tùy chọn
                            />
                        </div>
                        <div className="flex justify-end items-end">
                            <Button onClick={handleSubmitEdit} style={{ backgroundColor: 'black', borderColor: 'black', color: '#fff', marginTop: 8 }}  >
                                Lưu
                            </Button>
                        </div>
                    </div>
                </Modal>
            </>
        </>
    );
};

export default AppJobTitles;
