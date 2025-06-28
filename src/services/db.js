const util = require('util');
const cassandra = require('cassandra-driver');

let db;

const keyspace = process.env["KEYSPACE"];
const table = process.env["KEYSPACE"] + "." + process.env["CASSANDRA_TABLE"];
const replication_class = process.env["CASSANDRA_REPLICATION_CLASS"];
const replication_factor = process.env["CASSANDRA_REPLICATION_FACTOR"];

async function connectDB() {
    db = new cassandra.Client({
        contactPoints: ['127.0.0.1'],
        localDataCenter: 'datacenter1'
    });

    try {
        await db.connect();
        console.info("Cassandra client connected successfully.");
    } catch (error) {
        throw new Error(util.format("Cassandra client not connected:\n%s", error));
    }

    try {
        const keyspaceCQL = util.format(`
            CREATE KEYSPACE IF NOT EXISTS %s 
            WITH replication = {'class': '%s', 'replication_factor': %d};
        `, keyspace, replication_class, replication_factor)
        await db.execute(keyspaceCQL);

        const tableCQL = util.format(`
            CREATE TABLE IF NOT EXISTS %s (
                id UUID PRIMARY KEY,
                product_id TEXT,
                text TEXT,
                vector VECTOR<FLOAT, 384>
            );
        `, table)
        await db.execute(tableCQL);

        const indexCQL = util.format(`
            CREATE INDEX IF NOT EXISTS %s_index ON %s(vector) USING 'sai';
        `, keyspace, table);
        await db.execute(indexCQL);
    } catch (error) {
        console.error(util.format("Failed to initialize DB:\n%s", error));
        process.exit(1);
    }
}

async function insertComment(id, text, product_id, vector) {
    const castVectorType = new cassandra.types.Vector(vector);

    const insertCQL = util.format(`
            INSERT INTO %s (id, text, product_id, vector)
            VALUES (?, ?, ?, ?);
        `, table);

    await db.execute(insertCQL, [id, text, product_id, castVectorType], { prepare: true });
}

async function findAllComments(product_id = undefined) {
    let CQL = ``;
    if (product_id) {
        CQL = util.format(`
        SELECT id, product_id, text FROM %s WHERE product_id = '%s' ALLOW FILTERING;
    `, table, product_id);
    } else {
        CQL = util.format(`
        SELECT id, product_id, text FROM %s;
    `, table);
    }
    return await db.execute(CQL);
}

process.on("SIGINT", async () => {
    if (db) {
        console.info("Disconnecting Cassandra...");
        await db.shutdown();
        process.exit(0);
    }
});

process.on("SIGTERM", async () => {
    if (db) {
        console.info("Disconnecting Cassandra...");
        await db.shutdown();
        process.exit(0);
    }
});

module.exports = {
    connectDB,
    db,
    insertComment,
    findAllComments,
};
