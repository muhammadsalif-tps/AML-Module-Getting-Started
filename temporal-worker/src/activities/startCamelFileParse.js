import fetch from "node-fetch";

export async function startCamelFileParse(fileId) {
  await fetch(`http://camel-service:8080/parse-file/${fileId}`, {
    method: "POST"
  });
  return { ok: true };
}
