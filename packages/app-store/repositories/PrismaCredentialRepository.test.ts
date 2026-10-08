import { describe, expect, it, vi } from "vitest";

vi.mock("@calcom/prisma", () => ({ prisma: {} }));

import { PrismaCredentialRepository } from "./PrismaCredentialRepository";

describe("PrismaCredentialRepository", () => {
  it("preserves delegation fields when loading credentials for a user", async () => {
    const findMany = vi.fn().mockResolvedValue([
      {
        id: 1,
        delegationCredentialId: "delegation-credential",
        delegatedTo: "user-credential",
        delegatedToId: "user-credential-id",
      },
    ]);

    const repository = new PrismaCredentialRepository({
      credential: { findMany },
    } as never);

    const credentials = await repository.findCredentialsByAppCategories({
      idToSearchObject: { userId: 1 },
      appCategories: [],
    });

    expect(credentials[0]).toMatchObject({
      delegationCredentialId: "delegation-credential",
      delegatedTo: "user-credential",
      delegatedToId: "user-credential-id",
    });
  });

  it("removes delegation fields for team location credentials", async () => {
    const findMany = vi.fn().mockResolvedValue([
      {
        id: 1,
        delegationCredentialId: "delegation-credential",
        delegatedTo: "user-credential",
        delegatedToId: "user-credential-id",
      },
    ]);

    const repository = new PrismaCredentialRepository({
      credential: { findMany },
    } as never);

    const credentials = await repository.findNonDelegationCredentialsByAppCategories({
      idToSearchObject: { teamId: 1 },
      appCategories: [],
    });

    expect(credentials[0]).toMatchObject({
      delegationCredentialId: null,
      delegatedTo: null,
      delegatedToId: null,
    });
  });
});
