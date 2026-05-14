import { redirect } from "next/navigation";

export default function HostPinRedirect({
  params,
  searchParams,
}: {
  params: { pin: string };
  searchParams: { mode?: string };
}) {
  const qs = searchParams.mode ? `?mode=${searchParams.mode}` : "";
  redirect(`/graj/host/${params.pin}${qs}`);
}
