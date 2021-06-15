import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import "./styles.css";
import moment from "moment";
import "moment/locale/fi";
import RaporttiHallinta from "./RaporttiHallinta";
import { CircularProgress } from "@material-ui/core";

export default function TapahtumaLista() {
  const [tapahtumat, setTapahtumat] = useState([]);
  const [myydytLiput, setMyydytLiput] = useState([]);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tapahtumaname, setTapahtumaname] = useState();
  const [tapahtumakapasiteetti, setTapahtumakapasiteetti] = useState();

  let headers = {
    method: "GET",
    headers: {
      Authorization: JSON.parse(localStorage.getItem("user")).token,
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch("https://ticketguru-app.herokuapp.com/api/events", headers)
      .then((response) => response.json())
      .then((data) => {
        setTapahtumat(data);
      })
      .then(setReady(true));
  };

  const haeLiput = async (event) => {
    setTapahtumaname(event.target.name)
    setTapahtumakapasiteetti(event.target.getAttribute("data-capacity"))
    let liput = [];
    let priceCatFetch = await fetch(event.target.value, headers);
    let priceCatResults = await priceCatFetch.json();

    for (let i = 0; i < priceCatResults._embedded.priceCats.length; i++) {
      liput.push({
        lippukategoria: priceCatResults._embedded.priceCats[i].price_cat_name,
      });
      await fetch(
        priceCatResults._embedded.priceCats[i]._links.tickets.href,
        headers
      )
        .then((eventTickets) => eventTickets.json())
        .then((eventTickets) => {
          Object.assign(liput[i], {
            liput: eventTickets._embedded.tickets,
          });
        });
    }

    setMyydytLiput(liput);
    setLoading(false);
    return liput;
  };

  if (!ready) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <h1>Raportit</h1>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Tapahtuman nimi</th>
            <th>Pvm</th>
            <th>Kapasiteetti</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tapahtumat.length === 0
            ? null
            : tapahtumat._embedded.events.map((tapahtuma, index) => (
                <tr key={index} className="active-row">
                  <td>{tapahtuma.event_name}</td>
                  <td>
                    {
                      (moment.locale("fi"),
                      moment(tapahtuma.starts_at).format("LLL"))
                    }
                  </td>
                  <td>{tapahtuma.capacity}</td>

                  <td>
                    <Button
                      id={index}
                      value={tapahtuma._links.priceCats.href}
                      name={tapahtuma.event_name}
                      data-capacity={tapahtuma.capacity}
                      onClick={(event) => haeLiput(event)}
                      variant="dark"
                    >
                      Avaa raportti
                    </Button>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
      <RaporttiHallinta myydytLiput={myydytLiput} name={tapahtumaname} capacity={parseInt(tapahtumakapasiteetti)} loading={loading} />
    </>
  );
}
