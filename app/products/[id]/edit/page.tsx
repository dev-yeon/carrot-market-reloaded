import React from "react";
import EditForm from "@/components/edit-form";
import { unstable_cache as nextCache } from "next/cache";
import { getProduct } from "./actions";
import { notFound } from "next/navigation";
import getSession from "@/lib/session";
// 데이터 가져오기 


const getCachedProduct = nextCache(getProduct, ["product-detail"], {
  tags : ["product-detail"],
}); 

const EditProduct = async ({ params }: { params : { id: string}}) => {
  const id = Number(params.id);
  if (isNaN(id)) return notFound(); 
  const product = await getCachedProduct(id); 
  if(!product) return notFound();
  const session = await getSession();
  const isOwner = session.id === product.userId;
  return (
    <div>
      <EditForm 
        id = {id}
        product={product}
        isOwner = {isOwner}
      />
    </div>
  );
};

export default EditProduct;