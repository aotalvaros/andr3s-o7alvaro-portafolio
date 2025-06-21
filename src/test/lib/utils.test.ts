import { cn } from "@/lib/utils";
import { describe, expect, it } from "vitest";

describe("cn function", () => {
  it("should merge class names correctly", () => {
    const result = cn("class1", "class2", { "class3": true, "class4": false });
    expect(result).toBe("class1 class2 class3");
  });

  it("should handle empty inputs", () => {
    const result = cn();
    expect(result).toBe("");
  });

  it("should handle falsy values", () => {
    const result = cn("class1", null, undefined, "class2");
    expect(result).toBe("class1 class2");
  });

  it("should handle arrays of class names", () => {
    const result = cn(["class1", "class2"], { "class3": true });
    expect(result).toBe("class1 class2 class3");
  });
});