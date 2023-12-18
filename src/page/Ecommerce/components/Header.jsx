import LogoLight from '../assets/index';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AccountMenu from './AccountMenu'
import LoginIcon from '@mui/icons-material/Login';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SystemConst from '../../../common/consts/system_const';
function Header() {
  const productData = useSelector((state) => state.bazar.productData)
  // const UserInfo = useSelector((state) => state.bazar.userInfo)
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const BASE_URL = `${SystemConst.DOMAIN}/ProductCategories`;
  React.useEffect(() => {
    const hasToken = Boolean(localStorage.getItem('customerToken'));
    setIsLoggedIn(hasToken);
  }, []);
  const [dataProductCategories, setDataProductCategories] = useState([]);
  useEffect(() => {
    handleFetchData();
  },);
  const handleFetchData = () => {
    axios
      .get(`${BASE_URL}?isDeleted=false`)
      .then((response) => {
        const Api_Data_ProductCategories = response.data;
        const newData = Api_Data_ProductCategories.map((item) => ({
          id: item.id,
          productCategoryName: item.productCategoryName,
          isDeleted: item.isDeleted,
        }));
        console.log(newData)
        setDataProductCategories(newData);
      })
      .catch((error) => {
        // Handle error if needed
        console.error('Error fetching data:', error);
      });
  };

  return (
    <div className='z-50 w-full h-30 bg-white z-index-1 sticky top-0 border-b-gray-800 font-titleFont '>
      <div className='max-w-screen-xl h-full mx-auto flex items-center justify-center'>
        <div className='flex gap-5 items-start'>
          <Link to='/ecommerce/home'>
            <div>
              <img src={LogoLight} alt="LogoLight" className='w-28' />
            </div>
          </Link>
        </div>
        <div className='flex gap-5 items-center'>
          <ul className='flex items-center gap-8 cursor-pointer'>
            <Link to={'/ecommerce/home'}><li className='text-base text-black font-bold hover:text-orange-900 hover:underline underline-offset-2 decoration-[1px] cursor-pointer duration-300'>Trang Chủ</li></Link>
            {/* <li className='text-base text-black font-bold hover:text-orange-900 hover:underline underline-offset-2 decoration-[1px] cursor-pointer duration-300' >Nữ</li> */}
            {/* Hiển thị danh sách danh mục sản phẩm */}
            {dataProductCategories.map((category) => (
              <li key={category.id} className='text-base text-black font-bold hover:text-orange-900 hover:underline underline-offset-2 decoration-[1px] cursor-pointer duration-300'>
                {category.productCategoryName}
              </li>
            ))}
            {/* <li className='text-base text-black font-bold hover:text-orange-900 hover:underline underline-offset-2 decoration-[1px] cursor-pointer duration-300' >Nam</li> */}
            <li className='text-base text-black font-bold hover:text-orange-900 hover:underline underline-offset-2 decoration-[1px] cursor-pointer duration-300' >Giảm Giá</li>
            <li className='text-base text-black font-bold hover:text-orange-900 hover:underline underline-offset-2 decoration-[1px] cursor-pointer duration-300' >Bán Chạy Nhất</li>
          </ul>

          <Link to='/ecommerce/cart'>
            <div className='cursor-pointer relative'>
              <ShoppingCartIcon />
              <span className='abslute top-2 left-0'>{productData.length}</span>
            </div>
          </Link>
          <div>
            {isLoggedIn ? (
              <div>
                <AccountMenu />
              </div>
            ) : (
              <Link to={'/ecommerce/signin'}>
                <LoginIcon />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Header;



