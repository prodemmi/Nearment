import { Comment } from "@/types.d";
import { ThumbsDown, ThumbsUp } from "lucide-react";

interface CommentItemProps {
  comment: Comment | null;
  onShowSimilar: (comment: Comment) => void;
  showSimilarButton?: boolean;
}

const CommentItem = ({
  comment,
  onShowSimilar,
  showSimilarButton = false,
}: CommentItemProps) => {
  if (!comment) return null;
  return (
    <div className="bg-white border rounded-lg p-2 hover:shadow-sm transition-shadow">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
          {comment.author?.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-medium text-gray-900">{comment.author}</h4>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{comment.timestamp}</span>
              </div>
            </div>
            {showSimilarButton && (
              <button
                onClick={() => onShowSimilar(comment)}
                className="px-3 py-1 text-xs text-black cursor-pointer border border-gray-300 rounded-md hover:bg-gray-50"
              >
                نظرات مشابه
              </button>
            )}
          </div>
          <p className="text-gray-700 leading-relaxed mb-3">{comment.text}</p>
          <div className="flex items-center gap-4 text-sm">
            <button className="flex items-center gap-1 text-gray-500 hover:text-green-600">
              <ThumbsUp className="w-4 h-4" />
              {comment.likes}
            </button>
            <button className="flex items-center gap-1 text-gray-500 hover:text-red-600">
              <ThumbsDown className="w-4 h-4" />
              {comment.dislikes}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
