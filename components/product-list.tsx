'use client';

import { InitialProducts } from '@/app/(tabs)/products/page';
import ListProduct from './list-product';
import { useEffect, useRef, useState } from 'react';
import { getMoreProducts } from '@/app/(tabs)/products/actions';

interface ProductListProps {
    initialProducts: InitialProducts;
}

export default function ProductList({ initialProducts }: ProductListProps) {
    const [products, setProducts] = useState(initialProducts);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [isLastPage, setIsLastPage] = useState(false);
    const trigger = useRef<HTMLSpanElement>(null); // variable 내부에 data를 저장이 가능한 hook
    useEffect(() => {}, [page]);
    const onLoadMoreClick = async () => {
        setIsLoading(true);
        const newProducts = await getMoreProducts(page + 1);
        if (newProducts.length !== 0) {
            setPage((prev) => prev + 1);
            setProducts((prev) => [...prev, ...newProducts]);
        } else {
            setIsLastPage(true);
        }
        setIsLoading(false);
    };
    return (
        <div className="p-5 flex flex-col gap-10">
            {products.map((product) => (
                <ListProduct key={product.id} {...product} />
            ))}
            <span
                ref={trigger}
                className="mt-[300vh] mb-96 text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
            >
                {isLoading ? '로딩 중' : 'Load more'}
            </span>
        </div>
    );
}
