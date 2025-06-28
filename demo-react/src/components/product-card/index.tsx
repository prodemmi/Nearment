import { Product, Comment } from "@/types";
import StarRating from "./star-rating";
import FilterBadges from "./filter-badges";
import CommentSection from "./comment-section";
import { useEffect, useState } from "react";
import {
  findSameComments,
  findSameCommentsBySubject,
  getComments,
} from "@/lib/api/comment.api";
import { authors } from "@/mock/authors.mock";

interface ProductCardProps {
  product: Product;
  onShowSimilar: (current_comment: Comment, comments: Comment[]) => void;
}

const ProductCard = ({ product, onShowSimilar }: ProductCardProps) => {
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const handleShowSimilaromments = async (comment: Comment) => {
    const similar_comments = await findSameComments(comment.id);
    onShowSimilar(comment, similar_comments);
  };

  const handleToggleFilter = (filterKey: string | null) => {
    setActiveFilter(filterKey);
  };

  const handleAddComment = (productId: string, text: string) => {
    const newComment: Comment = {
      id: productId,
      text,
      author: "شما",
      timestamp: "الان",
      likes: 0,
      dislikes: 0,
      productId,
    };

    setComments((prev) => [newComment, ...prev]);
  };

  const fetchComments = async () => {
    setLoading(true);
    try {
      const allComments: Comment[] = [];

      const productComments = (
        activeFilter
          ? (await findSameCommentsBySubject(activeFilter, product.id)) ?? []
          : (await getComments(product.id)) ?? []
      ).map((comment: Comment) => ({
        ...comment,
        author: authors[Math.round(authors.length * Math.random())],
      }));

      allComments.push(...productComments);

      setComments(allComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => {
    fetchComments();
  }, [activeFilter]);

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="p-3 pb-2">
        <div className="flex gap-2">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            className="w-24 h-24 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {product.title}
            </h2>
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">
              {product.description}
            </p>
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center gap-1">
                <StarRating rating={product.rating} />
                <span className="text-sm text-gray-600 mr-1">
                  ({comments.length} نظر)
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-green-600">
                {product.price} تومان
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    {product.originalPrice}
                  </span>
                  <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                    {product.discount} تخفیف
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-3 pb-3">
        <FilterBadges
          productId={product.id}
          activeFilter={activeFilter}
          onToggleFilter={handleToggleFilter}
        />
        {loading ? (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">در حال بارگذاری...</p>
            </div>
          </div>
        ) : (
          <CommentSection
            productId={product.id}
            comments={comments}
            onAddComment={handleAddComment}
            onShowSimilar={handleShowSimilaromments}
          />
        )}
      </div>
    </div>
  );
};

export default ProductCard;
