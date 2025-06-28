const { pipeline, env, FeatureExtractionPipeline } = require('@huggingface/transformers');

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

/**
 * @returns {Promise<number[]>}
 */
async function generateVectorV2(text) {
  const embed = await loadModel();
  const result = await embed(text, { pooling: 'mean', normalize: true });
  return Array.from(result.data ?? []);
}

module.exports = {
  generateVectorV2,
};
