import {
  Flex,
  Box,
  Stack,
  Heading,
  useColorModeValue,
  Spinner,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import useShowToast from "../hooks/useShowToast";
import usersAtom from "../atoms/usersAtom";
import User from "./User";

export default function AllUsers() {
  const [users, setUsers] = useRecoilState(usersAtom);
  const [fetchingUsers, setFetchingUsers] = useState(true);

  const showToast = useShowToast();

  useEffect(() => {
    const getUsers = async () => {
      if (!users) return;
      setFetchingUsers(true);
      try {
        const res = await fetch(`/api/users/all`);
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setUsers([]);
      } finally {
        setFetchingUsers(false);
      }
    };

    getUsers();
  }, [showToast, setUsers]);

  return (
    <Flex align={"center"} justify={"center"}>
      <Stack
        spacing={8}
        mx={"auto"}
        w={{
          base: "full",
          sm: "400px",
        }}
        maxW={"lg"}
        py={6}
      >
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Login
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.dark")}
          boxShadow={"lg"}
          p={3}
          w={{
            base: "full",
            sm: "400px",
          }}
        >
          <Stack spacing={1}>
            {!fetchingUsers && users.length === 0 && <h1>No users</h1>}
            {fetchingUsers && (
              <Flex justifyContent={"center"} my={12}>
                <Spinner size={"xl"} />
              </Flex>
            )}

            {users.map((u) => (
              <User key={u._id} user={u} />
            ))}
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
