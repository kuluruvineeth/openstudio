const TINYBIRD_BASE_URL = process.env.TINYBIRD_BASE_URL;
const TINYBIRD_TOKEN = process.env.TINYBIRD_TOKEN;

if (!TINYBIRD_BASE_URL || !TINYBIRD_TOKEN) {
  throw new Error("Missing TINYBIRD_TOKEN");
}

async function deleteFromDatasource(
  datasource: string,
  deleteCondition: string, // eg. "ownerEmail='abc@gmail.com'"
): Promise<unknown> {
  const url = new URL(
    `/v0/datasources/${datasource}/delete`,
    TINYBIRD_BASE_URL,
  );

  let res = await fetch(url, {
    method: "POST",
    body: `delete_condition=(${deleteCondition})`,
    headers: {
      Authorization: `Bearer ${TINYBIRD_TOKEN}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!res.ok) {
    throw new Error(
      `Unable to delete for datasource ${datasource}: [${
        res.status
      }] ${await res.text()}`,
    );
  }

  return await res.json();
}

export async function deleteTinybirdComments(options: {
  ownerEmail: string;
}): Promise<unknown> {
  return await deleteFromDatasource(
    "comment",
    `ownerEmail='${options.ownerEmail}`,
  );
}

export async function deleteTinybirdAiCalls(options: {
  userId: string;
}): Promise<unknown> {
  return await deleteFromDatasource("aicall", `userId='${options.userId}`);
}
