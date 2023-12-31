import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import systemConst from '../../../../common/consts/system_const';
import Swal from "sweetalert2";



const SignIn: React.FC = () => {
  const BASE_URL = `${systemConst.DOMAIN}`;
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();
  const [isCustomerToken, setIsCustomerToken] = useState(Boolean(localStorage.getItem('customerToken')));
  useEffect(() => {
    if (isCustomerToken) {
      handleRouteCustomer();
    }
    // console.log(localStorage.getItem('customerId'));
    // console.log(localStorage.getItem('customerName'));
    // console.log(localStorage.getItem('customerEmail'));
    // console.log(localStorage.getItem('customerPhoneNumber'));
    // console.log(localStorage.getItem('customerImage'));
    // eslint-disable-next-line
  }, [isCustomerToken]);

  const handleRouteCustomer = () => {
    setTimeout(() => {
      navigate('/ecommerce/home', { replace: true });
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const customerEmail = email.current?.value;
    const customerPassword = password.current?.value;

    if (!customerEmail || !customerPassword) {
      return setMessage('Vui lòng nhập đầy đủ thông tin tài khoản và mật khẩu.');
    }

    try {
      const response = await fetch(`${BASE_URL}/auth/customer/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: customerEmail, password: customerPassword }),
      });

      if (response.ok) {
        const data = await response.json();

        try {
          // Kiểm tra nếu token được định nghĩa trong data
          if (data.token) {
            const customerToken = data.token;

            // Parse token để lấy thông tin
            const payloadBase64 = customerToken.split('.')[1];
            const payloadJson = atob(payloadBase64);
            const tokenData = JSON.parse(payloadJson);
            // console.log(tokenData);
            // Lưu thông tin vào LocalStorage
            if (tokenData) {
              localStorage.setItem('customerId', tokenData.id);
              // localStorage.setItem('customerName', tokenData.name);
              // localStorage.setItem('customerEmail', tokenData.email);
              // localStorage.setItem('customerPhoneNumber', tokenData.phoneNumber);
              // localStorage.setItem('customerImage', tokenData.customerImage);
            }

            localStorage.setItem('customerToken', customerToken);
            setIsCustomerToken(true);
            Swal.fire({
              icon: 'success',
              title: 'Đăng nhập thành công!',
              showConfirmButton: false,
              timer: 700,
            });
            window.location.reload();
            handleRouteCustomer();
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
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
      <div className="w-full p-6 m-auto bg-white rounded-md shadow-xl lg:max-w-xl">
        <h1 className="text-3xl font-semibold text-center text-orange-700 uppercase">
          Đăng Nhập
        </h1>
        <form className="mt-6" onSubmit={handleSubmit}>
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
          <a
            href="#"
            className="text-xs text-orange-600 hover:underline"
          >
            Quên Mật Khẩu Lấy Lại Tại Đây ?
          </a>
          <div className="mt-6">
            <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-orange-700 rounded-md hover:bg-orange-600 focus:outline-none focus:bg-orange-600">
              Đăng Nhập
            </button>
          </div>
        </form>
        <div className="relative flex items-center justify-center w-full mt-6 border border-t">
          <div className="absolute px-5 bg-white">Hoặc</div>
        </div>
        <div className="flex mt-4 gap-x-2">
          <button
            type="button"
            className="flex items-center justify-center w-full p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-offset-1 focus:ring-violet-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              className="w-5 h-5 fill-current"
            >
              <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z"></path>
            </svg>
          </button>
          <button className="flex items-center justify-center w-full p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-offset-1 focus:ring-violet-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              className="w-5 h-5 fill-current"
            >
              <path
                d="M16 0.396c-8.839 0-16 7.167-16 16 0 8.832 6.566 15.983 15.125 16.361v-11.471h-3.545v-4.497h3.545v-3.417c0-3.512 2.087-5.448 5.303-5.448 1.535 0 3.214 0.274 3.214 0.274v3.54h-1.812c-1.782 0-2.344 1.107-2.344 2.243v2.7h3.971l-0.533 4.497h-3.438v11.471c8.001-0.398 14.375-8.001 14.375-16.912 0-8.833-7.161-16-16-16z"
              ></path>
            </svg>
          </button>
          <button className="flex items-center justify-center w-full p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-offset-1 focus:ring-violet-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              className="w-5 h-5 fill-current"
            >
              <path d="M31.937 6.093c-1.177 0.516-2.437 0.871-3.765 1.032 1.355-0.813 2.391-2.099 2.885-3.631-1.271 0.74-2.677 1.276-4.172 1.579-1.192-1.276-2.896-2.079-4.787-2.079-3.625 0-6.563 2.937-6.563 6.557 0 0.521 0.063 1.021 0.172 1.495-5.453-0.255-10.287-2.875-13.52-6.833-0.568 0.964-0.891 2.084-0.891 3.303 0 2.281 1.161 4.281 2.916 5.457-1.073-0.031-2.083-0.328-2.968-0.817v0.079c0 3.181 2.26 5.833 5.26 6.437-0.547 0.145-1.131 0.229-1.724 0.229-0.421 0-0.823-0.041-1.224-0.115 0.844 2.604 3.26 4.5 6.14 4.557-2.239 1.755-5.077 2.801-8.135 2.801-0.521 0-1.041-0.025-1.563-0.088 2.917 1.86 6.36 2.948 10.079 2.948 12.067 0 18.661-9.995 18.661-18.651 0-0.276 0-0.557-0.021-0.839 1.287-0.917 2.401-2.079 3.281-3.396z"></path>
            </svg>
          </button>
        </div>

        <p className="mt-8 text-xs font-light text-center text-gray-700">
          {" "}
          Bạn Chưa Có Tài Khoản?{" "}
          <Link to={'/ecommerce/signup'}>
            <a
              href="#"
              className="font-medium text-orange-600 hover:underline"
            >
              Đăng Ký Tại Đây
            </a>
          </Link>
        </p>
        {message && <div className="text-red-500">{message}</div>}
      </div>
    </div>
  );
};
export default SignIn;


