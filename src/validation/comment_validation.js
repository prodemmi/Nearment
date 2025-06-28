function CommentValidation(comment) {
    return !(!comment || !comment.text || !comment.product_id)
}

module.exports = CommentValidation;