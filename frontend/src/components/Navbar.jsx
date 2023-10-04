import { Button, Flex, useColorMode, Avatar } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const logout = useLogout();

  return (
    <Flex justifyContent={"space-between"} mt={6} mb="12">
      <Button size={"xs"} p="20px" onClick={toggleColorMode}>
        {colorMode === "dark" ? (
          <SunIcon w={6} h={6} color="white" />
        ) : (
          <MoonIcon w={6} h={6} color="black" />
        )}
      </Button>
      {user && (
        <Flex alignItems={"center"} gap={4}>
          <Avatar
            name={user.username}
            src={user.profilePic}
            size={"sm"}
            bg={"white"}
          />
          <Button size={"xs"} p="20px" onClick={logout}>
            <FiLogOut size={20} />
          </Button>
        </Flex>
      )}{" "}
    </Flex>
  );
};

export default Navbar;
