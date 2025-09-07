import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Forget from "./pages/Forget";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import Partner from "./pages/Partner";
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import Movie from "./pages/Movie";
import BookShow from "./pages/BookShow";
import Reset from "./pages/Reset";
import { App as AntApp, ConfigProvider } from "antd";


function App() {
  return (
    <div>
      <Provider store={store}>
        <ConfigProvider
          theme={{
            components: {
              Message: {
                zIndexPopup: 9999, // Higher than loader z-index
              },
            },
          }}
        >
          <AntApp>
            <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/movies/:movieId"
              element={
                <ProtectedRoute>
                  <Movie />
                </ProtectedRoute>
              }
            />
            <Route
              path="/book-show/:showId"
              element={
                <ProtectedRoute>
                  <BookShow />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/partner"
              element={
                <ProtectedRoute>
                  <Partner />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forget" element={<Forget />} />
            <Route path="/reset" element={<Reset />} />
          </Routes>
            </BrowserRouter>
          </AntApp>
        </ConfigProvider>
      </Provider>
    </div>
  );
}

export default App;