import React from 'react';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux"
import { addToCart } from '../redux/bazaarSlice';
import { ToastContainer, toast } from 'react-toastify';
import SystemConst from '../../../common/consts/system_const';
interface Product {
  id: number;
  productName: string;
  oldPrice: number;
  unitPrice: number;
  productImage: string;
  productCategoryName: string;
  isNew: boolean;
  description: string;
}
interface ProductsCardProps {
  product: Product;
}

const ProductsCard: React.FC<ProductsCardProps> = ({ product }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { productName, oldPrice, unitPrice, productImage, productCategoryName, isNew, description } = product;

  const idString = (Title: string) => {
    const newIdString = String(Title).toLowerCase().split(" ").join("");
    return newIdString;
  }

  const rootId = idString(productName);

  const handleDetails = () => {
    navigate(`/ecommerce/product/${rootId}`, {
      state: {
        item: product
      }
    });
  }

  return (
    <div className='group relative'>
      <div className="w-full h-96 cursor-pointer overflow-hidden">
        <img onClick={handleDetails} className=' h-full w-full object-cover group-hover:scale-110 duration-500' src={`${SystemConst.DOMAIN_HOST}/${productImage}`} alt="" />
      </div>
      <div className="w-full border-[1px] px-2 py-4">
        <h2 className='font-arial text-xl font-bold '>{productName}</h2>
        <div className='flex justify-between items-center'>
          <p>{productCategoryName}</p>
          <div className='flex gap-2 justify-end'>
            {/* <p className='line-through text-gray-500'>${oldPrice}</p> */}
            <p className='font-semibold'>{unitPrice} Vnđ</p>
          </div>
        </div>
        <div className='flex justify-between mt-2'>
          <button onClick={() => dispatch(addToCart({
            id: product.id,
            productName: product.productName,
            productImage: product.productImage,
            unitPrice: product.unitPrice,
            quantity: 1,
            description: product.description
          })) && toast.success(`Đã thêm ${product.productName} vào giỏ hàng`)} className="bg-black text-white py-3 px-6 active:bg-gray-800">
            Thêm Vào Giỏ Hàng
          </button>
        </div>
        {/* <div className='top-2 right-2 absolute'>
          {isNew && <p className='bg-black text-white font-semibold px-6 py-1'>Sale</p>}
        </div> */}
      </div>
      <ToastContainer
        position='top-left'
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='dark'
      />
    </div>
  );
};

export default ProductsCard;
