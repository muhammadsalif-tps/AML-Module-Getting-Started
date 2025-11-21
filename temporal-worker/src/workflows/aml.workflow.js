import { proxyActivities } from "@temporalio/workflow";

const { startCamelFileParse, storeResults } = proxyActivities({
  startToCloseTimeout: "10 minutes"
});

export async function AMLWorkflow(fileId) {
  // Step 1: Ask Camel to parse the file
  await startCamelFileParse(fileId);

  // Step 2: Camel publishes `aml.tx` events via Dapr → services process transactions

  // Step 3: Store aggregated results
  await storeResults(fileId);

  return `AML workflow completed for file: ${fileId}`;
}
