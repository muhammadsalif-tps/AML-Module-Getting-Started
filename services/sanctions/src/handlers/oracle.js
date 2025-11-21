/**
 * src/oracle.js
 * Oracle DB helper using oracledb
 *
 * Note: Make sure Oracle Instant Client is installed and environment variables set:
 *  - LD_LIBRARY_PATH (Linux)
 *  - DYLD_LIBRARY_PATH (macOS)
 *  - PATH (Windows)
 *
 * Also set env vars from .env file.
 */

import oracledb from "oracledb";
import dotenv from "dotenv";
dotenv.config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  connectString: process.env.DB_URL
};

// If you are using Oracle Instant Client and need to specify the lib dir:
// oracledb.initOracleClient({ libDir: process.env.ORACLE_CLIENT_LIB_DIR });

export async function getConnection() {
  return await oracledb.getConnection(dbConfig);
}

/**
 * Simple query helper.
 * Uses autoCommit for inserts/updates.
 */
export async function execute(sql, binds = [], options = { autoCommit: true }) {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(sql, binds, options);
    return result;
  } finally {
    if (conn) {
      try { await conn.close(); } catch (err) { /* ignore close error */ }
    }
  }
}
