import { Box, CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { Dashboard } from "./components/Dashboard";
import { Header } from "./components/Header";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Header />
        <Dashboard />
      </Box>
    </QueryClientProvider>
  );
}

export default App;
