"use client";

import ProductComments from './ProductComments';
import SimilarProducts from './SimilarProducts';

const ProductDetailsLayout = ({ productId }) => {
  return (
    <div className="mt-12 border-t pt-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ProductComments productId={productId} />
        </div>
        <div className="lg:col-span-1">
          <SimilarProducts productId={productId} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsLayout;
