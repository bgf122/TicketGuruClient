import React, { createContext, useReducer, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navigator from "./components/Navigointi/Navigator";
import Login from "./components/Navigointi/Login";

export const AuthContext = createContext();

const initialState = {
  isAuthenticated: false,
  user: null,
  // token = null, // varaus JWT-tokenille
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      window.localStorage.setItem("user", JSON.stringify(action.payload.user));

      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        //token: action.payload.token
      };
    case "LOGOUT":
      window.localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        // token: null
      };
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const user = JSON.parse(window.localStorage.getItem("user") || null);

    // const token = JSON.parse(localStorage.getItem('token') || null)

    if (user) {
      dispatch({
        type: "LOGIN",
        payload: {
          user,
        },
      });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      <div className="App">
        {!state.isAuthenticated ? <Login /> : <Navigator />}
      </div>
    </AuthContext.Provider>
  );
}
export default App;
