import React, { useEffect, useState } from "react";
import Products from "../../components/Products";
import axios from 'axios';
import SystemConst from '../../../../common/consts/system_const';
import { useParams } from "react-router-dom";
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
const BASE_URL = `${SystemConst.DOMAIN}/Products`;
function CategoryProduct() {
    const [products, setProducts] = useState<Product[]>([]);
    const { id } = useParams<{ id: string }>();
    useEffect(() => {
        // console.log(id)
        handleFetchData();
    }, [id]);
    const handleFetchData = () => {
        axios
            .get(`${BASE_URL}?productCategoryId=${id}`)
            .then(async (response) => {
                const Api_Data_Products = response.data;
                setProducts(Api_Data_Products);
            })
            .catch((error) => {
            });
    };
    return (
        <div>
            <Products products={products} />
        </div>
    );
}

export default CategoryProduct;
