
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { CartItem } from "../../components/CartItem"
import { useDispatch } from "react-redux";
import { resetCart } from "../../redux/bazaarSlice";
import SystemConst from '../../../../common/consts/system_const';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Select, Card } from 'antd';
export const Cart = () => {

  const dispatch = useDispatch()
  const BASE_URL = `${SystemConst.DOMAIN}/Orders`;
  const BASE_URL_OrderDetails = `${SystemConst.DOMAIN}/OrderDetails`;
  const BASE_URL_AddressCustomers = `${SystemConst.DOMAIN}/AddressCustomers`;
  const productData = useSelector((state) => state.bazar.productData)
  const [totalPrice, setTotalPrice] = useState("")
  const [orderDateTime, setOrderOrderDateTime] = useState("30/12/2023")
  const [shippingCost, setShippingCost] = useState(30)
  const [orderStatus, setOrderStatus] = useState("Chờ Xử Lý")

  useEffect(() => {
    let unitPrice = 0;
    productData.map((item) => {
      unitPrice += item.unitPrice * item.quantity;
      return unitPrice
    });
    setTotalPrice(unitPrice)
  }, [productData])
  const [dataAddressCustomers, setDataAddressCustomers] = useState([]);
  useEffect(() => {
    handleFetchData();
  })
  const handleFetchData = () => {
    var cusId = localStorage.getItem('customerId');
    axios
      .get(`${BASE_URL_AddressCustomers}?customerId=${cusId}&isDeleted=false`)
      .then(async (response) => {
        const Api_Data_AddressCustomers = response.data;
        try {
          const newData = Api_Data_AddressCustomers.map(
            (item) => ({
              id: item.id,
              customerId: item.customerId,
              addressCustomerName: item.addressCustomerName,
              city: item.city,
              district: item.district,
              subDistrict: item.subDistrict,
              phoneNumber: item.phoneNumber,
              address: item.address,
              isDeleted: item.isDeleted,
            })
          );
          setDataAddressCustomers(newData);
        } catch (error) {
          console.log(error);
        }
      })
      .catch((error) => {
      });
  };
  const handleCheckout = () => {
    // console.log(productData);
    // console.log(orderDateTime);
    // console.log(shippingCost);
    // console.log(orderStatus);
    // console.log(totalPrice);
    const formData = new FormData();
    formData.append("customerId", localStorage.getItem('customerId'));
    // formData.append("employeeId", isValueEmployeeId);
    // formData.append("addressCustomerId", isValueAddressCustomerId);
    const currentDate = new Date();
    const formattedDateTime = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}T${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}:${currentDate.getSeconds().toString().padStart(2, '0')}`;
    formData.append("orderDateTime", formattedDateTime);
    formData.append("totalPrice", totalPrice);
    formData.append("shippingCost", shippingCost);
    formData.append("orderStatus", orderStatus);
    formData.append("isDeleted", 'false');
    // console.log(formData);
    axios
      .post(`${BASE_URL}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        // console.log(response.data.id);
        // console.log();
        productData.map((item) => {
          const formDataOderDetails = new FormData();
          formDataOderDetails.append("orderId", response.data.id);
          formDataOderDetails.append("productId", item.id);
          formDataOderDetails.append("quantity", item.quantity);
          formDataOderDetails.append("unitPrice", item.unitPrice);
          formDataOderDetails.append("isDeleted", false);
          axios
            .post(`${BASE_URL_OrderDetails}`, formDataOderDetails, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((response) => {
            })
            .catch((error) => {
            });
        });
        dispatch(resetCart());
        Swal.fire({
          icon: 'success',
          title: 'Đặt Hàng Thành Công',
          showConfirmButton: false,
          timer: 600,
        });
      })
      .catch((error) => {
      });
  }


  return (
    <div>
      <div className='max-w-screen-xl mx-auto py-20 flex'>
        <CartItem />
        <div className='w-1/3 bg-[#fafafa] py-6 px-0'>
          <div className='flex flex-col gap-6 border-b-[1px] border-b-gray-400 pb-6'>
            <h2 className='text-2xl font-medium'>Cart Totals</h2>
            <p className='flex items-center gap-4 text-base'>
              Subtotal
              <span className='font-bold text-lg'>{totalPrice}</span></p>
            <p className='flex items-start gap-4 text-base'>
              <div className='mt-1'>Shipping Information</div>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {dataAddressCustomers.map((item) => (
                  <span key={item.id}>
                    <Card title={item.addressCustomerName} extra={<a>Chọn</a>} style={{ width: 280 }}>
                      <p>{item.phoneNumber}</p>
                      <p>{item.address}</p>
                      <p>{item.city}</p>
                    </Card>
                  </span>
                ))}
              </div>
            </p>
            <p className='flex items-start gap-4 text-base'>
              Shipping Cost
              <span>
                30 $
              </span>
            </p>
            <p className='flex items-start gap-4 text-base'>
              <div className='mt-1'> Payment Method</div>
              <div > <Select
                defaultValue="COD"
                style={{ width: 120 }}
                /*onChange={handleChange}*/
                options={[
                  { value: 'COD', label: 'COD' },
                  { value: 'Momo', label: 'Momo' },
                ]}
              /></div>
            </p>
          </div>
          <p className='font-titleFont font-semibold flex justify-between mt-6'>
            Total <span className='text-xl font-bold'>$ {totalPrice}</span>
          </p>
          <button onClick={handleCheckout} className='text-base text-white w-full py-3 mt-6 hover: bg-gray-800 duration-300'>Order</button>

        </div>
      </div >
    </div >
  )
}



