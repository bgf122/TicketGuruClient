import React, { useContext, useState } from "react";

import { AuthContext } from "../../App";
import axios from "axios";

export const Login = () => {
  const { dispatch } = useContext(AuthContext);
  const initialState = {
    username: "",
    password: "",
    isSubmitting: false,
    errorMessage: null,
  };

  const [data, setData] = useState(initialState);

  const handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setData({
      ...data,
      isSubmitting: true,
      errorMessage: null,
    });

    axios
      .get(
        `https://ticketguru-app.herokuapp.com/api/users/search/findByUsername?username=${data.username}`,
        {
          auth: {
            username: data.username,
            password: data.password,
          },
        }
      )

      .then((response) => {
        let cred = {};
        if (response.status === 200) {
          cred = {
            user: {
              token: "Basic " + btoa(`${data.username}:${data.password}`),
              link: response.data._links.self.href,
            },
          };
        } else {
          setData({
            ...data,
            isSubmitting: false,
            errorMessage: "Väärä käyttäjätunnus tai salasana!",
          });
        }

        dispatch({
          type: "LOGIN",
          payload: cred,
        });
      })

      .catch((error) => {
        setData({
          ...data,
          isSubmitting: false,
          errorMessage: "Käyttäjätunnus tai salasana väärä!-+",
        });
      });
  };

  return (
    <div className="container">
      <form onSubmit={handleFormSubmit}>
        <h1>Login</h1>
        <div className="form-group">
          <label htmlFor="username">
            Käyttäjätunnus
            <input
              type="text"
              value={data.username}
              onChange={handleInputChange}
              name="username"
              id="username"
              className="form-control text-center"
            />
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="password">
            Salasana
            <input
              type="password"
              value={data.password}
              onChange={handleInputChange}
              name="password"
              id="password"
              className="form-control text-center"
            />
          </label>
        </div>
        {data.errorMessage && (
          <span className="form-error">{data.errorMessage}</span>
        )}

        <button className="btn btn-dark" disabled={data.isSubmitting}>
          {data.isSubmitting ? <div>Loading</div> : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;