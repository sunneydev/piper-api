import { Tooltip, Button, Link } from "@nextui-org/react";

const CreateRoomButton: React.FC<{
  authenticated: boolean;
}> = ({ authenticated }) => {
  if (!authenticated) {
    return (
      <Tooltip color={"error"} content="You need to be authenticated to create a room">
        <Button disabled={true} size={"xl"}>
          Create a room
        </Button>
      </Tooltip>
    );
  }

  return (
    <Link href={"/room/new"}>
      <Button size={"xl"} color="gradient">
        Create a room
      </Button>
    </Link>
  );
};

export { CreateRoomButton };
