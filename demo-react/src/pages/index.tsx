import { useState } from "react";
import { Comment } from "@/types.d";
import { products } from "@/mock/products.mock";
import ProductCard from "@/components/product-card";
import SimilarDrawer from "@/components/similar-drawer";

export default function Home() {
  const [similarDrawer, setSimilarDrawer] = useState<{
    isOpen: boolean;
    originalComment: Comment | null;
    similarComments: Comment[];
  }>({
    isOpen: false,
    originalComment: null,
    similarComments: [],
  });

  const handleShowSimilarComments = (current_comment: Comment, comments: Comment[]) => {
    setSimilarDrawer({
      isOpen: true,
      originalComment: current_comment,
      similarComments: comments,
    });
  };

  const handleCloseSimilarDrawer = () => {
    setSimilarDrawer({
      isOpen: false,
      originalComment: null,
      similarComments: [],
    });
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto py-3 px-2">
        <div className="text-center mb-8 flex items-center gap-4">
          <div className="text-3xl font-bold text-gray-900 mb-2">
            🛍️ سیستم نظرات محصولات
          </div>
          <div className="text-gray-600">مشاهده و مقایسه نظرات مشتریان</div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onShowSimilar={handleShowSimilarComments}
            />
          ))}
        </div>
      </div>

      <SimilarDrawer
        isOpen={similarDrawer.isOpen}
        originalComment={similarDrawer.originalComment}
        similarComments={similarDrawer.similarComments}
        onClose={handleCloseSimilarDrawer}
      />
    </div>
  );
}
