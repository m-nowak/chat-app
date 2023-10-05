import {
  Box,
  Flex,
  Image,
  Skeleton,
  SkeletonCircle,
  Stack,
  WrapItem,
  Avatar,
  Text,
  AvatarBadge,
  useColorMode,
  useColorModeValue,
  Show,
  Hide,
} from "@chakra-ui/react";

import { GiConversation } from "react-icons/gi";
import MessageContainer from "../components/MessageContainer";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";

const HomePage = () => {
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [fetchingUsers, setFetchingUsers] = useState(true);
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const { socket, onlineUsers } = useSocket();
  const [users, setUsers] = useState([]);
  const bgColor = useColorModeValue("white", "gray.dark");
  const colorMode = useColorMode();

  useEffect(() => {
    const getUsers = async () => {
      if (!users) return;
      setFetchingUsers(true);
      try {
        const res = await fetch(
          `https://chat-app-api-tvkc.onrender.com/api/users/all`
        );
        const data = await res.json();
        const fData = data.filter((el) => el._id != currentUser._id);
        setUsers(fData);
      } catch (error) {
        showToast("Error", error.message, "error");
        setUsers([]);
      } finally {
        setFetchingUsers(false);
      }
    };

    getUsers();
  }, [showToast, setUsers]);

  useEffect(() => {
    socket?.on("messagesSeen", ({ conversationId }) => {
      setConversations((prev) => {
        const updatedConversations = prev.map((conversation) => {
          if (conversation._id === conversationId) {
            return {
              ...conversation,
              lastMessage: {
                ...conversation.lastMessage,
                seen: true,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
    });
  }, [socket, setConversations]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await fetch(
          "https://chat-app-api-tvkc.onrender.com/api/messages/conversations",
          {
            method: "GET",
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }

        setConversations(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoadingConversations(false);
      }
    };

    getConversations();
  }, [showToast]);

  const handleConversationSearch = (u) => {
    const conversationAlreadyExists = conversations.find(
      (conversation) => conversation.participants[0]._id === u._id
    );
    if (conversationAlreadyExists) {
      setSelectedConversation({
        _id: conversationAlreadyExists._id,
        userId: u._id,
        username: u.username,
        userProfilePic: u.profilePic,
      });
      return;
    }

    const mockConversation = {
      mock: true,
      lastMessage: {
        text: "",
        sender: "",
      },
      _id: Date.now(),
      participants: [
        {
          _id: u._id,
          username: u.username,
          profilePic: u.profilePic,
        },
      ],
    };

    setConversations((prev) => [...prev, mockConversation]);
    setSelectedConversation({
      _id: mockConversation._id,
      userId: u._id,
      username: u.username,
      userProfilePic: u.profilePic,
      mock: mockConversation.mock,
    });
  };

  return (
    <Box
      position={"absolute"}
      left={"50%"}
      w={{ base: "100%", md: "80%", lg: "750px" }}
      p={4}
      transform={"translateX(-50%)"}
    >
      <Flex
        gap={4}
        flexDirection={{ base: "column", md: "row" }}
        maxW={{
          sm: "400px",
          md: "full",
        }}
        mx={"auto"}
      >
        <Flex
          flex={30}
          gap={2}
          flexDirection={{ sm: "row", md: "column" }}
          maxW={{ sm: "250px", md: "full" }}
          mx={"auto"}
        >
          {loadingConversations &&
            [0, 1, 2, 3, 4].map((_, i) => (
              <Flex
                key={i}
                gap={4}
                alignItems={"center"}
                p={"1"}
                borderRadius={"md"}
              >
                <Box>
                  <SkeletonCircle size={"10"} />
                </Box>
                <Flex w={"full"} flexDirection={"column"} gap={3}>
                  <Skeleton h={"10px"} w={"80px"} />
                  <Skeleton h={"8px"} w={"90%"} />
                </Flex>
              </Flex>
            ))}

          {!loadingConversations &&
            users.map((u) => (
              <Flex
                key={u._id}
                gap={4}
                alignItems={"center"}
                p={"1"}
                _hover={{
                  cursor: "pointer",
                  bg: bgColor,
                }}
                user={u}
                bg={
                  selectedConversation?.username === u.username ? bgColor : ""
                }
                borderRadius={"full"}
                onClick={() => handleConversationSearch(u)}
              >
                <WrapItem>
                  <Avatar
                    name={u.username}
                    size={"md"}
                    bg={"white"}
                    src={u.profilePic}
                  >
                    {onlineUsers.includes(u._id) ? (
                      <AvatarBadge boxSize="1em" bg="green.500" />
                    ) : (
                      ""
                    )}
                  </Avatar>
                </WrapItem>
                <Show above="md">
                  <Box>
                    <Stack direction={"column"} fontSize={"sm"}>
                      <Text
                        fontWeight="700"
                        display={"flex"}
                        alignItems={"center"}
                      >
                        {u.username}{" "}
                        <Image src="/verified.png" w={4} h={4} ml={1} />
                      </Text>
                    </Stack>
                  </Box>
                </Show>
              </Flex>
            ))}
        </Flex>
        {!selectedConversation._id && (
          <Flex
            flex={70}
            borderRadius={"md"}
            p={2}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"400px"}
          >
            <GiConversation size={100} />
            <Text fontSize={20}>Select Super Hero to start messaging</Text>
          </Flex>
        )}

        {selectedConversation._id && <MessageContainer />}
      </Flex>
    </Box>
  );
};

export default HomePage;
