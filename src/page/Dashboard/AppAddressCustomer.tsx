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
    customerId: number;
    addressCustomerName: string;
    city: string;
    district: string;
    subDistrict: string;
    phoneNumber: string;
    address: string;
    isDeleted: boolean | null;
    action: React.ReactNode;
}
interface Customer {
    id: number;
    firstName: string;
}
const BASE_URL = `${SystemConst.DOMAIN}/AddressCustomers`;
const BASE_URL_Customers = `${SystemConst.DOMAIN}/Customers`;
const AppAddressCustomers = () => {
    const columns: ColumnsType<DataType> = [
        {
            title: 'Khách Hàng',
            dataIndex: 'customer',
        },
        {
            title: 'Họ Tên',
            dataIndex: 'addressCustomerName',
        },
        {
            title: 'Thành Phố',
            dataIndex: 'city',
        },
        {
            title: 'Quận / Huyện',
            dataIndex: 'district',
        },
        {
            title: 'Phường Xả',
            dataIndex: 'subDistrict',
        },

        {
            title: 'Số Điện Thoại',
            dataIndex: 'phoneNumber',
        },
        {
            title: 'Địa Chỉ',
            dataIndex: 'address',
        },
        // {
        //     title: 'Khách Hàng',
        //     dataIndex: 'customerId',
        // },

        {
            title: 'Hành động',
            dataIndex: 'action',
        },
    ];
    const [dataAddressCustomers, setDataAddressCustomers] = useState<DataType[]>([]);
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
    const fetchCustomers = async () => {
        try {
            const response = await axios.get(`${BASE_URL_Customers}`);
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
                const Api_Data_AddressCustomers = response.data;
                try {
                    const customers = await fetchCustomers();
                    const newData: DataType[] = Api_Data_AddressCustomers.map(
                        (item: DataType) => ({
                            id: item.id,
                            customerId: item.customerId,
                            customer: (customers.find((customer: { id: number; }) => customer.id === item.customerId) || {}).firstName || 'N/A',
                            addressCustomerName: item.addressCustomerName,
                            city: item.city,
                            district: item.district,
                            subDistrict: item.subDistrict,
                            phoneNumber: item.phoneNumber,

                            address: item.address,

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
                    setDataAddressCustomers(newData);
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
    //Xử lý Call API Create
    const handleCreateAddressCustomers = () => {
        const formData = new FormData();
        formData.append("customerId", isValueCustomerId);
        formData.append("addressCustomerName", isValueAddressCustomerName);
        formData.append("city", isValueCity);
        formData.append("district", isValueDistrict);
        formData.append("subDistrict", isValueSubDistrict);
        formData.append("phoneNumber", isValuePhoneNumber);
        formData.append("address", isValueAddress);
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
    }
    const handleUpdateAddressCustomers = () => {
        if (!selectedItemEdit) {
            return;
        }
        const formData = new FormData();
        formData.append("customerId", String(selectedItemEdit.customerId || ''));
        formData.append("addressCustomerName", selectedItemEdit.addressCustomerName || '');
        formData.append("city", selectedItemEdit.city || '');
        formData.append("district", selectedItemEdit.district || '');
        formData.append("subDistrict", selectedItemEdit.subDistrict || '');

        formData.append("phoneNumber", selectedItemEdit.phoneNumber || '');
        formData.append("address", selectedItemEdit.address || '');
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
    const handleSubmitEditAddressCustomers = () => {
        handleUpdateAddressCustomers();
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
        Notification('success', 'Thông báo', 'Cập nhật thành công Nhân Viên');
    };
    const [openModal, setOpenModal] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [isValueCustomerId, setIsValueCustomerId] = useState('');
    const [isValueAddressCustomerName, setIsValueAddressCustomerName] = useState('');
    const [isValueCity, setIsValueCity] = useState('');
    const [isValueDistrict, setIsValueDistrict] = useState('');
    const [isValueSubDistrict, setIsValueSubDistrict] = useState('');
    const [isValuePhoneNumber, setIsValuePhoneNumber] = useState('');
    const [isValueAddress, setIsValueAddress] = useState('');
    const [customers, setCustomers] = useState<Customer[]>([]);
    // Fetch Customers on component mount
    useEffect(() => {
        const fetchCustomersAndSetState = async () => {
            try {
                const customersData = await fetchCustomers();
                setCustomers(customersData || []); // Ensure customersData is an array, or set it to an empty array if it's falsy
            } catch (error) {
                console.error('Error fetching job titles:', error);
            }
        };

        fetchCustomersAndSetState();
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
        handleDeleteAddressCustomer();
        setDeleteModalVisible(false);
    };
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedItemDetele, setSelectedItemDelete] = useState<{ id?: number } | null>(null);
    const handleClickDeleteSuccess = () => {
        Notification('success', 'Thông báo', 'Xóa thành công Nhân Viên');
    };
    //Xử lý Call API Delete
    const handleDeleteAddressCustomer = () => {
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
        handleRestoreAddressCustomer();
        setRestoreModalVisible(false);
    };
    const [restoreModalVisible, setRestoreModalVisible] = useState(false);
    const [selectedItemRestore, setSelectedItemRestore] = useState<{ id?: number } | null>(null);
    const handleClickRestoreSuccess = () => {
        Notification('success', 'Thông báo', 'Khôi phục thành công');
    };
    //Xử lý Call API Restore
    const handleRestoreAddressCustomer = () => {
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
                    dataSource={dataAddressCustomers}
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
                    className="custom-modal-create_and_edit_addresscustomers"
                    open={openModal}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <div className="p-5">
                        <span className="text-lg font-medium">Thêm Nhân Viên</span>
                        <div className="mt-10">
                            <label htmlFor="customer">Khách Hàng</label>
                            <select
                                id="customer"
                                onChange={(event) => { setIsValueCustomerId(event.target.value) }}
                                value={isValueCustomerId}
                                className="bg-slate-200"
                            >
                                <option value="">-- Chọn Khách Hàng --</option>
                                {customers.map((customer) => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.firstName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Họ Tên</label>
                            <Input
                                onChange={(event) => { setIsValueAddressCustomerName(event.target.value) }}
                                value={isValueAddressCustomerName}
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Thành Phố</label>
                            <Input
                                onChange={(event) => { setIsValueCity(event.target.value) }}
                                value={isValueCity}
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Quận / Huyện</label>
                            <Input
                                onChange={(event) => { setIsValueDistrict(event.target.value) }}
                                value={isValueDistrict}
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Phường Xả</label>
                            <Input
                                onChange={(event) => { setIsValueSubDistrict(event.target.value) }}
                                value={isValueSubDistrict}
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
                            <label htmlFor="">Địa Chỉ</label>
                            <Input
                                onChange={(event) => { setIsValueAddress(event.target.value) }}
                                value={isValueAddress}
                                className="bg-slate-200"
                            />
                        </div>

                        <div className="flex justify-end items-end">
                            <Button onClick={handleCreateAddressCustomers} className="bg-green-400 px-3 py-2 rounded-lg hover:bg-green-600 hover:text-white">
                                Lưu
                            </Button>
                        </div>
                    </div>
                </Modal>
            </>
            {/* Modal sửa Nhân Viên */}
            <>
                <Modal
                    className="custom-modal-create_and_edit_addresscustomers"
                    open={openModalEdit}
                    onCancel={handleCancelEdit}
                    footer={null}
                >
                    <div className="p-5">
                        <span className="text-lg font-medium">Sửa Nhân Viên</span>
                        <div className="mt-10">
                            <label htmlFor="customerId">Khách Hàng</label>
                            <select
                                id="customerId"
                                onChange={(event) => {
                                    const selectedCustomerId = Number(event.target.value);
                                    setSelectedItemEdit((prev) =>
                                        prev === null ? prev : { ...prev, customerId: selectedCustomerId }
                                    );
                                }}
                                value={selectedItemEdit?.customerId ?? ''}
                                className="bg-slate-200"
                            >
                                <option value="" disabled>-- Chọn Khách Hàng --</option>
                                {customers.map((customer) => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.firstName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Họ Tên</label>
                            <Input
                                onChange={(event) => {
                                    setSelectedItemEdit((prev) =>
                                        prev === null ? prev : { ...prev, addressCustomerName: event.target.value }
                                    );
                                }}
                                value={selectedItemEdit?.addressCustomerName}
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Thành Phố</label>
                            <Input
                                onChange={(event) => {
                                    setSelectedItemEdit((prev) =>
                                        prev === null ? prev : { ...prev, city: event.target.value }
                                    );
                                }}
                                value={selectedItemEdit?.city || ''}
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Quận / Huyền</label>
                            <Input
                                onChange={(event) => {
                                    setSelectedItemEdit((prev) =>
                                        prev === null ? prev : { ...prev, district: event.target.value }
                                    );
                                }}
                                value={selectedItemEdit?.district || ''}
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Phường Xả</label>
                            <Input
                                onChange={(event) => {
                                    setSelectedItemEdit((prev) =>
                                        prev === null ? prev : { ...prev, subDistrict: event.target.value }
                                    );
                                }}
                                value={selectedItemEdit?.subDistrict}
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

                        <div className="flex justify-end items-end">
                            <Button onClick={handleSubmitEditAddressCustomers} className="bg-green-400 px-3 py-2 rounded-lg hover:bg-green-600 hover:text-white">
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

export default AppAddressCustomers;
