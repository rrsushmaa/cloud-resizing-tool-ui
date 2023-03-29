import {useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import './App.css'
import {Dashboard} from "./components/Dashboard";

const queryClient = new QueryClient()

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Dashboard/>
        </QueryClientProvider>
    )
}

export default App
