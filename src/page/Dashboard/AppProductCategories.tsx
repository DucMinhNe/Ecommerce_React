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
    productCategoryName: string;
    action: React.ReactNode;
}
const BASE_URL = `${SystemConst.DOMAIN}/ProductCategories`;
const AppProductCategories = () => {
    const columns: ColumnsType<DataType> = [
        {
            title: 'Tên khoa',
            dataIndex: 'productCategoryName',
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
        },
    ];
    const [dataProductCategories, setDataProductCategories] = useState<DataType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedItemEdit, setSelectedItemEdit] = useState<{ id?: number; productCategoryName: string } | null>(null);
    const [selectedItemDetele, setSelectedItemDelete] = useState<{ id?: number } | null>(null);

    //Xử lý Call APU Get Data
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        handleFetchData();
    }, []);
    const handleFetchData = () => {
        axios
            .get(`${BASE_URL}`)
            .then((response) => {
                const Api_Data_ProductCategories = response.data;
                console.log('data: ', Api_Data_ProductCategories);
                const newData: DataType[] = Api_Data_ProductCategories.map(
                    (item: { id: number; productCategoryName: any; }) => ({
                        productCategoryName: item.productCategoryName,
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
                setDataProductCategories(newData);
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
    const handleCreateProductCategories = () => {
        const data = { productCategoryName: isValueProductCategories };

        console.log('Data: ', data);
        axios
            .post(`${BASE_URL}`, data)
            .then((response) => {
                handleFetchData();
                setIsValueProductCategories('');
                setOpenModal(false);
                handleClickSuccess();
                console.log('Data', response);
                // const data = response.data.respone_data;
            })
            .catch((error) => {
            });
    };
    //Xử lý Call API Update
    const handleUpdateProductCategories = () => {
        const data = {
            id: selectedItemEdit?.id,
            productCategoryName: selectedItemEdit?.productCategoryName,
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
                // Handle errors (you might want to log or display an error message)
                console.error('Error during update:', error);
            });
    };

    //Xử lý Call API Delete
    const handleDeleteProductCategories = () => {
        const dataDelete = selectedItemDetele?.id;

        axios
            .delete(`${BASE_URL}/${dataDelete}`)
            .then((response) => {
                handleFetchData();
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
    const handleSubmitCreateProductCategories = () => {
        if (isValueProductCategories.length === 0) {
            setErrorProductCategories(true);
        } else {
            handleCreateProductCategories();
        }
    };
    const handleSubmitEditProductCategories = () => {
        handleUpdateProductCategories();
        setOpenModalEdit(false);
    };
    const handleSubmitDeleteProductCategories = () => {
        handleDeleteProductCategories();
        setDeleteModalVisible(false);
    };

    //Khai báo các State quản lí trạng thái
    const [openModal, setOpenModal] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [isValueProductCategories, setIsValueProductCategories] = useState('');
    const [errorProductCategories, setErrorProductCategories] = useState(false);

    const handleChangeValueProductCategories = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedValue = e.target.value;
        setIsValueProductCategories(e.target.value);
        if (selectedValue !== '') {
            setErrorProductCategories(false);
        }
    };

    const handleEdit = (item: { id: number; productCategoryName: string }) => {
        setOpenModalEdit(true);
        setSelectedItemEdit(item);
    };

    const handleChangeEdit = (e: { target: { value: any } }) => {
        setSelectedItemEdit({ ...selectedItemEdit, productCategoryName: e.target.value || null });
    };
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
                    dataSource={dataProductCategories}
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
                    className="custom-modal-create_and_edit_productCategorys"
                    open={openModal}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <div className="p-5">
                        <span className="text-lg font-medium">Thêm khoa</span>
                        <div className="mt-10">
                            <label htmlFor="">Tên khoa</label>
                            <Input
                                onChange={handleChangeValueProductCategories}
                                value={isValueProductCategories}
                                className="bg-slate-200"
                            />
                            {errorProductCategories && <p className="text-red-500">Vui lòng điền vào chỗ trống</p>}
                        </div>

                        <div className="flex justify-end items-end ">
                            <Button onClick={handleSubmitCreateProductCategories} type="primary" className="cstCreateProductCategories">
                                Lưu
                            </Button>
                        </div>
                    </div>
                </Modal>
            </>
            {/* Modal sửa khoa */}
            <>
                <Modal
                    className="custom-modal-create_and_edit_productCategorys"
                    open={openModalEdit}
                    onCancel={handleCancelEdit}
                    footer={null}
                >
                    <div className="p-5">
                        <span className="text-lg font-medium">Sửa khoa</span>
                        <div className="mt-10">
                            <label htmlFor="">Tên khoa</label>
                            <Input
                                onChange={(e) => handleChangeEdit({ target: e.target })}
                                value={selectedItemEdit?.productCategoryName}
                                className="bg-slate-200"
                            />
                        </div>

                        <div className="flex justify-end items-end">
                            <Button onClick={handleSubmitEditProductCategories} type="primary" className="cstCreateProductCategories">
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
                            <Button onClick={handleSubmitDeleteProductCategories} type="primary" className="mr-5">
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

export default AppProductCategories;
