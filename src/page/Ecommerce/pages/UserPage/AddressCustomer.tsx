import { Button, Modal, Input, Select } from 'antd';
import { EditOutlined, DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import Table, { ColumnsType } from 'antd/es/table';
import React, { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios';
import SystemConst from '../../../../common/consts/system_const';
import Swal from 'sweetalert2';
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
const AddressCustomers = () => {
    const columns: ColumnsType<DataType> = [
        {
            title: 'ID',
            dataIndex: 'id',
            sorter: (a, b) => a.id - b.id,
            sortDirections: ['ascend', 'descend'],
            align: 'center',
            width: 100,
        },
        // {
        //     title: 'Khách Hàng',
        //     dataIndex: 'customer',
        //     align: 'center',
        // },
        {
            title: 'Họ Tên',
            dataIndex: 'addressCustomerName',
            align: 'center',
        },
        {
            title: 'Thành Phố',
            dataIndex: 'city',
            align: 'center',
        },
        {
            title: 'Quận / Huyện',
            dataIndex: 'district',
            align: 'center',
        },
        {
            title: 'Phường Xả',
            dataIndex: 'subDistrict',
            align: 'center',
        },
        {
            title: 'Số Điện Thoại',
            dataIndex: 'phoneNumber',
            align: 'center',
        },
        {
            title: 'Địa Chỉ',
            dataIndex: 'address',
            align: 'center',
        },
        // {
        //     title: 'Khách Hàng',
        //     dataIndex: 'customerId',
        // },
        {
            title: 'Hành động',
            dataIndex: 'action',
            align: 'center',
            width: 200,
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
        var cusId = localStorage.getItem('customerId');
        axios
            .get(`${BASE_URL}?customerId=${cusId}&isDeleted=${isDeletedFetchData}`)
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
                        })
                    );
                    setDataAddressCustomers(newData);
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
    //Xử lý Call API Create
    const handleCreateAddressCustomers = () => {
        const formData = new FormData();
        var cusId = localStorage.getItem('customerId');
        formData.append("customerId", String(cusId));
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
        var cusId = localStorage.getItem('customerId');
        formData.append("customerId", String(cusId));
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
        Swal.fire({
            icon: 'success',
            title: 'Cập nhật thành công',
            showConfirmButton: false,
            timer: 600,
        });
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
        Swal.fire({
            icon: 'success',
            title: 'Tạo thành công',
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
                    title: 'Xóa thành công',
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
                        {isDeletedFetchData ? 'Xem Địa Chỉ Khách Hàng' : 'Xem Địa Chỉ Khách Hàng Đã Xóa'}
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
                        showQuickJumper: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    }}
                    rowKey={(record) => record.id}
                    scroll={{ x: 'max-content' }}
                    size="middle"
                    bordered
                />
            </div>
            {/* Modal thêm Địa Chỉ Khách Hàng */}
            <>
                <Modal
                    className="custom-modal-create_and_edit_addresscustomers"
                    open={openModal}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <div className="p-5">
                        <span className="text-lg font-medium">Thêm</span>
                        {/* <div className="mt-10">
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
                        </div> */}
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
                            <Button onClick={handleCreateAddressCustomers} style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: '#fff', marginTop: 8 }} >
                                Lưu
                            </Button>
                        </div>
                    </div>
                </Modal>
            </>
            {/* Modal sửa Địa Chỉ Khách Hàng */}
            <>
                <Modal
                    className="custom-modal-create_and_edit_addresscustomers"
                    open={openModalEdit}
                    onCancel={handleCancelEdit}
                    footer={null}
                >
                    <div className="p-5">
                        <span className="text-lg font-medium">Sửa</span>
                        {/* <div className="mt-10">
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
                        </div> */}
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
                            <Button onClick={handleSubmitEditAddressCustomers} style={{ backgroundColor: '#1890ff', borderColor: '#1890ff', color: '#fff', marginTop: 8 }}  >
                                Lưu
                            </Button>
                        </div>
                    </div>
                </Modal>
            </>
        </>
    );
};

export default AddressCustomers;
