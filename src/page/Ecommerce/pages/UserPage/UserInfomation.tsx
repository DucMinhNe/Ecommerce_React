import { Button, Input, Select } from 'antd';
import { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios';
import SystemConst from '../../../../common/consts/system_const';
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
}
const BASE_URL = `${SystemConst.DOMAIN}/Customers`;
const UserInfomation = () => {
    const cusId = localStorage.getItem('customerId');
    const [selectedItemEdit, setSelectedItemEdit] = useState<DataType | null>(null);
    useEffect(() => {
        handleFetchData();
    }, []);
    const handleFetchData = () => {
        axios
            .get(`${BASE_URL}/${cusId}`)
            .then((response) => {
                const apiDataCustomer = response.data;
                const newData: DataType = {
                    id: apiDataCustomer.id,
                    firstName: apiDataCustomer.firstName,
                    lastName: apiDataCustomer.lastName,
                    email: apiDataCustomer.email,
                    phoneNumber: apiDataCustomer.phoneNumber,
                    gender: apiDataCustomer.gender,
                    password: apiDataCustomer.password,
                    birthDate: apiDataCustomer.birthDate ? new Date(apiDataCustomer.birthDate) : new Date(),
                    customerImage: apiDataCustomer.customerImage,
                    customerImageFile: apiDataCustomer.customerImageFile,
                    isDeleted: apiDataCustomer.isDeleted,
                };
                console.log(newData);
                setSelectedItemEdit(newData);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setIsValueCustomerImageFile(file);
        }
    };
    //Xử lý Call API Create
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
        formData.append("isDeleted", 'false');
        axios
            .put(`${BASE_URL}/${cusId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                handleFetchData();
                handleClickEditSuccess();
                clearAllValue();
                console.log('Data', response);
            })
            .catch((error) => {
            });
    };
    const handleSubmitEdit = () => {
        handleUpdateCustomers();
    };
    const handleClickEditSuccess = () => {
        Swal.fire({
            icon: 'success',
            title: 'Cập nhật thành công',
            showConfirmButton: false,
            timer: 600,
        });
    };
    const [isValueCustomerImageFile, setIsValueCustomerImageFile] = useState<File | null>(null);
    return (
        <>
            {/* Modal sửa Khách Hàng */}
            <>
                <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
                    <div className="w-full p-6 m-auto bg-white rounded-md shadow-xl lg:max-w-xl">
                        <h1 className="text-3xl font-semibold text-center text-orange-700 uppercase">
                            Thông Tin Cá Nhân
                        </h1>
                        <div className="mt-10">
                            <label htmlFor="firstName" className="block text-sm font-semibold text-gray-800">Họ</label>
                            <Input
                                onChange={(event) => {
                                    setSelectedItemEdit((prev) =>
                                        prev === null ? prev : { ...prev, firstName: event.target.value }
                                    );
                                }}
                                value={selectedItemEdit?.firstName || ''}
                                className="block w-full px-4 py-2 mt-2 text-orange-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
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
                                className="block w-full px-4 py-2 mt-2 text-orange-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Email</label>
                            <Input
                                // onChange={(event) => {
                                //     setSelectedItemEdit((prev) =>
                                //         prev === null ? prev : { ...prev, email: event.target.value }
                                //     );
                                // }}
                                disabled
                                value={selectedItemEdit?.email}
                                className="block w-full px-4 py-2 mt-2 text-orange-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
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
                                className="block w-full px-4 py-2 mt-2 text-orange-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
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
                                className="block w-full px-4 py-2 mt-2 text-orange-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
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
                                className="block w-full px-4 py-2 mt-2 text-orange-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
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
                                className="block w-full px-4 py-2 mt-2 text-orange-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            >
                                <option value="">Chọn Giới Tính</option>
                                <option value="true">Nam</option>
                                <option value="false">Nữ</option>
                            </select>
                        </div>
                        <div className="mt-10">
                            <label htmlFor="formFile" className='mb-2 inline-block'>Hình Ảnh</label>
                            <input
                                type="file"
                                onChange={(event) => handleFileChange(event)}
                                className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                                id="formFile"
                            />
                        </div>
                        <div className="flex justify-end items-end">
                            <Button onClick={handleSubmitEdit} style={{ backgroundColor: '#ce4c1b', borderColor: '#1890ff', color: '#fff', marginTop: 8 }}  >
                                Lưu
                            </Button>
                        </div>
                    </div>
                </div>
            </>
        </>
    );
};

export default UserInfomation;
