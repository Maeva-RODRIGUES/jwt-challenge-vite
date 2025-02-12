import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.tsx";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import Home from "./components/Home.tsx";
import Login from "./components/auth/Login.tsx";
import Register from "./components/auth/Register.tsx";
import ListBooks from "./components/ListBooks.tsx";
import CreateBook from "./components/CreateBook.tsx";
import Logout from "./components/auth/Logout.tsx";

export const client = new ApolloClient({
  cache: new InMemoryCache({
    addTypename: false,
  }),
  credentials: "include",  
  uri: "http://localhost:4005",
});

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      { path: "/auth/login", element: <Login /> },
      { path: "/auth/register", element: <Register /> },
      { path: "/auth/logout", element: <Logout /> },
      { path: "/books/list", element: <ListBooks /> },
      { path: "/books/create", element: <CreateBook /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={client}>
    <RouterProvider router={router} />
  </ApolloProvider>
);
