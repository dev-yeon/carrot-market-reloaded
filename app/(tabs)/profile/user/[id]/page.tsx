import db from "@/lib/db"
import { notFound } from "next/navigation";
import { unstable_cache as nextCache } from "next/cache";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import Products from "@/app/(tabs)/home/page";
import { formatToTimeAgo } from "@/lib/utils";


const getUser = async (userId: number) => {
  const user = await db.user.findUnique({
    where : {
      id: userId,
    },
    include : {
      products : {
        select : {
          id: true,
          title: true,
          photo: true,
        },
        orderBy : {
          created_at : "desc",
        },
      },
    },
  }); 
  if (user) {
    return user;
  }
  notFound();
};
const getCachedUser = (userId: number) => {
  const cachedOperation = nextCache(getUser, [`user-profile-${userId}`], {
    tags : [`user-${userId}`, `user-profile-${userId}`],
  });
  return cachedOperation(userId);
};

async function getBoughtProducts(userId: number) {
  const chatRooms = await db.chatRoom.findMany({
    where : {
      users :{
        some :{
          id: userId,
        },
      },
      product : {
        userId : {
          not: userId,
        },
      },
    },
    select : {
      product : {
        select :{
          id: true,
          title: true,
          photo: true
        },
      },
    },
    orderBy : {
      created_at : "desc"
    },
  });
  return chatRooms.map((chatRooms) => chatRooms.product);
  
}
const getCachedBoughtProducts = (userId: number) => {
  const cachedOperation = nextCache(
    getBoughtProducts,
    [`bought-products-${userId}`],
    {
      tags : [
        `user-info-${userId}`,
        `user-profile-${userId}`,
        `bought-products-${userId}`,
      ],
    }
  );
  return cachedOperation(userId);
};

async function getReviews(userId: number) {
  const reviews = await db.review.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      payload: true,
      created_at: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });
  return reviews;
}

const getCachedReviews = (userId: number) => {
  const cachedOperation = nextCache(getReviews, [`reviews-${userId}`], {
    tags: [`reviews-${userId}`],
  });
  return cachedOperation(userId);
};

const UserProfile = async ({params} : {params : {id: string}}) =>{
  const id = Number(params.id); 
  if (isNaN(id)) return notFound();
  const user = await getCachedUser(id);
  const boughtProducts = await getCachedBoughtProducts(id);
  const reviews = await getCachedReviews(id);

  return (
    <div className="flex flex-col gap-7 p-5">
      <div className="flex gap-5 items-center">
        {user.avatar ? (
          <Image 
          src={
            user.avatar.startsWith("https://")
              ? `${user.avatar}/avatar` // https://로 시작하면 그대로 사용
              : `${user.avatar}/avatar` // 다른 형식에도 /avatar 추가
          }
              alt = {user.username}
              width = {64}
              height = {64}
              className = "size-16 rounded-full"
          />
        ) : (
          <UserIcon className="size-16" />
        )}
        <h1 className="text-3xl">{user.username}님의 프로필</h1>
      </div>
      <div className="flex flex-col gap-3">
        <h2 className="texl-xl">판매한 상품</h2>
        <ul className="flex overflow-x-auto gap-5 pb-3">
          {user.products.map((product)=> (
            <Link
              className="flex flex-col gap-3 min-w-20"
              key = {product.id}
              href= {`/products/${product.id}`}
              >
              <Image 
                src={`${product.photo}/avatar`}
                alt={product.title +""}
                width={80}
                height={80}
                className="size-20 rounded-md"
              />
              <h3>
                {product.title.length > 5 
                 ? `${product.title.slice(0,5)}...`
                : product.title}
              </h3>
            </Link>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-3">
        <h2 className="text-xl">구매한 상품</h2>
        <ul className="flex overflow-x-auto gap-5 pb-3">
          {boughtProducts.map((product) => (
            <Link 
              className="flex flex-col gap-3 min-w-20"
              key={product.id}
              href={`/products/${product.id}`}
            >
              <Image 
                src={`${product.photo}/avatar`}
                alt={product.title}
                width={80}
                height={80}
                className="size-20 rounded-md"
              />
              <h3>
                {product.title.length > 5 
                 ? `${product.title.slice(0,5)}...`
                : product.title}
              </h3>
            </Link>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-3">
        <h2 className="text-xl">이 사용자에 대한 리뷰</h2>
        <ul className="flex flex-col gap-5 max-h-64 overflow-y-auto py-3">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="flex flex-col gap-2 pl-5 border-l-neutral-400 border-l"
            >
              <h3 className="text-md">{review.payload}</h3>
              <span className="text-sm text-neutral-500">
                {formatToTimeAgo(review.created_at.toString())}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
export default UserProfile;