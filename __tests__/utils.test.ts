import { reverse } from "../src/util";

describe("Utility function reverse()", () => {
  it("should reverse a string", () => {
    expect(reverse("hello")).toEqual("olleh");
  });
});
