import { describe, expect, it } from "vitest";

import { buildGuestMap } from "./addGuests.handler";

describe("buildGuestMap", () => {
  it("keeps the first guest when base emails collide", () => {
    const first = { email: "alice+work@example.com", name: "Alice Work" };
    const second = { email: "alice+home@example.com", name: "Alice Home" };

    const guest = buildGuestMap([first, second]).get("alice@example.com");

    expect(guest).toBe(first);
  });

  it("deduplicates case-insensitively by base email", () => {
    const first = { email: "Alice@example.com", name: "First" };
    const second = { email: "alice+other@example.com", name: "Second" };

    const guest = buildGuestMap([first, second]).get("alice@example.com");

    expect(guest).toBe(first);
  });
});
