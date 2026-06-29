import { getPrisma } from "./prisma";

export type AddressInput = {
  label: string;
  address: string;
  city: string;
  pincode: string;
  lat?: number;
  lng?: number;
  isDefault?: boolean;
};

export async function getAddresses(userId: string) {
  const prisma = getPrisma();
  return prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }]
  });
}

export async function getAddressById(id: string, userId: string) {
  const prisma = getPrisma();
  return prisma.address.findFirst({
    where: { id, userId }
  });
}

export async function createAddress(userId: string, input: AddressInput) {
  const prisma = getPrisma();

  if (input.isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false }
    });
  }

  return prisma.address.create({
    data: {
      userId,
      label: input.label,
      address: input.address,
      city: input.city,
      pincode: input.pincode,
      lat: input.lat ?? null,
      lng: input.lng ?? null,
      isDefault: input.isDefault ?? false
    }
  });
}

export async function updateAddress(id: string, userId: string, input: Partial<AddressInput>) {
  const prisma = getPrisma();

  if (input.isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false }
    });
  }

  return prisma.address.updateMany({
    where: { id, userId },
    data: {
      label: input.label,
      address: input.address,
      city: input.city,
      pincode: input.pincode,
      lat: input.lat ?? undefined,
      lng: input.lng ?? undefined,
      isDefault: input.isDefault
    }
  });
}

export async function deleteAddress(id: string, userId: string) {
  const prisma = getPrisma();
  return prisma.address.deleteMany({
    where: { id, userId }
  });
}
