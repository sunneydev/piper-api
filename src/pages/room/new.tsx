import { Loading, Text } from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Center } from "@components";

const Create = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const router = useRouter();
  const { data: session } = useSession();

  const handleRoomCreation = useCallback(() => {
    if (!session || !session.user) return;

    setLoading(true);

    fetch("/api/room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ownerId: session.user.id,
      }),
    })
      .then((res) => res.json())
      .then((data) => router.push(`/room/${data.id}`))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [router, session]);

  useEffect(() => {
    !loading && handleRoomCreation();
  }, [session]);

  return (
    <Center>
      {loading && <Loading size="xl" />}
      {error && <Text color={"error"}>{error}</Text>}
    </Center>
  );
};

export default Create;
