import React, { useEffect, useState } from "react";
import { Banner } from "../../components/Banner";
import Products from "../../components/Products";
import { productsData } from '../../api/Api';

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

function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await productsData();
        setProducts(result.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Banner />
      <Products products={products} />
    </div>
  );
}

export default Home;
