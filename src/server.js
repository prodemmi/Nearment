const { insertAsyncComment: insertIntoQdrant, findSameComments, findSameCommentsRelatedToSubject } = require('./services/qdrant');
const { insertComment, findAllComments } = require('./services/db');
const path = require('path');
const cors = require('cors');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const commentValidation = require('./validation/comment_validation');
const { generateVectorV2 } = require('./services/vector_generator');
const { generateSentimentLabelsWithAI } = require('./services/sentiment');

const app = express();

function startServer() {
    app.use(express.json());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(cors());

    app.get("/comments/:productId", async (req, res) => {
        try {
            const { productId } = req.params;
            const result = await findAllComments(productId);
            res.json({ data: result.rows });
        } catch (error) {
            res.status(500).json({ message: "failed to fetch comments", error: error?.message })
        }
    });

    app.post("/comments", async (req, res) => {
        const comment = req.body;

        if (!commentValidation(comment)) {
            return res.status(400).json({ error: "bad request." });
        }

        const { text, product_id } = comment;

        const id = uuidv4();
        const sentiment_params = await generateSentimentLabelsWithAI(text);
        const vector = await generateVectorV2(sentiment_params.sentiment_purpose);

        try {
            await insertComment(id, text, product_id, vector);
            const comment = { id, text, product_id, vector, sentiment_params };
            await insertIntoQdrant(comment);
            res.json({ message: "comment inserted." });
        } catch (error) {
            res.status(500).json({ message: "failed to insert comment", error: error?.message })
        }
    });

    app.get("/same.subject", async (req, res) => {
        const { subject, product_id } = req.query;
        try {
            const data = await findSameCommentsRelatedToSubject(subject, product_id);
            res.json({ data });
        } catch (error) {
            res.status(500).json({ message: "failed to find similar comments by subject", error: error?.message })
        }
    });

    app.get("/same.comments/:id", async (req, res) => {
        const { id } = req.params;
        try {
            const data = await findSameComments(id);
            res.json({ data });
        } catch (error) {
            res.status(500).json({ message: "failed to find similar comments", error: error?.message })
        }
    });

    app.listen(8000, console.error);
}

module.exports = startServer;