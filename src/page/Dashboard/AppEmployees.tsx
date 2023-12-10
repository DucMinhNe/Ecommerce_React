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
            dataIndex: 'employeeImage',
            render: (employeeImage: string) => (
                <img
                    src={`${SystemConst.DOMAIN_HOST}/${employeeImage}`}
                    alt="Employee Avatar"
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                />
            ),
        },
        {
            title: 'Địa Chỉ',
            dataIndex: 'address',
        },
        {
            title: 'Ngày Vào Làm',
            dataIndex: 'hireDate',
        },
        // {
        //     title: 'Chức Vụ',
        //     dataIndex: 'jobTitleId',
        // },
        {
            title: 'Chức Vụ',
            dataIndex: 'jobTitle',
        },
        {
            title: 'Lương',
            dataIndex: 'salary',
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
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
                    setDataEmployees(newData);
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
    const handleSubmitEditEmployees = () => {
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
        Notification('success', 'Thông báo', 'Cập nhật thành công Nhân Viên');
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
        Notification('success', 'Thông báo', 'Tạo Nhân Viên thành công');
    };
    const handleDelete = (item: { id: number }) => {
        setDeleteModalVisible(true);
        setSelectedItemDelete(item);
    };
    const handleSubmitDelete = () => {
        handleDeleteEmployee();
        setDeleteModalVisible(false);
    };
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedItemDetele, setSelectedItemDelete] = useState<{ id?: number } | null>(null);
    const handleClickDeleteSuccess = () => {
        Notification('success', 'Thông báo', 'Xóa thành công Nhân Viên');
    };
    //Xử lý Call API Delete
    const handleDeleteEmployee = () => {
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
        handleRestoreEmployee();
        setRestoreModalVisible(false);
    };
    const [restoreModalVisible, setRestoreModalVisible] = useState(false);
    const [selectedItemRestore, setSelectedItemRestore] = useState<{ id?: number } | null>(null);
    const handleClickRestoreSuccess = () => {
        Notification('success', 'Thông báo', 'Khôi phục thành công');
    };
    //Xử lý Call API Restore
    const handleRestoreEmployee = () => {
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
                        {isDeletedFetchData ? 'Xem Nhân Viên' : 'Xem Nhân Viên Đã Xóa'}
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
                    }}
                >
                    {/* <Spin spinning={isLoading} size="large"></Spin> */}
                </Table>
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
                        <div className="mt-10">
                            <label htmlFor="">Địa Chỉ</label>
                            <Input
                                onChange={(event) => { setIsValueAddress(event.target.value) }}
                                value={isValueAddress}
                                className="bg-slate-200"
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
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="jobTitle">Chức Vụ</label>
                            <select
                                id="jobTitle"
                                onChange={(event) => { setIsValueJobTitleId(event.target.value) }}
                                value={isValueJobTitleId}
                                className="bg-slate-200"
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
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="flex justify-end items-end">
                            <Button onClick={handleCreateEmployees} className="bg-green-400 px-3 py-2 rounded-lg hover:bg-green-600 hover:text-white">
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
                        <div className="mt-10">
                            <label htmlFor="">Địa Chỉ</label>
                            <Input
                                onChange={(event) => {
                                    setSelectedItemEdit((prev) =>
                                        prev === null ? prev : { ...prev, address: event.target.value }
                                    );
                                }}
                                value={selectedItemEdit?.address}
                                className="bg-slate-200"
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
                                className="bg-slate-200"
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
                                className="bg-slate-200"
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
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="flex justify-end items-end">
                            <Button onClick={handleSubmitEditEmployees} className="bg-green-400 px-3 py-2 rounded-lg hover:bg-green-600 hover:text-white">
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

export default AppEmployees;
