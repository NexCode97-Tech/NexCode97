"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

function revalidateDashboard() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/leads");
  revalidatePath("/dashboard/pipeline");
  revalidatePath("/dashboard/analytics");
}

export async function updateLeadStatus(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado");

  const id = formData.get("id") as string;
  const status = formData.get("status") as string;
  await prisma.lead.update({ where: { id }, data: { status } });
  revalidateDashboard();
}

export async function deleteLead(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado");

  const id = formData.get("id") as string;
  await prisma.lead.delete({ where: { id } });
  revalidateDashboard();
}

export async function changePassword(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("No autorizado");

  const current = formData.get("current") as string;
  const next = formData.get("next") as string;
  const confirm = formData.get("confirm") as string;

  if (!current || !next || !confirm) redirect("/dashboard/settings?pwd=campos");
  if (next !== confirm) redirect("/dashboard/settings?pwd=no-coincide");
  if (next.length < 8) redirect("/dashboard/settings?pwd=corta");

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) redirect("/dashboard/settings?pwd=error");

  const valid = await bcrypt.compare(current, user.hashedPassword);
  if (!valid) redirect("/dashboard/settings?pwd=actual-invalida");

  const hashedPassword = await bcrypt.hash(next, 12);
  await prisma.user.update({ where: { id: user.id }, data: { hashedPassword } });

  redirect("/dashboard/settings?pwd=ok");
}
