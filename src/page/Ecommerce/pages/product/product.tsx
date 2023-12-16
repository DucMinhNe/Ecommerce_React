import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/bazaarSlice';
import { ToastContainer, toast } from 'react-toastify';
import SystemConst from '../../../../common/consts/system_const';
interface ProductDetails {
  id: string;
  productName: string;
  productImage: string;
  oldPrice: number;
  unitPrice: number;
  rating: number;
  description: string;
  isNew: boolean;
  productCategoryName: string;
}

export const Product: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [details, setDetails] = useState<ProductDetails | undefined>(undefined);
  const [baseQty, setBaseQty] = useState<number>(1);

  useEffect(() => {
    setDetails(location.state?.item);
  }, [location.state]);

  const handleAddToCart = () => {
    if (details) {
      dispatch(
        addToCart({
          id: details.id,
          productName: details.productName,
          productImage: details.productImage,
          unitPrice: details.unitPrice,
          quantity: baseQty,
          description: details.description,
        })
      );
      toast.success(`${details.productName} is added`);
    }
  };

  return (
    <div>
      <div className="max-w-screen-xl mx-auto my-10 flex gap-10">
        <div className="w-2/5 relative">
          <img className="w-full h-[550px] object-cover" src={`${SystemConst.DOMAIN_HOST}/${details?.productImage}`} alt="" />
          <div className="absolute top-2 right-2">
            {details?.isNew && (
              <p className="bg-black text-white px-8 py-1">Sale</p>
            )}
          </div>
        </div>
        <div className="w-3/5 flex flex-col justify-center gap-12">
          <div>
            <h2 className="text-3xl font-semibold">{details?.productName}</h2>
            <div className="flex items-center gap-4 mt-3">
              <div className="line-through font-base text-gray-500">

                {details?.unitPrice && (
                  <span>Giá Cũ {Math.ceil(details.unitPrice * 1.2)} Vnđ</span>
                )}
              </div>
              <div className="text-2xl font-medium text-gray-900">
                {details?.unitPrice} Vnđ
              </div>
            </div>
          </div>
          <div className="flex align-center gap-3 flex-start">
            <div>
              {Array.from({ length: Math.floor(details?.rating || 0) }, (_, index) => (
                <StarIcon key={index} />
              ))}
            </div>
            {details?.rating}
          </div>
          {/* <p className="text-sm mt-1 text-gray-500">({details?.rating} Customer reviews)</p> */}
          <p className="text-base text-gray-500 mt-3">{details?.description}</p>
          <div className="flex gap-4">
            <div className="w-52 flex items-center justify-between text-gray-500 gap-4 border p-3">
              <p className="text-base text-black">Số Lượng</p>
              <div className="flex items-center gap-4 text-sm font-semibold">
                <button
                  onClick={() => setBaseQty(baseQty > 1 ? baseQty - 1 : 1)}
                  className="border text-black h-5 font-normal text-1g flex items-center justify-center px-2 hover:bg-gray-700 hover:text-white cursor-pointer py-3 duration-300 active:bg-black"
                >
                  -
                </button>
                <span>{baseQty}</span>
                <button
                  onClick={() => setBaseQty(baseQty + 1)}
                  className="border h-5 text-black font-normal text-1g flex items-center justify-center px-2 hover:bg-gray-700 hover:text-white cursor-pointer py-3 duration-300 active:bg-black"
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-black text-white py-3 px-6 active:bg-gray-800"
            >
              Thêm Vào Giỏ Hàng
            </button>
          </div>
          <p className="text-base text-gray-500">Loại Sản Phẩm: <span className="font-medium capitalize">{details?.productCategoryName}</span></p>
        </div>
      </div>
      <ToastContainer
        position="top-left"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};
