import { X } from "lucide-react";
import { Comment } from "@/types.d";
import { authors } from "@/mock/authors.mock";
import CommentItem from "../product-card/comment-item";

interface SimilarDrawerProps {
  isOpen: boolean;
  originalComment: Comment | null;
  similarComments: Comment[];
  onClose: () => void;
}

const SimilarDrawer = ({
  isOpen,
  originalComment,
  similarComments,
  onClose,
}: SimilarDrawerProps) => {
  if (!isOpen) return null;

  const newComments = similarComments?.map((comment) => ({
    ...comment,
    author: authors[Math.round(authors.length * Math.random())],
  })) ?? [];

  return (
    <>
      <div
        className="fixed inset-0 bg-black opacity-20 z-40"
        onClick={onClose}
      />
      <div className="fixed left-0 top-0 w-96 h-screen bg-white text-gray-800 shadow-xl z-50 transform transition-transform duration-300">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">نظرات مشابه</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm font-medium text-blue-800 mb-2">نظر اصلی:</p>
            <CommentItem comment={originalComment} onShowSimilar={() => {}} />
          </div>
          <div
            className="space-y-3 overflow-y-auto"
            style={{ height: "calc(100dvh - 316px)" }}
          >
          <p>نظرات مشابه</p>
            {newComments.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                نظر مشابهی یافت نشد
              </p>
            ) : (
              newComments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onShowSimilar={() => {}}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SimilarDrawer;
