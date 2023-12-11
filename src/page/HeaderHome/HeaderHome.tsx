import React, { useState } from 'react';
import { MenuOutlined } from '@ant-design/icons';
import iconUser from '../../img/iconUser.svg';
import { Button, Drawer, Dropdown, Space } from 'antd';
import './style.scss';

const HeaderHome: React.FC = () => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.reload(); // Tải lại trang web
        window.location.replace('/');
    };
    const items = [
        {
            label: <button onClick={handleLogout}>Đăng xuất</button>,
            key: 1,
        },
    ];
    return (
        <>
            <div className="bg-blue-400 shadow-md h-16 p-5 flex items-center justify-between">
                <div className="flex items-center">
                    <button className="hover:bg-gray-200 rounded-full h-9 w-9 flex items-center justify-center transition duration-150 ease-in-out ">
                        <MenuOutlined className="flex items-center" size={40} />{' '}
                    </button>
                </div>
                <div>
                    <Dropdown
                        className="w-24"
                        menu={{
                            items,
                        }}
                        trigger={['click']}
                        overlayClassName="w-[10rem] z-50 mt-2 bg-white border border-gray-200 rounded-md shadow-md text-center cursor-pointer"
                    >
                        <a
                            className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            onClick={(e) => e.preventDefault()}
                        >
                            <Space>
                                <img className="w-9 h-9" src={iconUser} alt="" />
                            </Space>
                        </a>
                    </Dropdown>
                </div>
            </div>
        </>
    );
};

export default HeaderHome;