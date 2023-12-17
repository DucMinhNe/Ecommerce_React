import React, { useEffect, useRef, useState } from 'react';
import bgLogin from '../../img/login_background.jpg';
import { useNavigate } from 'react-router-dom';
import systemConst from '../../common/consts/system_const';
import Swal from 'sweetalert2';
const ShipperLogin: React.FC = () => {
    const BASE_URL = `${systemConst.DOMAIN}`;
    const email = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);
    const [message, setMessage] = useState<string>('');
    const navigate = useNavigate();
    const [isShipperEmployeeToken, setIsShipperEmployeeToken] = useState(Boolean(localStorage.getItem('shipperEmployeeToken')));
    useEffect(() => {
        if (isShipperEmployeeToken) {
            handleRouteShipper();
        }
    }, [isShipperEmployeeToken]);
    const handleRouteShipper = () => {
        setTimeout(() => {
            navigate('/shipper', { replace: true });
        }, 0);
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const shipperEmployeeEmail = email.current?.value;
        const shipperEmployeePassword = password.current?.value;

        if (!shipperEmployeeEmail || !shipperEmployeePassword) {
            return setMessage('Vui lòng nhập đầy đủ thông tin tài khoản và mật khẩu.');
        }

        try {
            const response = await fetch(`${BASE_URL}/auth/employee/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: shipperEmployeeEmail, password: shipperEmployeePassword }),
            });

            if (response.ok) {
                const data = await response.json();

                try {
                    // Kiểm tra nếu token được định nghĩa trong data
                    if (data.token) {
                        const shipperEmployeeToken = data.token;

                        // Parse token để lấy thông tin
                        const payloadBase64 = shipperEmployeeToken.split('.')[1];
                        const payloadJson = atob(payloadBase64);
                        const tokenData = JSON.parse(payloadJson);
                        // console.log(tokenData);
                        // Lưu thông tin vào LocalStorage
                        if (tokenData.jobTitleId != 3) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Tài Khoản Không Có Quyền',
                                showConfirmButton: false,
                                timer: 700,
                            });
                            return
                        }
                        if (tokenData) {
                            localStorage.setItem('shipperEmployeeId', tokenData.id);
                            localStorage.setItem('shipperJobTitleId', tokenData.jobTitleId);
                        }

                        localStorage.setItem('shipperEmployeeToken', shipperEmployeeToken);
                        setIsShipperEmployeeToken(true);
                        window.location.reload();
                        Swal.fire({
                            title: "Đăng nhập thành công",
                            width: 600,
                            padding: "7em",
                            color: "#444428",

                            showConfirmButton: false,
                            timer: 2700,
                            background: "#fff url(https://i.pinimg.com/564x/dc/fa/ae/dcfaaeeb68f65df26e82bfc207aea17b.jpg)",
                            backdrop: `
                          rgba(0,0,123,0.4)
                          url("/images/nyan-cat.gif")
                          left top
                          no-repeat
                        `
                        });
                        handleRouteShipper();
                    } else {
                        // Xử lý trường hợp token không được định nghĩa
                        console.error('Token is undefined or empty in response data.');
                    }
                } catch (error) {
                    console.error('Error parsing token:', error);
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Sai tài khoản hoặc mật khẩu!',
                    showConfirmButton: false,
                    timer: 700,
                });
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <>
            {!isShipperEmployeeToken && (
                <div className="bg-black h-screen">
                    <div className="bg-black h-5 items-center fixed w-full relative">
                    </div>
                    <div className="bg-[#ba051c] h-1 items-center fixed w-full relative">
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
                                                Đăng Nhập
                                            </p>
                                            <div className="w-full mt-6 mr-0 mb-0 ml-0 relative space-y-8">
                                                <div className="relative">
                                                    <p className="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">
                                                        Email
                                                    </p>
                                                    <input
                                                        ref={email}
                                                        placeholder=""
                                                        type="text"
                                                        className="border placeholder-gray-400 focus:outline-none focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white border-gray-300 rounded-md"
                                                    />
                                                </div>
                                                <div className="relative">
                                                    <p className="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">
                                                        Mật Khẩu
                                                    </p>
                                                    <input
                                                        ref={password}
                                                        placeholder=""
                                                        type="password"
                                                        className="border placeholder-gray-400 focus:outline-none focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white border-gray-300 rounded-md"
                                                    />
                                                </div>
                                                <div className="relative">
                                                    <button className="w-full inline-block pt-4 pr-5 pb-4 pl-5 text-xl font-medium text-center text-white bg-black rounded-lg transition duration-200 hover:bg-[#ba051c] ease">
                                                        Đăng Nhập
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

export default ShipperLogin;
