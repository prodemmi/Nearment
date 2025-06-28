import { Comment } from "@/types.d";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import CommentItem from "./comment-item";

interface CommentSectionProps {
  productId: string;
  comments: Comment[];
  onAddComment: (productId: string, text: string) => void;
  onShowSimilar: (comment: Comment) => void;
}

const CommentSection = ({
  productId,
  comments,
  onAddComment,
  onShowSimilar,
}: CommentSectionProps) => {
  const [newCommentText, setNewCommentText] = useState("");

  const handleAddComment = () => {
    if (newCommentText.trim()) {
      onAddComment(productId, newCommentText.trim());
      setNewCommentText("");
    }
  };

  return (
    <div>
      <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>هیچ نظری یافت نشد</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              showSimilarButton
              onShowSimilar={onShowSimilar}
            />
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="نظر خود را بنویسید..."
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleAddComment();
            }
          }}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddComment}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          ارسال
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
