import { Button, Modal, Input, Spin } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { MdPersonAdd } from 'react-icons/md';
import Notification from '../../components/Notification';
import axios from 'axios';
import SystemConst from '../../common/consts/system_const';
import HeaderToken from '../../common/utils/headerToken';
import UnauthorizedError from '../../common/exception/unauthorized_error';
import ErrorCommon from '../../common/Screens/ErrorCommon';
interface DataType {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    gender: boolean;
    password: string;
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
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
        },
        {
            title: 'Password',
            dataIndex: 'password',
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
        },
    ];
    const [dataCustomers, setDataCustomers] = useState<DataType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedItemEdit, setSelectedItemEdit] = useState<{ id?: number; firstName: string ; lastName: string ;email: string ;phoneNumber: string ;gender: boolean ;password: string } | null>(null);
    const [selectedItemDetele, setSelectedItemDelete] = useState<{ id?: number } | null>(null);

    //Xử lý Call APU Get Data
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
      
        handleFecthData();
    }, []);
    const handleFecthData = () => {
        axios
            .get(`${BASE_URL}`)
            .then((response) => {
                const Api_Data_Customers = response.data;
                console.log('data: ', Api_Data_Customers);
                const newData: DataType[] = Api_Data_Customers.map(
                    (item: { id: number; firstName: any; lastName: any;email: any;phoneNumber: any;gender: any;password: any;}) => ({
                        firstName: item.firstName,
                        lastName: item.lastName,
                        email: item.email,
                        phoneNumber: item.phoneNumber,
                        gender: item.gender,
                        password: item.password,
                        action: (
                            <>
                                <div className="flex gap-x-1">
                                    <button
                                        className="bg-green-400 px-3 py-2 rounded-lg hover:bg-green-600 hover:text-white"
                                        onClick={() => handleEdit(item)}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        className="bg-red-500 px-3 py-2 rounded-lg hover:bg-red-700 hover:text-white"
                                        onClick={() => handleDelete(item)}
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </>
                        ),
                    }),
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
    //Xử lý Call API Create
    const handleCreateCustomers = () => {
        const data = { 
            firstName: isValueFirstName ,
            lastName: isValueLastName ,
            email: isValueEmail ,
            phoneNumber: isValuePhoneNumber ,
            gender: isValueGender === "true" ? true : false,
            password: isValuePassword ,
        };
        console.log('Data: ', data);
        axios
            .post(`${BASE_URL}`, data)
            .then((response) => {
                handleFecthData();
                // setIsValueCustomers('');
                setOpenModal(false);
                handleClickSuccess();
                console.log('Data', response);
                // const data = response.data.respone_data;
            })
            .catch((error) => {
            });
    };
    //Xử lý Call API Update
    const handleUpdateCustomers = () => {
        const data = {
          id: selectedItemEdit?.id,
          firstName: selectedItemEdit?.firstName,
          lastName: selectedItemEdit?.lastName,
          email: selectedItemEdit?.email,
          phoneNumber: selectedItemEdit?.phoneNumber,
          gender: selectedItemEdit?.gender,
          password: selectedItemEdit?.password,
        };
      
        axios
          .put(`${BASE_URL}/${data.id}`, data, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .then((response) => {
            handleClickEditSuccess();
            handleFecthData();
          })
          .catch((error) => {
            // Handle errors (you might want to log or display an error message)
            console.error('Error during update:', error);
          });
      };
      
    //Xử lý Call API Delete
    const handleDeleteCustomers = () => {
        const dataDelete = selectedItemDetele?.id;
       
        axios
            .delete(`${BASE_URL}/${dataDelete}`)
            .then((response) => {
                handleFecthData();
                handleClickDeleteSuccess();
            })
            .catch((error) => {
                const isError = UnauthorizedError.checkError(error);
                if (!isError) {
                    const title = 'Lỗi';
                    let content = '';
                    const {
                        status,
                        data: { error_message: errorMessage },
                    } = error.response;
                    if (status === 400 && errorMessage === 'Required more information') {
                        content = 'Cần gửi đầy đủ thông tin';
                    } else if (status === 400 && errorMessage === 'Delete not success') {
                        content = 'Xóa khoa không thành công';
                    } else {
                        content = 'Lỗi máy chủ';
                    }
                    ErrorCommon(title, content);
                }
            });
    };
    const handleSubmitCreateCustomers = () => {
            handleCreateCustomers();
    };
    const handleSubmitEditCustomers = () => {
        handleUpdateCustomers();
        setOpenModalEdit(false);
    };
    const handleSubmitDeleteCustomers = () => {
        handleDeleteCustomers();
        setDeleteModalVisible(false);
    };

    //Khai báo các State quản lí trạng thái
    const [openModal, setOpenModal] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [isValueFirstName, setIsValueFirstName] = useState('');
    const [isValueLastName, setIsValueLastName] = useState('');
    const [isValueEmail, setIsValueEmail] = useState('');
    const [isValuePhoneNumber, setIsValuePhoneNumber] = useState('');
    const [isValueGender, setIsValueGender] = useState('');
    const [isValuePassword, setIsValuePassword] = useState('');
    const [errorCustomers, setErrorCustomers] = useState(false);

    const handleEdit = (item: { id: number; firstName: string ,lastName: string ,email: string ,phoneNumber: string ,gender: boolean ,password: string }) => {
        setOpenModalEdit(true);
        setSelectedItemEdit(item);
    };

    // const handleChangeEdit = (e: { target: { value: any } }) => {
    //     setSelectedItemEdit({ ...selectedItemEdit, firstName: e.target.value || null ;lastName: e.target.value || null ;});
    // };
    const handleDelete = (item: { id: number }) => {
        setDeleteModalVisible(true);
        setSelectedItemDelete(item);
    };

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
        Notification('success', 'Thông báo', 'Tạo Khoa thành công');
    };
    const handleClickEditSuccess = () => {
        Notification('success', 'Thông báo', 'Cập nhật thành công khoa');
    };
    const handleClickDeleteSuccess = () => {
        Notification('success', 'Thông báo', 'Xóa thành công khoa');
    };
    return (
        <>
            <div className="container mt-5 ">
                <div className="flex justify-end mb-5">
                    <Button type="primary" onClick={handleShowModal}>
                        <MdPersonAdd />
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
            {/* Modal thêm khoa */}
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
                            <label htmlFor="">Phone Number</label>
                            <Input
                              onChange={(event) => { setIsValuePhoneNumber(event.target.value) }}
                                value={isValuePhoneNumber}
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Gender</label>
                            <Input
                              onChange={(event) => { setIsValueGender(event.target.value) }}
                                value={isValueGender}
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Password</label>
                            <Input
                              onChange={(event) => { setIsValuePassword(event.target.value) }}
                                value={isValuePassword}
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="flex justify-end items-end ">
                            <Button onClick={handleSubmitCreateCustomers} type="primary" className="cstCreateCustomers">
                                Lưu
                            </Button>
                        </div>
                    </div>
                </Modal>
            </>
            {/* Modal sửa khoa */}
            <>
                <Modal
                    className="custom-modal-create_and_edit_customers"
                    open={openModalEdit}
                    onCancel={handleCancelEdit}
                    footer={null}
                >
                    <div className="p-5">
                        <span className="text-lg font-medium">Sửa khoa</span>
                        <div className="mt-10">
                            <label htmlFor="">Họ</label>
                            <Input
                                onChange={(event) => { setIsValueFirstName(event.target.value) }}
                                value={selectedItemEdit?.firstName}
                                className="bg-slate-200"
                                disabled={false}
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Tên</label>
                            <Input
                               onChange={(event) => { setIsValueLastName(event.target.value) }}
                                value={selectedItemEdit?.lastName}
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Email</label>
                            <Input
                             onChange={(event) => { setIsValueEmail(event.target.value) }}
                                value={selectedItemEdit?.email}
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Phone Number</label>
                            <Input
                                onChange={(event) => { setIsValuePhoneNumber(event.target.value) }}
                                value={selectedItemEdit?.phoneNumber}
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="mt-10">
                        <label htmlFor="gender">Gender</label>
                            <Input
                            onChange={(event) => { setIsValueGender(event.target.value) }}
                            value={selectedItemEdit?.gender ? 'true' : 'false'}
                            className="bg-slate-200"
                            />
                        </div>
                        <div className="mt-10">
                            <label htmlFor="">Password</label>
                            <Input
                               onChange={(event) => { setIsValuePassword(event.target.value) }}
                            value={selectedItemEdit?.password}
                                className="bg-slate-200"
                            />
                        </div>
                        <div className="flex justify-end items-end">
                            <Button onClick={handleSubmitEditCustomers} type="primary" className="cstCreateCustomers">
                                Lưu
                            </Button>
                        </div>
                    </div>
                </Modal>
            </>
            {/* Modal xóa khoa */}
            <>
                <div>
                    <Modal
                        className="custom-delete "
                        title="Xác nhận xóa"
                        visible={deleteModalVisible}
                        onCancel={() => setDeleteModalVisible(false)}
                        footer={null}
                    >
                        <div>
                            <p>Bạn có chắc chắn muốn xóa không?</p>
                        </div>
                        <div className="flex justify-end h-full mt-20">
                            <Button onClick={handleSubmitDeleteCustomers} type="primary" className="mr-5">
                                Xóa
                            </Button>
                            <Button onClick={() => setDeleteModalVisible(false)} type="default" className="mr-5">
                                Hủy
                            </Button>
                        </div>
                    </Modal>
                </div>
            </>
        </>
    );
};

export default AppCustomers;
