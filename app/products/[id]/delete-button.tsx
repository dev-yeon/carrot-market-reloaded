"use client";

import { useState } from "react";
import { boolean } from "zod";
import { onDelete } from "./actions";

const DeleteButton = ({id, isOwner} : { id: number; isOwner: boolean}) =>{
  const [isLoading, setIsLoading] = useState(false);
  const onClick = async () => {
    const ok = window.confirm("상품을 영구히 삭제하시겠습니까?");
    if(!ok) return; 
    setIsLoading(true);
    await onDelete(id, isOwner);
    setIsLoading(false);
    window.location.href = "/products";
  }; 
  return (
    <button
      onClick={onClick}
      type="button"
      className="bg-red-500 w-full h-10 rounded-md text-white font-semibold"
    >
      {isLoading ? "삭제하는 중..." : "삭제하기"}
    </button>
  );
};

export default DeleteButton;