import db from "@/lib/db";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import {
  unstable_cache as nextCache,
  revalidatePath,
  revalidateTag,
} from "next/cache";
import getSession from "@/lib/session";

async function getIsOwner(userId: number) {
  // const session = await getSession();
  // if (session.id) {
  //   return session.id === userId;
  // }
  return false;
}

async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,

    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  
  return product;
}

const getCachedProduct = nextCache(getProduct, ["product-detail"], {
  tags: ["product-detail"],
});

async function getProductTitle(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    select: {

      title: true,
    },
  });
  return product;
}

const getCachedProductTitle = nextCache(getProductTitle, ["product-title"], {
  tags: ["product-title"],
});

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const product = await getCachedProductTitle(Number(resolvedParams.id));
    
    return {
      title: product?.title,
    };
  }

  export default async function ProductDetail({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);
    if (isNaN(id)) {
      return notFound();
    }
    const product = await getCachedProduct(id);
    if (!product) {
      return notFound();
    }
      // 여기에서 이미지 URL을 출력합니다.
//   console.log('Product photo URL:', product.photo);
  
  const isOwner = await getIsOwner(product.userId);
  const revalidate = async () => {
    "use server";
    revalidateTag("xxxx");
  };
  // const createChatRoom = async () => {
  //   "use server";
  //   const session = await getSession();
  //   console.log("Session:", session);
  
  //   if (!session) {
  //     return redirect("/login");
  //   }
  
  //   // 먼저 product를 가져옵니다.
  //   const product = await db.product.findUnique({
  //     where: { id: id },
  //   });
  //   console.log("Product:", product);
  //   if (!product) {
  //     throw new Error("제품을 찾을 수 없습니다.");
  //   }
  
  //   // product.userId와 session.id를 사용해 사용자 확인
  //   const [seller, buyer] = await Promise.all([
  //     db.user.findUnique({ where: { id: product.userId } }), // 판매자 확인
  //     db.user.findUnique({ where: { id: session.id } }),     // 구매자 확인
  //   ]);
  //   console.log("Seller:", seller);
  //   console.log("Buyer:", buyer);
  
  
  //   if (!seller || !buyer) {
  //     throw new Error("판매자 또는 구매자를 찾을 수 없습니다.");
  //   }
  
  //   // 채팅방 생성
  //   const room = await db.chatRoom.create({
  //     data: {
  //       productId: product.id,
  //       users: {
  //         connect: [
  //           { id: seller.id }, // 판매자 연결
  //           { id: buyer.id },  // 구매자 연결
  //         ],
  //       },
  //     },
  //     select: {
  //       id: true,
  //       productId: true,
  //     },
  //   });
  
  //   redirect(`/chats/${room.id}`);
  // };
  const createChatRoom = async (formData: FormData) => {
    "use server";
  
    const session = await getSession();
    console.log("Session:", session);
  
    if (!session) {
      return redirect("/login");
    }
  
    // FormData에서 `id` 추출
    const id = formData.get("id");
    console.log("Extracted Product ID from FormData:", id);
    if (!id || isNaN(Number(id))) {
      throw new Error("유효하지 않은 Product ID입니다.");
    }
  
    const numericId = Number(id);
  
    // Product 가져오기
    const product = await db.product.findUnique({
      where: { id: numericId },
    });
    console.log("Product:", product);
  
    if (!product) {
      throw new Error("제품을 찾을 수 없습니다.");
    }
  
    // 판매자 및 구매자 확인
    const [seller, buyer] = await Promise.all([
      db.user.findUnique({ where: { id: product.userId } }),
      db.user.findUnique({ where: { id: session.id } }),
    ]);
    console.log("Seller:", seller);
    console.log("Buyer:", buyer);
  
    if (!seller || !buyer) {
      throw new Error("판매자 또는 구매자를 찾을 수 없습니다.");
    }
  
    // 기존 채팅방 확인
    const existingChatRoom = await db.chatRoom.findFirst({
      where: {
        AND: [
          { productId: numericId },
          { users: { some: { id: buyer.id } } },
        ],
      },
    });
  
    if (existingChatRoom) {
      console.log("Existing Chat Room:", existingChatRoom);
      return redirect(`/chats/${existingChatRoom.id}`);
    }
  
    // 새로운 채팅방 생성
    const room = await db.chatRoom.create({
      data: {
        productId: numericId,
        users: {
          connect: [
            { id: seller.id },
            { id: buyer.id },
          ],
        },
      },
      select: {
        id: true,
        productId: true,
      },
    });
  
    console.log("New Chat Room Created:", room);
  
    return redirect(`/chats/${room.id}`);
  };
  return (
    <div className="pb-40">
      <div className="relative aspect-square">
        <Image
          className="object-cover"
          fill
          src={`${product.photo}/public`}
          alt={product.title}
        />
      </div>
      <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
        <div className="size-10 overflow-hidden rounded-full">
          {product.user.avatar !== null ? (
            <Image
              src={product.user.avatar}
              width={40}
              height={40}
              alt={product.user.username}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <h3>{product.user.username}</h3>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
      </div>
      <nav className="fixed bottom-[0px] left-0 right-0 mx-auto max-w-screen-md border-t border-neutral-600 bg-neutral-800">
    <div className="flex items-center justify-between px-6 py-3">
        <span className="font-semibold text-xl text-white">
            {formatToWon(product.price)}원
        </span>
        <div className="flex gap-2">
            {isOwner ? (
                <form action={revalidate}>
                    <button className="bg-red-500 px-4 py-2.5 rounded-md text-white text-sm font-medium hover:bg-red-600 transition-colors">
                        Revalidate title cache
                    </button>
                </form>
            ) : null}
            <form action={createChatRoom}>
            <input type="hidden" name="id" value={product?.id} />
                <button className="bg-orange-500 px-4 py-2.5 rounded-md text-white text-sm font-medium hover:bg-orange-600 transition-colors">
                    채팅하기
                </button>
            </form>
        </div>
    </div>
</nav>
    </div>
  );
}

export async function generateStaticParams() {
  const products = await db.product.findMany({
    select: {
      id: true,
    },
  });
  return products.map((product) => ({ id: product.id + "" }));
  
}