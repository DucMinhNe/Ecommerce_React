import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import systemConst from '../../../../common/consts/system_const';
import Swal from "sweetalert2";
const SignUp: React.FC = () => {
    const BASE_URL = `${systemConst.DOMAIN}`;
    const firstName = useRef<HTMLInputElement>(null);
    const lastName = useRef<HTMLInputElement>(null);
    const email = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);
    const phoneNumber = useRef<HTMLInputElement>(null);
    const birthDate = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();
    const handleRouteCustomer = () => {
        setTimeout(() => {
            navigate('/ecommerce/signin', { replace: true });
        }, 0);
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const customerFirstName = firstName.current?.value;
        const customerLastName = lastName.current?.value;
        const customerEmail = email.current?.value;
        const customerPassword = password.current?.value;
        const customerPhoneNumber = phoneNumber.current?.value;
        const customerBirthDate = birthDate.current?.value;
        const genderSelect = document.getElementById('gender') as HTMLSelectElement | null;
        var customerGender = true;

        if (genderSelect && genderSelect.value === "0") {
            customerGender = false;
        }
        if (!customerEmail || !customerPassword) {
            Swal.fire({
                icon: 'success',
                title: 'Chưa Nhập Đủ Thông Tin!',
                showConfirmButton: false,
                timer: 700,
            });
        }
        try {
            const response = await fetch(`${BASE_URL}/auth/customer/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: customerFirstName,
                    lastName: customerLastName,
                    email: customerEmail,
                    password: customerPassword,
                    phoneNumber: customerPhoneNumber,
                    birthDate: customerBirthDate,
                    gender: customerGender,
                }),
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Đăng ký thành công!',
                    showConfirmButton: false,
                    timer: 700,
                });
                handleRouteCustomer();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Đăng ký  thất bại!',
                    showConfirmButton: false,
                    timer: 700,
                });
            }
        } catch (error) {
            console.error('Error during signup:', error);
        }
    };
    return (
        <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
            <div className="w-full p-6 m-auto bg-white rounded-md shadow-xl lg:max-w-xl">
                <h1 className="text-3xl font-semibold text-center text-orange-700 uppercase">
                    Đăng Ký
                </h1>
                <form className="mt-6" onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <label
                            htmlFor="firstName"
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Họ
                        </label>
                        <input
                            ref={firstName}
                            type="text"
                            className="block w-full px-4 py-2 mt-2 text-orange-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>
                    <div className="mb-2">
                        <label
                            htmlFor="lastName"
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Tên
                        </label>
                        <input
                            ref={lastName}
                            type="text"
                            className="block w-full px-4 py-2 mt-2 text-orange-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>
                    <div className="mb-2">
                        <label

                            htmlFor="email"
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Email
                        </label>
                        <input
                            ref={email}
                            type="email"
                            className="block w-full px-4 py-2 mt-2 text-orange-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>
                    <div className="mb-2">
                        <label

                            htmlFor="password"
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Mật Khẩu
                        </label>
                        <input
                            ref={password}
                            type="password"
                            className="block w-full px-4 py-2 mt-2 text-orange-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>
                    <div className="mb-2">
                        <label
                            htmlFor="phoneNumber"
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Số Điện Thoại
                        </label>
                        <input
                            ref={phoneNumber}
                            type="text"
                            className="block w-full px-4 py-2 mt-2 text-orange-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>
                    <div className="mb-2">
                        <label
                            htmlFor="birthDate"
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Ngày Sinh
                        </label>
                        <input
                            ref={birthDate}
                            type="date"
                            className="block w-full px-4 py-2 mt-2 text-orange-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>
                    <div className="mb-2">
                        <label
                            htmlFor="gender"
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Giới Tính
                        </label>
                        <select
                            id="gender"
                            className="block w-full px-4 py-2 mt-2 text-orange-700 bg-white border rounded-md focus:border-orange-400 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        >
                            <option value="1">Nam</option>
                            <option value="0">Nữ</option>
                        </select>
                    </div>
                    <div className="mt-6">
                        <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-orange-700 rounded-md hover:bg-orange-600 focus:outline-none focus:bg-orange-600">
                            Đăng Ký
                        </button>
                    </div>
                </form>
                <p className="mt-8 text-xs font-light text-center text-gray-700">
                    {" "}
                    Đã có tài khoản?{" "}
                    <Link to={'/ecommerce/signin'}>
                        <a
                            href="#"
                            className="font-medium text-orange-600 hover:underline"
                        >
                            Đăng Nhập
                        </a>
                    </Link>
                </p>
            </div>
        </div>
    );
};
export default SignUp;


