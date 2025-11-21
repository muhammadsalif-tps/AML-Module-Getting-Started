import { DaprClient } from "dapr-client";

const daprHost = "127.0.0.1";
const daprPort = process.env.DAPR_HTTP_PORT || 3500;

const client = new DaprClient(daprHost, daprPort);

export async function publishFileUploaded(data) {
  console.log("Publishing aml.file.uploaded event:", data);

  await client.pubsub.publish(
    "amlpubsub",
    "aml.file.uploaded",
    data
  );
}
