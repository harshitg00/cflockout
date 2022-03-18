import React from "react";
import Container from "@mui/material/Container";
import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import { Box, CssBaseline } from "@mui/material";
import CreateContest from "./pages/CreateContest";
import ContestArena from "./pages/ContestArena";

function App() {
  return (
    <>
      <CssBaseline />
      <NavBar />
      <Container maxWidth="sm" sx={{ padding: 8 }}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/contest/create" element={<CreateContest />} />
            <Route path="/contest/arena" element={<ContestArena />} />
          </Routes>
        </Router>
      </Container>
    </>
  );
}

export default App;
