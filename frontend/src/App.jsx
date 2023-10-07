import { Box, Container } from "@chakra-ui/react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";

function App() {
  const user = useRecoilValue(userAtom);
  const { pathname } = useLocation();
  return (
    <Box position={"relative"} w="full">
      <Container maxW={"full"}>
        <Navbar />
        <Routes>
          <Route index element={<AuthPage />} />
          <Route
            path="chat"
            element={user ? <HomePage /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="auth"
            element={!user ? <AuthPage /> : <Navigate to="/chat" replace />}
          />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
