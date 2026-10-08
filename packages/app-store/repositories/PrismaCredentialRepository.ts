import { buildNonDelegationCredentials } from "@calcom/lib/delegationCredential";
import { prisma } from "@calcom/prisma";
import type { Prisma } from "@calcom/prisma/client";
import type { AppCategories } from "@calcom/prisma/client";
import { credentialForCalendarServiceSelect } from "@calcom/prisma/selects/credential";

type FindCredentialsArgs = {
  idToSearchObject: Prisma.CredentialWhereInput;
  appCategories: AppCategories[];
};

export class PrismaCredentialRepository {
  constructor(private readonly prismaClient: typeof prisma) {}

  private async findCredentialsByAppCategories({ idToSearchObject, appCategories }: FindCredentialsArgs) {
    return await this.prismaClient.credential.findMany({
      where: {
        ...idToSearchObject,
        app: {
          categories: {
            hasSome: appCategories,
          },
        },
      },
      select: {
        ...credentialForCalendarServiceSelect,
        team: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async findCredentialsByAppCategories(args: FindCredentialsArgs) {
    return await this.findCredentialsByAppCategories(args);
  }

  async findNonDelegationCredentialsByAppCategories(args: FindCredentialsArgs) {
    const credentials = await this.findCredentialsByAppCategories(args);
    return buildNonDelegationCredentials(credentials);
  }
}
