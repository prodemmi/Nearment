const tf = require('@tensorflow/tfjs');
const use = require('@tensorflow-models/universal-sentence-encoder');
const { pipeline, env, FeatureExtractionPipeline, Tensor } = require('@huggingface/transformers');

const resolvePath = (filename) => "http://localhost:8000/models/universal-sentence-encoder/" + filename;

env.backends.onnx = "wasm-node";
let embedModel = null;

/**
 * @returns {Promise<FeatureExtractionPipeline>}
 */
async function loadModel() {
  if (!embedModel) {
    embedModel = await pipeline('feature-extraction', 'Xenova/paraphrase-multilingual-MiniLM-L12-v2');
  }
  return embedModel;
}

async function generateVector(input) {
  const model = await use.load({
    modelUrl: resolvePath("model.json"),
    vocabUrl: resolvePath("vocab.json"),
  });

  const embeddings = await model.embed(input);
  const vectors = await embeddings.array();

  return vectors[0];
}

/**
 * @returns {Promise<number[]>}
 */
async function generateVectorV2(text) {
  const embed = await loadModel();
  const result = await embed(text, { pooling: 'mean', normalize: true });
  return Array.from(result.data ?? []);
}

module.exports = {
  generateVector,
  generateVectorV2,
};
