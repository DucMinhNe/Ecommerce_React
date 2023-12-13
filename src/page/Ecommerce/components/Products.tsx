import React from "react";
import ProductsCard from "./ProductsCard";

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

interface ProductsProps {
  products: Product[];
}

const Products: React.FC<ProductsProps> = ({ products }) => {
  return (
    <div className="py-10 cursor-pointer">
      <div className="max-w-screen-xl mx-auto py-10 grid grid-cols-4 gap-10">
        {products.map((item, key) => (
          <ProductsCard product={item} key={key} />
        ))}
      </div>
    </div>
  );
};

export default Products;
