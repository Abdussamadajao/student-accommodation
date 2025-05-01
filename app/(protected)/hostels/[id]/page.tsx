import { HostelDetailsPage } from "@/sections";

export default async function HostelRoomsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  return <HostelDetailsPage id={id} />;
}
