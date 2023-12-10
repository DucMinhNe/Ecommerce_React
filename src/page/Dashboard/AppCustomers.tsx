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
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    birthDate: Date | null;
    gender: boolean | null;
    customerImage: string | null;
    customerImageFile: File | null;
    isDeleted: boolean | null;
    action: React.ReactNode;
}
const BASE_URL = `${SystemConst.DOMAIN}/Customers`;
const AppCustomers = () => {
    const columns: ColumnsType<DataType> = [
        {
            title: 'Họ',
            dataIndex: 'firstName',
        },
        {
            title: 'Tên',
            dataIndex: 'lastName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Mật Khẩu',
            dataIndex: 'password',
        },
        {
            title: 'Số Điện Thoại',
            dataIndex: 'phoneNumber',
        },
        {
            title: 'Ngày Sinh',
            dataIndex: 'birthDate',
        },
        {
            title: 'Giới Tính',
            dataIndex: 'gender',
            render: (text, record) => {
                return record.gender ? 'Nam' : 'Nữ';
            },
        },
        {
            title: 'Hình Ảnh',
            dataIndex: 'customerImage',
            render: (customerImage: string) => (
                <img
                    src={`${SystemConst.DOMAIN_HOST}/${customerImage}`}
                    alt="Customer Avatar"
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                />
            ),
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
        },
    ];
    const [dataCustomers, setDataCustomers] = useState<DataType[]>([]);
    const [selectedItemEdit, setSelectedItemEdit] = useState<{
        id?: number;
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        phoneNumber: string;
        birthDate: Date;
        gender: boolean;
        customerImage: string;
        customerImageFile: File | null;
        isDeleted: boolean;
    } | null>(null);
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
    const handleFetchData = () => {
        axios
            .get(`${BASE_URL}?isDeleted=${isDeletedFetchData}`)
            .then((response) => {
                const Api_Data_Customers = response.data;
                const newData: DataType[] = Api_Data_Customers.map(
                    (item: {
                        id: number;
                        firstName: any;
                        lastName: any;
                        email: string;
                        phoneNumber: string;
                        gender: boolean;
                        password: string;
                        birthDate: Date;
                        customerImage: string;
                        customerImageFile: File | null;
                        isDeleted: boolean;
                    }) => ({
                        id: item.id,
                        firstName: item.firstName,
                        lastName: item.lastName,
                        email: item.email,
                        phoneNumber: item.phoneNumber,
                        gender: item.gender,
                        password: item.password,
                        birthDate: item.birthDate,
                        customerImage: item.customerImage,
                        customerImageFile: item.customerImageFile,
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
                setDataCustomers(newData);
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
            setIsValueCustomerImageFile(file);
        }
    };
    //Xử lý Call API Create
    const handleCreateCustomers = () => {
        const formData = new FormData();
        formData.append("firstName", isValueFirstName);
        formData.append("lastName", isValueLastName);
        formData.append("email", isValueEmail);
        formData.append("password", isValuePassword);
        formData.append("phoneNumber", isValuePhoneNumber);
        formData.append("birthDate", isValueBirthDate);
        formData.append("gender", isValueGender);
        if (isValueCustomerImageFile !== null) {
            formData.append("customerImageFile", isValueCustomerImageFile);
        }
        formData.append("isDeleted", 'false');
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
        setIsValueCustomerImageFile(null);
    }
    const handleUpdateCustomers = () => {
        if (!selectedItemEdit) {
            return;
        }
        const formData = new FormData();
        formData.append("firstName", selectedItemEdit.firstName || '');
        formData.append("lastName", selectedItemEdit.lastName || '');
        formData.append("email", selectedItemEdit.email || '');
        formData.append("password", selectedItemEdit.password || '');
        formData.append("phoneNumber", selectedItemEdit.phoneNumber || '');
        if (selectedItemEdit.birthDate instanceof Date) {
            formData.append("birthDate", selectedItemEdit.birthDate.toISOString().split('T')[0]);
        }
        formData.append("gender", selectedItemEdit.gender ? 'true' : 'false');
        if (isValueCustomerImageFile !== null) {
            formData.append("customerImageFile", isValueCustomerImageFile);
            formData.append("customerImage", selectedItemEdit.customerImage || '');
        }

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
    const handleSubmitEditCustomers = () => {
        handleUpdateCustomers();
        setOpenModalEdit(false);
    };
    const handleEdit = (item: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        phoneNumber: string;
        birthDate: Date;
        gender: boolean;
        customerImage: string;
        customerImageFile: File | null;
        isDeleted: boolean;
    }) => {
        const formattedItem = {
            ...item,
            birthDate: item.birthDate ? new Date(item.birthDate) : new Date(),
        };
        setSelectedItemEdit(formattedItem);
        setOpenModalEdit(true);
        console.log('Selected item for editing:', item);
    };
    const handleClickEditSuccess = () => {
        Notification('success', 'Thông báo', 'Cập nhật thành công Khách Hàng');
    };
    const [openModal, setOpenModal] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [isValueFirstName, setIsValueFirstName] = useState('');
    const [isValueLastName, setIsValueLastName] = useState('');
    const [isValueEmail, setIsValueEmail] = useState('');
    const [isValuePassword, setIsValuePassword] = useState('');
    const [isValuePhoneNumber, setIsValuePhoneNumber] = useState('');
    const [isValueBirthDate, setIsValueBirthDate] = useState('');
    const [isValueGender, setIsValueGender] = useState('');
    const [isValueCustomerImageFile, setIsValueCustomerImageFile] = useState<File | null>(null);
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
        Notification('success', 'Thông báo', 'Tạo Khách Hàng thành công');
    };
    const handleDelete = (item: { id: number }) => {
        setDeleteModalVisible(true);
        setSelectedItemDelete(item);
    };
    const handleSubmitDelete = () => {
        handleDeleteCustomer();
        setDeleteModalVisible(false);
    };
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedItemDetele, setSelectedItemDelete] = useState<{ id?: number } | null>(null);
    const handleClickDeleteSuccess = () => {
        Notification('success', 'Thông báo', 'Xóa thành công Khách Hàng');
    };
    //Xử lý Call API Delete
    const handleDeleteCustomer = () => {
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
        handleRestoreCustomer();
        setRestoreModalVisible(false);
    };
    const [restoreModalVisible, setRestoreModalVisible] = useState(false);
    const [selectedItemRestore, setSelectedItemRestore] = useState<{ id?: number } | null>(null);
    const handleClickRestoreSuccess = () => {
        Notification('success', 'Thông báo', 'Khôi phục thành công');
    };
    //Xử lý Call API Restore
    const handleRestoreCustomer = () => {
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
                        {isDeletedFetchData ? 'Xem Khách Hàng' : 'Xem Khách Hàng Đã Xóa'}
                    </Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={dataCustomers}
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
            {/* Modal thêm Khách Hàng */}
            <>
                <Modal
                    className="custom-modal-create_and_edit_customers"
                    open={openModal}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <div className="p-5">
                        <span className="text-lg font-medium">Thêm Khách Hàng</span>
                        <div className="mt-10">
                            <label htmlFor="">Họ</label>
                            <Input
                                onChange={(event) => { setIsValueFirstName(event.target.value) }}
                                value={isValueFirstName}
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Tên</label>
                            <Input
                                onChange={(event) => { setIsValueLastName(event.target.value) }}
                                value={isValueLastName}
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Email</label>
                            <Input
                                onChange={(event) => { setIsValueEmail(event.target.value) }}
                                value={isValueEmail}
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Mật Khẩu</label>
                            <Input
                                onChange={(event) => { setIsValuePassword(event.target.value) }}
                                value={isValuePassword}
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Số Điện Thoại</label>
                            <Input
                                onChange={(event) => { setIsValuePhoneNumber(event.target.value) }}
                                value={isValuePhoneNumber}
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="birthDate">Ngày Sinh</label>
                            <Input
                                type="date"
                                onChange={(event) => {
                                    setIsValueBirthDate(event.target.value);
                                }}
                                value={isValueBirthDate}
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="gender">Giới Tính</label>
                            <select
                                onChange={(event) => setIsValueGender(event.target.value)}
                                value={isValueGender}
                                className="bg-slate-200"
                            >
                                <option value="">Chọn Giới Tính</option>
                                <option value="true">Nam</option>
                                <option value="false">Nữ</option>
                            </select>
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Hình Ảnh</label>
                            <input
                                type="file"
                                onChange={(event) => handleFileChange(event)}
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="flex justify-end items-end">
                            <Button onClick={handleCreateCustomers} className="bg-green-400 px-3 py-2 rounded-lg hover:bg-green-600 hover:text-white">
                                Lưu
                            </Button>
                        </div>
                    </div>
                </Modal>
            </>
            {/* Modal sửa Khách Hàng */}
            <>
                <Modal
                    className="custom-modal-create_and_edit_customers"
                    open={openModalEdit}
                    onCancel={handleCancelEdit}
                    footer={null}
                >
                    <div className="p-5">
                        <span className="text-lg font-medium">Sửa Khách Hàng</span>
                        <div className="mt-10">
                            <label htmlFor="firstName">Họ</label>
                            <Input
                                onChange={(event) => {
                                    setSelectedItemEdit((prev) =>
                                        prev === null ? prev : { ...prev, firstName: event.target.value }
                                    );
                                }}
                                value={selectedItemEdit?.firstName || ''}
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="firstName">Tên</label>
                            <Input
                                onChange={(event) => {
                                    setSelectedItemEdit((prev) =>
                                        prev === null ? prev : { ...prev, lastName: event.target.value }
                                    );
                                }}
                                value={selectedItemEdit?.lastName || ''}
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Email</label>
                            <Input
                                onChange={(event) => {
                                    setSelectedItemEdit((prev) =>
                                        prev === null ? prev : { ...prev, email: event.target.value }
                                    );
                                }}
                                value={selectedItemEdit?.email}
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Mật Khẩu</label>
                            <Input
                                onChange={(event) => {
                                    setSelectedItemEdit((prev) =>
                                        prev === null ? prev : { ...prev, password: event.target.value }
                                    );
                                }}
                                value={selectedItemEdit?.password}
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Số Điện Thoại</label>
                            <Input
                                onChange={(event) => {
                                    setSelectedItemEdit((prev) =>
                                        prev === null ? prev : { ...prev, phoneNumber: event.target.value }
                                    );
                                }}
                                value={selectedItemEdit?.phoneNumber || ''}
                                readOnly={false}
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="birthDate">Ngày Sinh</label>
                            <Input
                                type="date"
                                onChange={(event) => {
                                    const selectedDate = new Date(event.target.value);
                                    setSelectedItemEdit((prev) =>
                                        prev === null ? prev : { ...prev, birthDate: selectedDate }
                                    );
                                }}
                                value={
                                    selectedItemEdit?.birthDate instanceof Date
                                        ? selectedItemEdit?.birthDate.toISOString().split('T')[0]
                                        : ''
                                }
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="gender">Giới Tính</label>
                            <select
                                onChange={(event) => {
                                    const isMale = event.target.value === "true";
                                    setSelectedItemEdit((prev) =>
                                        prev === null ? prev : { ...prev, gender: isMale }
                                    );
                                }}
                                value={selectedItemEdit?.gender ? "true" : "false"}
                                className="bg-slate-200"
                            >
                                <option value="">Chọn Giới Tính</option>
                                <option value="true">Nam</option>
                                <option value="false">Nữ</option>
                            </select>
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Hình Ảnh</label>
                            <input
                                type="file"
                                onChange={(event) => handleFileChange(event)}
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="flex justify-end items-end">
                            <Button onClick={handleSubmitEditCustomers} className="bg-green-400 px-3 py-2 rounded-lg hover:bg-green-600 hover:text-white">
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

export default AppCustomers;
