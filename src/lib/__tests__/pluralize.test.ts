import { pluralize } from "@/lib/pluralize";

describe("pluralize", () => {
  it("returns specified string for cardinality", () => {
    expect(pluralize(1, { 1: "item", default: "default" })).toEqual("item");
  });

  it("interpolates count into string", () => {
    expect(pluralize(1, { 1: "{count} item", default: "default" })).toEqual(
      "1 item"
    );
  });

  it("falls back to default if can't find cardinality", () => {
    expect(pluralize(2, { 1: "item", default: "default" })).toEqual("default");
  });
});
