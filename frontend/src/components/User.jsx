import {
  Flex,
  Box,
  Text,
  Avatar,
  Center,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";

export default function User({ user }) {
  const setUser = useSetRecoilState(userAtom);
  const [loading, setLoading] = useState(false);

  const showToast = useShowToast();

  const handleLogin = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `https://chat-app-api-tvkc.onrender.com/api/users/login`,
        {
          method: "POST",
          mode: "cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: user.username, password: "123456" }),
        }
      );
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      localStorage.setItem("user-data", JSON.stringify(data));
      setUser(data);
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      justifyContent={"space-between"}
      w={"full"}
      _hover={{ bg: useColorModeValue("gray.100", "black") }}
      p={3}
      cursor={"pointer"}
      rounded={"md"}
      onClick={handleLogin}
    >
      <Box>
        <Text fontSize={{ base: "md", md: "xl" }} fontWeight={"bold"}>
          {user.name}
        </Text>
        <Flex alignItems={"center"}>
          <Text fontSize={"sm"} color={"gray.light"} borderRadius={"full"}>
            {user.username}
          </Text>
        </Flex>
      </Box>
      <Center>
        <Box>
          <Avatar
            name={user.name}
            src={user.profilePic}
            size={{
              base: "sm",
              md: "md",
            }}
            bg="gray.100"
          />
        </Box>
      </Center>
    </Flex>
  );
}
