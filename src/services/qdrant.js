const util = require('util');
const { generateVectorV2 } = require('./vector_generator');
const { QdrantClient } = require('@qdrant/js-client-rest');

let qdrant;

const COLLECTION_NAME = util.format("%s_vectors", process.env["KEYSPACE"]);
let CONCEPT_VECTORS = {};

async function initConceptVectors() {
    CONCEPT_VECTORS = {
        good: await generateVectorV2([
            "رضایت از خرید یا توصیه برای خرید",
            "ارسال سریع یا به موقع",
            "محصول اصل یا با کیفیت",
            "تجربه خوب یا عالی",
            "بسته‌بندی سالم یا حرفه‌ای",
            "پشتیبانی خوب یا حرفه‌ای",
        ].join("، ")),

        bad: await generateVectorV2([
            "نارضایتی از خرید یا توصیه نکردن",
            "ارسال دیر یا نامنظم",
            "محصول فیک یا بی‌کیفیت",
            "تجربه بد یا ناراحت‌کننده",
            "بسته‌بندی آسیب‌دیده یا نامناسب",
            "پشتیبانی بد یا غیرحرفه‌ای",
        ].join("، "))
    };
}

// Define your sentiment ranges
const NEUTRAL_THRESHOLD = 2.0;

async function startQdrant() {
    qdrant = new QdrantClient({ url: 'http://127.0.0.1:6333' });
    try {
        const collections = await qdrant.getCollections();
        if (!collections.collections.some((coll) => coll.name === COLLECTION_NAME)) {
            await qdrant.createCollection(COLLECTION_NAME, {
                vectors: {
                    size: 384,
                    distance: "Cosine"
                },
                optimizers_config: {
                    default_segment_number: 2,
                },
                payload_schema: {
                    text: {
                        type: "text",
                        tokenizer: "word",
                        min_token_len: 2,
                        max_token_len: 200,
                        lowercase: true
                    },
                    sentiment_purpose: {
                        type: "text",
                        tokenizer: "word",
                        min_token_len: 2,
                        max_token_len: 200,
                        lowercase: true
                    },
                }
            });
        }
    } catch (error) {
        throw new Error(util.format("qdrant client not connected with error: \n%s", error));
    }

    try {
        await initConceptVectors();
    } catch (error) {
        throw new Error(util.format("failed to init concept vectors with error: \n%s", error));
    }

    console.info("qdrant client connected succesfully.");
}

function _createSentimentFilters(sentimentComparative) {
    let sentimentFilter;
    if (Math.abs(sentimentComparative) <= NEUTRAL_THRESHOLD) {
        sentimentFilter = {
            key: "sentiment_comparative",
            range: { gte: -NEUTRAL_THRESHOLD, lte: NEUTRAL_THRESHOLD }
        };
    } else if (sentimentComparative > 0) {
        sentimentFilter = {
            key: "sentiment_comparative",
            range: { gte: NEUTRAL_THRESHOLD, lte: sentimentComparative }
        };
    } else {
        sentimentFilter = {
            key: "sentiment_comparative",
            range: { gte: sentimentComparative, lte: -NEUTRAL_THRESHOLD }
        };
    }
    return sentimentFilter;
}

let timeout;
async function insertAsyncComment(comment) {
    if (timeout) clearTimeout(timeout);
    const payload = { ...comment };
    delete payload.vector;
    delete payload.sentiment_params;
    try {
        qdrant.upsert(COLLECTION_NAME, {
            points: [
                {
                    id: comment.id,
                    vector: comment.vector,
                    payload: {
                        ...payload,
                        ...comment.sentiment_params,
                    }
                }
            ]
        });
    } catch (error) {
        timeout = setTimeout(() => insertAsyncComment(comment), 500);
    }
}

async function findSameComments(comment_id) {
    const result = await qdrant.retrieve(COLLECTION_NAME, {
        ids: [comment_id],
        with_payload: true,
        with_vector: true,
    });

    if (!result?.length) return null;

    const queryVector = result[0].vector;
    const payload = result[0].payload;
    const product_id = payload.product_id;
    const sentimentComparative = payload.sentiment_comparative;

    const sentimentFilter = _createSentimentFilters(sentimentComparative);

    const searchResult = await qdrant.search(COLLECTION_NAME, {
        vector: queryVector,
        score_threshold: 0.65,
        with_payload: true,
        with_vector: false,
        filter: {
            must: [
                { key: "product_id", match: { value: product_id } },
                sentimentFilter
            ]
        },
    });

    return searchResult
        .filter(c => c.id !== comment_id)
        .map(c => ({
            id: c.id,
            text: c.payload.text,
        }));
}

async function findSameCommentsRelatedToSubject(related_text, product_id) {
    const conceptVector = CONCEPT_VECTORS[related_text];
    if (!conceptVector || !conceptVector.length) {
        return [];
    }
    const searchResult = await qdrant.search(COLLECTION_NAME, {
        vector: conceptVector,
        score_threshold: 0,
        with_payload: true,
        with_vector: false,
        filter: {
            must: [
                { key: "product_id", match: { value: product_id } }
            ]
        }
    });

    return searchResult.map(c => ({
        id: c.id,
        text: c.payload.text,
    }));
}

module.exports = {
    startQdrant,
    insertAsyncComment,
    findSameComments,
    findSameCommentsRelatedToSubject,
};

["SIGINT", "SIGTERM"].forEach(() => {
    if (qdrant) {
        console.info("disconnecting qdrant...");
        delete qdrant;
    }
});
