/**
 * src/server.js
 * Sanctions Check Service
 *
 * - Exposes /health
 * - Exposes /dapr/subscribe for auto-subscribe to Dapr pub/sub
 * - Implements endpoint /aml/tx to receive messages from Dapr pubsub
 * - Performs a simple sanctions check and writes to Oracle table AML_RESULTS
 */

import express from "express";
import bodyParser from "body-parser";
import pino from "pino";
import dotenv from "dotenv";
import { execute } from "./oracle.js";

dotenv.config();
const log = pino({ level: process.env.LOG_LEVEL || "info" });

const PORT = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.json());

// Health
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "sanctions-check" });
});

/**
 * Dapr auto-subscribe endpoint.
 * Returns a JSON array of subscriptions that Dapr will use to subscribe
 * this app to pub/sub topics automatically when run with dapr.
 */
app.get("/dapr/subscribe", (req, res) => {
  // dapr will call this and register subscription
  return res.json([
    {
      pubsubname: process.env.DAPR_PUBSUB || "amlpubsub",
      topic: "aml.tx",
      route: "aml/tx"
    }
  ]);
});

/**
 * Main processing endpoint for aml.tx messages
 * Dapr will POST messages here when subscribing.
 *
 * Message schema expected (example):
 * {
 *   id: "tx-001",
 *   senderName: "Alice",
 *   receiverName: "Bob",
 *   amount: 1000,
 *   currency: "USD",
 *   country: "US",
 *   txDate: "2025-11-18T12:00:00Z",
 *   fileId: "file-123"
 * }
 */
app.post("/aml/tx", async (req, res) => {
  try {
    // Dapr wraps pubsub message; the actual data may be in req.body.data
    const payload = req.body.data ?? req.body;
    log.info({ payload }, "Received aml.tx message");

    const tx = payload;

    // Simple sanctions logic:
    // - treat presence of keywords as sanction match (example)
    const sanctionsKeywords = (process.env.SANCTIONS_KEYWORDS || "Blocked,Sanctioned,NSC").split(",");
    const senderLower = (tx.senderName || "").toLowerCase();
    const receiverLower = (tx.receiverName || "").toLowerCase();

    let sanctionsMatch = "NO";
    for (const kw of sanctionsKeywords) {
      const k = kw.trim().toLowerCase();
      if (!k) continue;
      if (senderLower.includes(k) || receiverLower.includes(k)) {
        sanctionsMatch = "YES";
        break;
      }
    }

    // Basic decision logic
    const decision = sanctionsMatch === "YES" ? "REJECT" : "REVIEW";

    // Insert or update AML_RESULTS
    // Adjust columns to match your schema
    const sql = `
      INSERT INTO AML_RESULTS (
        TX_ID, RISK_SCORE, SANCTIONS_MATCH, KYC_RISK, RULE_HIT, ML_SCORE, FINAL_DECISION, DECISION_REASON, CREATED_AT
      ) VALUES (
        :txid, :risk, :sanctions, :kyc, :rule, :ml, :final, :reason, SYSDATE
      )
    `;
    const binds = {
      txid: tx.id || tx.txId || null,
      risk: tx.riskScore ?? 0,
      sanctions: sanctionsMatch,
      kyc: tx.kycRisk ?? "UNKNOWN",
      rule: tx.ruleHit ?? null,
      ml: tx.mlScore ?? 0,
      final: decision,
      reason: tx.reason ?? (sanctionsMatch === "YES" ? "Sanctions keyword match" : "No sanctions match")
    };

    await execute(sql, binds);

    log.info({ txid: binds.txid, sanctionsMatch, decision }, "Processed transaction");

    // respond 200 to ack to Dapr
    res.status(200).json({ ok: true });
  } catch (err) {
    log.error({ err }, "Processing error");
    // returning non-200 will cause Dapr to retry (depending on pubsub config)
    res.status(500).json({ error: err.message || String(err) });
  }
});

// Start server
app.listen(PORT, () => {
  log.info(`Sanctions Check Service started on port ${PORT}`);
  log.info(`Dapr subscribe endpoint available at /dapr/subscribe`);
});
