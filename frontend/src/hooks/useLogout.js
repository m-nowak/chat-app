import userAtom from "../atoms/userAtom";
import { useSetRecoilState } from "recoil";
import useShowToast from "./useShowToast";
import { selectedConversationAtom } from "../atoms/messagesAtom";

const useLogout = () => {
  const setUser = useSetRecoilState(userAtom);
  const setSelectedConversation = useSetRecoilState(selectedConversationAtom);
  const showToast = useShowToast();

  const logout = async () => {
    try {
      const res = await fetch(
        "https://chat-app-api-tvkc.onrender.com/api/users/logout",
        {
          method: "POST",
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

      localStorage.removeItem("user-data");
      setUser(null);
      setSelectedConversation({});
    } catch (error) {
      showToast("Error", error, "error");
    }
  };

  return logout;
};

export default useLogout;
