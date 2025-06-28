require('dotenv').config();
const { generateVectorV2 } = require('./services/vector_generator');
const { generateSentimentLabelsWithAI } = require('./services/sentiment');

const text = "کیفیت افتضاح بود، نخرید!";

async function test() {
    const vector = await generateVectorV2(text);
    console.log(vector.length, vector);

    // const sentiment_params = await generateSentimentLabelsWithAI(text);
    // console.log(sentiment_params)
}

test();
