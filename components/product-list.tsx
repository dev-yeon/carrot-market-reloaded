'use client';

import { InitialProducts } from '@/app/(tabs)/home/page';
import ListProduct from './list-product';
import { useEffect, useRef, useState } from 'react';
import { getMoreProducts } from '@/app/(tabs)/home/actions';

interface ProductListProps {
    initialProducts: InitialProducts; // 초기 상품 데이터
}
export default function ProductList({ initialProducts }: ProductListProps) {
    // 모든 상품 데이터를 저장하는 상태
    const [products, setProducts] = useState(initialProducts);
    // 로딩 상태를 저장하는 상태
    const [isLoading, setIsLoading] = useState(false);
    // 현재 페이지 번호를 저장하는 상태
    const [page, setPage] = useState(0);
    // 마지막 페이지인지 여부를 저장하는 상태
    const [isLastPage, setIsLastPage] = useState(false);
    // 트리거 요소를 참조하는 변수
    const trigger = useRef<HTMLSpanElement>(null); // variable 내부에 data를 저장이 가능한 hook
    useEffect(() => {
        //
        const observer = new IntersectionObserver(
            // 관찰 대상 요소가 화면에 보이면 실행되는 콜백 함수
            async (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
                // entries[0]는 관찰 중인 요소
                const element = entries[0];
                // 요소가 화면에 보이고, trigger 요소가 존재할 때
                if (element.isIntersecting && trigger.current) {
                    // 현재 요소의 관찰을 중지 (중복 호출 방지)
                    observer.unobserve(trigger.current);
                    // 로딩 상태를 true로 설정
                    setIsLoading(true);
                    // 새로운 상품 데이터를 가져옴
                    const newProducts = await getMoreProducts(page + 1);
                    // 새로운 상품 데이터가 존재할 때
                    if (newProducts.length !== 0) {
                        // 페이지 번호를 증가시키고, 상품 데이터를 업데이트
                        setPage((prev) => prev + 1);
                        // 기존 상품 데이터에 새로운 상품 데이터를 추가
                        setProducts((prev) => [...prev, ...newProducts]);
                    } else {
                        // 마지막 페이지인 경우, 마지막 페이지 상태를 true로 설정
                        setIsLastPage(true);
                    }
                    // 로딩 상태를 false로 설정
                    setIsLoading(false);
                }
            },
            {
                threshold: 1.0, // 요소가 100% 보일 때 콜백 실행
                rootMargin: '0px 0px -100px 0px' // 하단에서 100px 위에서 트리거
            }
        );
        if (trigger.current) {
            observer.observe(trigger.current);
        }
        return () => {
            observer.disconnect();
        };
    }, [page]);

    return (
        <div className="p-5 flex flex-col gap-10">
            {products.map((product) => (
                  <ListProduct
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  created_at={product.created_at}
                  price={product.price}
                  photo={product.photo}
                  isSold={product.isSold} // isSold 전달
                />
            ))}
            {!isLastPage ? (
                <span
                    ref={trigger}
                    style={{
                        marginTop: `${(page + 1) * 150}vh`
                    }}
                    className=" mb-96 text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
                >
                    {isLoading ? '로딩 중' : 'Load more'}
                </span>
            ) : null}
        </div>
    );
}
