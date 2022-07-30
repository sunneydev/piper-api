import type { NextPage } from "next";
import { CreateRoomButton } from "../components";
import { Button, Card, Grid, Spacer, Text, Tooltip, User } from "@nextui-org/react";
import { signIn, useSession } from "next-auth/react";
import { Center, Search } from "@components";
import { useMemo } from "react";

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  const authenticated = useMemo(() => status === "authenticated", [status]);

  return (
    <Center>
      <div className="flex flex-col">
        <Search />
        <Card css={{ p: "$4" }}>
          <Card.Header>
            <Grid.Container css={{ pl: "$6" }}>
              <Grid xs={12}>
                <Text h4 css={{ lineHeight: "$xs" }}>
                  Welcome back,
                </Text>
              </Grid>
              <Grid xs={12}>
                <Text css={{ color: "$accents8" }}>authenticated as</Text>
              </Grid>
            </Grid.Container>
          </Card.Header>
          <Card.Body css={{ pb: "$6", pt: "$1" }}>
            <User name={session?.user?.name} src={session?.user?.image || ""} />
          </Card.Body>
        </Card>

        {!authenticated && (
          <Button color={"gradient"} size={"xl"} onClick={() => signIn("discord")}>
            Login with Discord
          </Button>
        )}
        <Spacer y={1} />
        <CreateRoomButton authenticated={authenticated} />
      </div>
    </Center>
  );
};

export default Home;
