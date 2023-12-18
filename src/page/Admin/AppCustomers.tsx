import { Button, Modal, Input } from 'antd';
import { EditOutlined, DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import Table, { ColumnsType } from 'antd/es/table';
import React, { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios';
import SystemConst from '../../common/consts/system_const';
import Swal from 'sweetalert2';
interface DataType {
    id: number;
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
            title: 'ID',
            dataIndex: 'id',
            sorter: (a, b) => a.id - b.id,
            sortDirections: ['ascend', 'descend'],
            align: 'center',
            width: 100,
        },
        {
            title: 'Họ',
            dataIndex: 'firstName',
            align: 'center',
        },
        {
            title: 'Tên',
            dataIndex: 'lastName',
            align: 'center',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            align: 'center',
        },
        {
            title: 'Mật Khẩu',
            dataIndex: 'password',
            align: 'center',
        },
        {
            title: 'Số Điện Thoại',
            dataIndex: 'phoneNumber',
            align: 'center',
        },
        {
            title: 'Ngày Sinh',
            dataIndex: 'birthDate',
            align: 'center',
        },
        {
            title: 'Giới Tính',
            dataIndex: 'gender',
            align: 'center',
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
            align: 'center',
        },
        {
            title: '',
            dataIndex: 'action',
            align: 'center',
            width: 100,
        },
    ];
    const [dataCustomers, setDataCustomers] = useState<DataType[]>([]);
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
    const handleFetchData = () => {
        axios
            .get(`${BASE_URL}?isDeleted=${isDeletedFetchData}`)
            .then((response) => {
                const Api_Data_Customers = response.data;
                const newData: DataType[] = Api_Data_Customers.map(
                    (item: DataType) => ({
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
                setDataCustomers(newData);
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
            formData.append("customerImage", selectedItemEdit.customerImage || '');
            formData.append("customerImageFile", isValueCustomerImageFile);
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
    const handleSubmitEdit = () => {
        handleUpdateCustomers();
        setOpenModalEdit(false);
    };
    const handleEdit = (item: DataType) => {
        const formattedItem = {
            ...item,
            birthDate: item.birthDate ? new Date(item.birthDate) : new Date(),
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
        Swal.fire({
            icon: 'success',
            title: 'Tạo Khách Hàng thành công',
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
                    title: 'Xóa thành công Khách Hàng',
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
                        className="custom-buttoncustomers">
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
                        showQuickJumper: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    }}
                    rowKey={(record) => record.id}
                    scroll={{ x: 'max-content' }}
                    size="middle"
                    bordered
                />
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
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}

                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Tên</label>
                            <Input
                                onChange={(event) => { setIsValueLastName(event.target.value) }}
                                value={isValueLastName}
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}

                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Email</label>
                            <Input
                                onChange={(event) => { setIsValueEmail(event.target.value) }}
                                value={isValueEmail}
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}

                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Mật Khẩu</label>
                            <Input
                                onChange={(event) => { setIsValuePassword(event.target.value) }}
                                value={isValuePassword}
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}

                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Số Điện Thoại</label>
                            <Input
                                onChange={(event) => { setIsValuePhoneNumber(event.target.value) }}
                                value={isValuePhoneNumber}
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}

                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="birthDate" style={{ borderColor: 'black' }}>Ngày Sinh</label>
                            <Input
                                type="date"
                                onChange={(event) => {
                                    setIsValueBirthDate(event.target.value);
                                }}
                                value={isValueBirthDate}
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="gender">Giới Tính</label>
                            <select
                                onChange={(event) => setIsValueGender(event.target.value)}
                                value={isValueGender}
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}
                            >
                                <option value="">Chọn Giới Tính</option>
                                <option value="true">Nam</option>
                                <option value="false">Nữ</option>
                            </select>
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
                        <div className="flex justify-end items-end">
                            <Button onClick={handleCreateCustomers} style={{ backgroundColor: 'black', borderColor: 'black', color: '#fff', marginTop: 8 }} >
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
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}
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
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}
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
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}
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
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}
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
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}
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
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}
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
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}
                            >
                                <option value="">Chọn Giới Tính</option>
                                <option value="true">Nam</option>
                                <option value="false">Nữ</option>
                            </select>
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

export default AppCustomers;
