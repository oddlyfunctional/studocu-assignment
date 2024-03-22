import { translate } from "@/i18n/i18n";

describe("i18n", () => {
  describe("translate", () => {
    const t = translate({
      key: "value",
      keyWithParam: "here is {param} value",
    });

    it("translates key to value in dictionary", () => {
      expect(t("key")).toEqual("value");
    });

    it("replaces param in translation", () => {
      expect(t("keyWithParam", { param: "my" })).toEqual("here is my value");
    });

    it("falls back to key value", () => {
      expect(t("invalidKey")).toEqual("invalidKey");
    });
  });
});
