import ListProduct from '@/components/list-product';
import db from '@/lib/db';

async function getProducts() {
    const products = await db.product.findMany({
        select: {
            title: true,
            price: true,
            created_at: true,
            photo: true,
            id: true
        },
        take: 1,

        orderBy: {
            created_at: 'desc'
        }
    });
    return products;
}

export default async function Products() {
    const initialProducts = await getProducts();
    return (
        <div>
            {products.map((product) => (
                <ListProduct key={product.id} {...product} />
            ))}
        </div>
    );
}
