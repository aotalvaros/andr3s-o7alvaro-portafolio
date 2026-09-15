import { cn, getInitials } from "@/lib/utils";
import { canAccessAdminView, getDefaultAdminView } from "@/components/sections/admin/access/adminAccess";
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

describe("getInitials", () => {
  it("should return the first letters of up to two words", () => {
    expect(getInitials("Andrés Otalvaro")).toBe("AO");
    expect(getInitials("María José Gómez")).toBe("MJ");
  });

  it("should handle extra spaces and empty values safely", () => {
    expect(getInitials("   Ana   López   ")).toBe("AL");
    expect(getInitials(" ")).toBe("");
  });
});

describe("admin access helpers", () => {
  it("should default to profile when the password must be changed", () => {
    expect(getDefaultAdminView({ mustChangePassword: true })).toBe("profile");
    expect(getDefaultAdminView({ mustChangePassword: false })).toBe("overview");
    expect(getDefaultAdminView(null)).toBe("overview");
  });

  it("should only allow profile while password change is required", () => {
    const user = { mustChangePassword: true };
    expect(canAccessAdminView(user, "profile")).toBe(true);
    expect(canAccessAdminView(user, "overview")).toBe(false);
    expect(canAccessAdminView(user, "modules")).toBe(false);

    expect(canAccessAdminView({ mustChangePassword: false }, "modules")).toBe(true);
  });
});