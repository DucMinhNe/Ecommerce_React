import axios from "axios";
import SystemConst from '../../../common/consts/system_const';
export const productsData = async () => {
  // const products = await axios.get("https://fakestoreapiserver.reactbd.com/products")
  const products = await axios.get(`${SystemConst.DOMAIN}/Products?isDeleted=false`)
  return products;
}



