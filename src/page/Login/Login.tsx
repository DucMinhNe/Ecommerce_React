import React, { useEffect, useRef, useState } from 'react';
import bgLogin from '../../img/backgoundhoctap.jpg';
import { useNavigate } from 'react-router-dom';
import systemConst from '../../common/consts/system_const';
const Login: React.FC = () => {
    const BASE_URL = `${systemConst.DOMAIN}`;
    const email = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);
    const [message, setMessage] = useState<string>('');
    const navigate = useNavigate();
    const [isToken, setIsToken] = useState(Boolean(localStorage.getItem('token')));

    const handleRouteAdmin = () => {
        setTimeout(() => {
            navigate('/admin', { replace: true });
        }, 0);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        navigate('/admin');
        // const userEmail = email.current?.value;
        // const userPassword = password.current?.value;

        // if (!userEmail || !userPassword) {
        //     return setMessage('Vui lòng nhập đầy đủ thông tin tài khoản và mật khẩu.');
        // }
        // try {
        //     axios
        //         .post(`${BASE_URL}/login`, {
        //             email: userEmail,
        //             password: userPassword,
        //         })
        //         .then((response) => {
        //             if (response.status === 200) {
        //                 const { token, role, account_id, first_name, last_name } = response.data;
        //                 localStorage.setItem('token', token);
        //                 localStorage.setItem('role', role);
        //                 localStorage.setItem(
        //                     'user',
        //                     JSON.stringify({
        //                         account_id: account_id,
        //                         first_name: first_name,
        //                         last_name: last_name,
        //                     }),
        //                 );

        //                 setIsToken(token);

        //                 if (role === 1) {
        //                     setMessage('Đăng nhập thành công');
        //                     navigate('/giang-vien');
        //                 } else if (role === 0) {
        //                     setMessage('Đăng nhập thành công');
        //                     navigate('/sinh-vien');
        //                 } else if (role === 2) {
        //                     setMessage('Đăng nhập thành công');
        //                     navigate('/admin');
        //                 } else {
        //                     setMessage('Không hợp lệ');
        //                     console.log('Invalid');
        //                 }
        //                 return;
        //             } else {
        //                 alert('Đã xảy ra lỗi');
        //             }
        //         })
        //         .catch((error) => {
        //             if (axios.isAxiosError(error)) {
        //                 if (
        //                     error.response?.status === systemConst.STATUS_CODE.UNAUTHORIZED_REQUEST &&
        //                     error.response.data.error_message === 'No exist email'
        //                 ) {
        //                     setMessage('Tài khoản không tồn tại');
        //                 } else if (
        //                     error.response?.status === systemConst.STATUS_CODE.UNAUTHORIZED_REQUEST &&
        //                     error.response.data.error_message === 'Invalid password'
        //                 ) {
        //                     setMessage('Sai mật khẩu');
        //                 } else if (error.response?.status === systemConst.STATUS_CODE.BAD_REQUEST) {
        //                     setMessage('Cần Nhập tài khoản và mật khẩu');
        //                 } else {
        //                     setMessage('Không thể kết nối máy chủ');
        //                 }
        //             } else {
        //                 console.error(error);
        //             }
        //         });
        // } catch (error) {}
    };


    return (
        <>
            {!isToken && (
                <div className="bg-slate-100 h-screen">
                    <div className="bg-blue-300 h-16 items-center fixed w-full">
                    </div>
                    <div className="flex items-center justify-center h-full">
                        <div className="flex flex-col max-w-7xl xl:px-5 lg:flex-row">
                            <div className="flex flex-col items-center w-full lg:pt-1 2xl:pt-2 lg:flex-row">
                                <div className="w-full bg-cover max-w-md lg:max-w-6xl lg:px-2 lg:w-8/12 2xl:w-8/12">
                                    <div className="flex flex-col items-center justify-center w-full h-full relative lg:pr-5">
                                        <img className="rounded-xl" src={bgLogin} alt="" />
                                    </div>
                                </div>
                                <div className="w-full relative z-10 max-w-3xl lg:pr-1 lg:mt-0 lg:w-4/12 2xl:w-4/12 lg:pt-2">
                                    <form onSubmit={handleSubmit}>
                                        <div className="flex flex-col items-start justify-start py-10 px-10 bg-white shadow-2xl rounded-xl relative z-10">
                                            <p className="w-full text-4xl font-medium text-center leading-snug font-sans">
                                                Đăng nhập
                                            </p>
                                            <div className="w-full mt-6 mr-0 mb-0 ml-0 relative space-y-8">
                                                <div className="relative">
                                                    <p className="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">
                                                        Email
                                                    </p>
                                                    <input
                                                        ref={email}
                                                        placeholder="MSSV@caothang.edu.vn"
                                                        type="text"
                                                        className="border placeholder-gray-400 focus:outline-none focus:border-blue-600 w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white border-gray-300 rounded-md"
                                                    />
                                                </div>
                                                <div className="relative">
                                                    <p className="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">
                                                        Password
                                                    </p>
                                                    <input
                                                        ref={password}
                                                        placeholder="Password"
                                                        type="password"
                                                        className="border placeholder-gray-400 focus:outline-none focus:border-blue-600 w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white border-gray-300 rounded-md"
                                                    />
                                                </div>
                                                <div className="relative">
                                                    <button className="w-full inline-block pt-4 pr-5 pb-4 pl-5 text-xl font-medium text-center text-white bg-indigo-500 rounded-lg transition duration-200 hover:bg-indigo-600 ease">
                                                        Đăng nhập
                                                    </button>
                                                </div>
                                                {message && <div className="text-red-500">{message}</div>}
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Login;
