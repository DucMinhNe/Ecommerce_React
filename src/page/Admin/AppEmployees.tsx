import { Button, Modal, Input, Table } from 'antd';
import { EditOutlined, DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import React, { ChangeEvent, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import SystemConst from '../../common/consts/system_const';
interface DataType {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    birthDate: Date | null;
    gender: boolean | null;
    employeeImage: string | null;
    employeeImageFile: File | null;
    address: string;
    hireDate: Date | null;
    jobTitleId: number;
    salary: number | null;
    isDeleted: boolean | null;
    action: React.ReactNode;
}
interface JobTitle {
    id: number;
    jobTitleName: string;
}
const BASE_URL = `${SystemConst.DOMAIN}/Employees`;
const BASE_URL_JobTitles = `${SystemConst.DOMAIN}/JobTitles`;
const AppEmployees = () => {
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
            render: (text, record) => {
                return record.gender ? 'Nam' : 'Nữ';
            },
            align: 'center',
        },
        {
            title: 'Hình Ảnh',
            dataIndex: 'employeeImage',
            align: 'center',
            render: (employeeImage: string) => (
                <img
                    src={`${SystemConst.DOMAIN_HOST}/${employeeImage}`}
                    alt="Employee Avatar"
                    style={{ width: '50px', height: '50px', objectFit: 'cover', }}
                />
            ),
        },
        {
            title: 'Địa Chỉ',
            dataIndex: 'address',
            align: 'center',
        },
        {
            title: 'Ngày Vào Làm',
            dataIndex: 'hireDate',
            align: 'center',
        },
        // {
        //     title: 'Chức Vụ',
        //     dataIndex: 'jobTitleId',
        // },
        {
            title: 'Chức Vụ',
            dataIndex: 'jobTitle',
            align: 'center',
        },
        {
            title: 'Lương',
            dataIndex: 'salary',
            align: 'center',
        },
        {
            title: '',
            dataIndex: 'action',
            align: 'center',
            width: 100,
        },
    ];
    const [dataEmployees, setDataEmployees] = useState<DataType[]>([]);
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
    const fetchJobTitles = async () => {
        try {
            const response = await axios.get(`${BASE_URL_JobTitles}`);
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
                const Api_Data_Employees = response.data;
                try {
                    const jobTitles = await fetchJobTitles();
                    const newData: DataType[] = Api_Data_Employees.map(
                        (item: DataType) => ({
                            id: item.id,
                            firstName: item.firstName,
                            lastName: item.lastName,
                            email: item.email,
                            phoneNumber: item.phoneNumber,
                            gender: item.gender,
                            password: item.password,
                            birthDate: item.birthDate,
                            employeeImage: item.employeeImage,
                            employeeImageFile: item.employeeImageFile,
                            address: item.address,
                            hireDate: item.hireDate,
                            jobTitleId: item.jobTitleId,
                            jobTitle: (jobTitles.find((jobTitle: { id: number; }) => jobTitle.id === item.jobTitleId) || {}).jobTitleName || 'N/A',
                            salary: item.salary,
                            isDeleted: item.isDeleted,
                            action: (
                                <>
                                    <div className="flex justify-center items-center gap-x-1">
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
                        })
                    );
                    setDataEmployees(newData);
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
            setIsValueEmployeeImageFile(file);
        }
    };
    //Xử lý Call API Create
    const handleCreateEmployees = () => {
        const formData = new FormData();
        formData.append("firstName", isValueFirstName);
        formData.append("lastName", isValueLastName);
        formData.append("email", isValueEmail);
        formData.append("password", isValuePassword);
        formData.append("phoneNumber", isValuePhoneNumber);
        formData.append("birthDate", isValueBirthDate);
        formData.append("gender", isValueGender);
        if (isValueEmployeeImageFile !== null) {
            formData.append("employeeImageFile", isValueEmployeeImageFile);
        }
        formData.append("address", isValueAddress);
        formData.append("hireDate", isValueHireDate);
        formData.append("jobTitleId", isValueJobTitleId);
        formData.append("salary", isValueSalary);
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
        setIsValueEmployeeImageFile(null);
    }
    const handleUpdateEmployees = () => {
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
        if (isValueEmployeeImageFile !== null) {
            formData.append("employeeImageFile", isValueEmployeeImageFile);
            formData.append("employeeImage", selectedItemEdit.employeeImage || '');
        }
        formData.append("address", selectedItemEdit.address || '');
        if (selectedItemEdit.hireDate instanceof Date) {
            formData.append("hireDate", selectedItemEdit.hireDate.toISOString().split('T')[0]);
        }
        formData.append("jobTitleId", String(selectedItemEdit.jobTitleId || ''));
        formData.append("salary", String(selectedItemEdit.salary || ''));
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
        handleUpdateEmployees();
        setOpenModalEdit(false);
    };
    const handleEdit = (item: DataType) => {
        const formattedItem = {
            ...item,
            birthDate: item.birthDate ? new Date(item.birthDate) : new Date(),
            hireDate: item.hireDate ? new Date(item.hireDate) : new Date(),
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
    const [isValueEmployeeImageFile, setIsValueEmployeeImageFile] = useState<File | null>(null);
    const [isValueAddress, setIsValueAddress] = useState('');
    const [isValueHireDate, setIsValueHireDate] = useState('');
    const [isValueJobTitleId, setIsValueJobTitleId] = useState('');
    const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
    const [isValueSalary, setIsValueSalary] = useState('');
    // Fetch jobTitles on component mount
    useEffect(() => {
        const fetchJobTitlesAndSetState = async () => {
            try {
                const jobTitlesData = await fetchJobTitles();
                setJobTitles(jobTitlesData || []); // Ensure jobTitlesData is an array, or set it to an empty array if it's falsy
            } catch (error) {
                console.error('Error fetching job titles:', error);
            }
        };

        fetchJobTitlesAndSetState();
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
                        className="custom-buttonemployees">
                        {isDeletedFetchData ? 'Xem Chức Vụ' : 'Xem Chức Vụ Đã Xóa'}
                    </Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={dataEmployees}
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
                    className="custom-modal-create_and_edit_employees"
                    open={openModal}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <div className="p-5">
                        <span className="text-lg font-medium">Thêm Nhân Viên</span>
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
                            <label htmlFor="birthDate">Ngày Sinh</label>
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
                        <div className="mt-10">
                            <label htmlFor="">Địa Chỉ</label>
                            <Input
                                onChange={(event) => { setIsValueAddress(event.target.value) }}
                                value={isValueAddress}
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="hireDate">Ngày Vào Làm</label>
                            <Input
                                type="date"
                                onChange={(event) => {
                                    setIsValueHireDate(event.target.value);
                                }}
                                value={isValueHireDate}
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="jobTitle">Chức Vụ</label>
                            <select
                                id="jobTitle"
                                onChange={(event) => { setIsValueJobTitleId(event.target.value) }}
                                value={isValueJobTitleId}
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}
                            >
                                <option value="">-- Chọn Chức Vụ --</option>
                                {jobTitles.map((jobTitle) => (
                                    <option key={jobTitle.id} value={jobTitle.id}>
                                        {jobTitle.jobTitleName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Lương</label>
                            <Input
                                onChange={(event) => { setIsValueSalary(event.target.value) }}
                                value={isValueSalary}
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}
                            />
                        </div>
                        <div className="flex justify-end items-end">
                            <Button onClick={handleCreateEmployees} style={{ backgroundColor: 'black', borderColor: 'black', color: '#fff', marginTop: 8 }} >
                                Lưu
                            </Button>
                        </div>
                    </div>
                </Modal>
            </>
            {/* Modal sửa Nhân Viên */}
            <>
                <Modal
                    className="custom-modal-create_and_edit_employees"
                    open={openModalEdit}
                    onCancel={handleCancelEdit}
                    footer={null}
                >
                    <div className="p-5">
                        <span className="text-lg font-medium">Sửa Nhân Viên</span>
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
                        <div className="mt-10">
                            <label htmlFor="">Địa Chỉ</label>
                            <Input
                                onChange={(event) => {
                                    setSelectedItemEdit((prev) =>
                                        prev === null ? prev : { ...prev, address: event.target.value }
                                    );
                                }}
                                value={selectedItemEdit?.address}
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="hireDate">Ngày Vào Làm</label>
                            <Input
                                type="date"
                                onChange={(event) => {
                                    const selectedHireDate = new Date(event.target.value);
                                    setSelectedItemEdit((prev) =>
                                        prev === null ? prev : { ...prev, hireDate: selectedHireDate }
                                    );
                                }}
                                value={
                                    selectedItemEdit?.hireDate instanceof Date
                                        ? selectedItemEdit?.hireDate.toISOString().split('T')[0]
                                        : ''
                                }
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="jobTitleId">Chức Vụ</label>
                            <select
                                id="jobTitleId"
                                onChange={(event) => {
                                    const selectedJobTitleId = Number(event.target.value);
                                    setSelectedItemEdit((prev) =>
                                        prev === null ? prev : { ...prev, jobTitleId: selectedJobTitleId }
                                    );
                                }}
                                value={selectedItemEdit?.jobTitleId ?? ''}
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}
                            >
                                <option value="" disabled>-- Chọn Chức Vụ --</option>
                                {jobTitles.map((jobTitle) => (
                                    <option key={jobTitle.id} value={jobTitle.id}>
                                        {jobTitle.jobTitleName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Lương</label>
                            <Input
                                onChange={(event) => {
                                    setSelectedItemEdit((prev) =>
                                        prev === null ? prev : { ...prev, salary: Number(event.target.value) }
                                    );
                                }}
                                value={selectedItemEdit?.salary ?? ''}
                                className="block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            // style={{ borderColor: 'black' }}
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

export default AppEmployees;
