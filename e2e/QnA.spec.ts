import { expect, test } from "@playwright/test";

test("adding question", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Question", { exact: true }).fill("New question");
  await page.getByLabel("Answer").fill("New answer");
  await page.getByRole("button", { name: "Create question" }).click();
  await page.reload();
  const list = page.getByRole("list");
  await list.getByText("New question", { exact: true }).click();

  expect(await page.getByRole("definition").textContent()).toEqual(
    "New answer"
  );
});
