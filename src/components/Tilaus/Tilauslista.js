import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import "./styles.css";
import DeleteIcon from "@material-ui/icons/Delete";

import moment from "moment";
import "moment/locale/fi";
import InfoIcon from "@material-ui/icons/Info";
import Tilaushallinta from "./TilausHallinta";
import { CircularProgress } from "@material-ui/core";

export default function TilausLista() {
  const [tilaukset, setTilaukset] = useState([]);
  const [tilaus, setTilaus] = useState([]);
  const [open, setOpen] = useState(false);
  const loppusumma = tilaus.reduce(
    (sum, lippu) => sum + lippu.pricecat.price,
    0
  );
  const [ready, setReady] = useState(false);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch("https://ticketguru-app.herokuapp.com/api/ordrs", {
      method: "GET",
      headers: {
        Authorization: JSON.parse(localStorage.getItem("user")).token,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTilaukset(data._embedded.ordrs);
      })
      .then(setReady(true));
  };

  const poistaTilaus = async (event) => {
    event.preventDefault();

    await fetch(event.target.value, {
      method: "DELETE",
      headers: {
        Authorization: JSON.parse(localStorage.getItem("user")).token,
        "Content-Type": "application/json",
      },
    });
    await fetchData();
  };

  const avaaTilaus = async (event) => {
    let liput = [];
    let ticketsFetch = await fetch(event.target.value, {
      method: "GET",
      headers: {
        Authorization: JSON.parse(localStorage.getItem("user")).token,
        "Content-Type": "application/json",
      },
    });
    let ticketResults = await ticketsFetch.json();
    for (let i = 0; i < ticketResults._embedded.tickets.length; i++) {
      await fetch(ticketResults._embedded.tickets[i]._links.ticket.href, {
        method: "GET",
        headers: {
          Authorization: JSON.parse(localStorage.getItem("user")).token,
          "Content-Type": "application/json",
        },
      })
        .then((orderTicket) => orderTicket.json())
        .then((orderTicket) => {
          liput.push(orderTicket);
        });
    }
    console.log(liput);

    if (liput.length === 0) {
      alert("Tilauksessa ei ole lippuja! Tilaus tulee ehkä poistaa?");
    } else {
      setTilaus(liput);
      setOpen(true);
    }
    setTilaus(liput);
    setOpen(true);
  };

  const handleOpen = () => {
    setOpen(!open);
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
      <h1>Tilaukset</h1>
      <table className="styled-table">
        <thead>
          <tr>
            <th>TilausID</th>
            <th>Tila</th>
            <th>Myyntipäivä</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tilaukset.map((tilaus, index) => (
            <tr key={index} className="active-row">
              <td>{tilaus._links.self.href.split("ordrs/")[1]}</td>
              <td className={tilaus.sold == null ? "kesken" : "valmis"}>
                {tilaus.sold == null ? "Kesken" : "Valmis"}
              </td>
              <td>
                {tilaus.sold !== null ? (
                  (moment.locale("fi"), moment(tilaus.sold).format("LLL"))
                ) : (
                  <div></div>
                )}
              </td>

              <td>
                <Button
                  onClick={(event) => avaaTilaus(event)}
                  value={tilaus._links.tickets.href}
                  variant="dark"
                >
                  <InfoIcon />
                  Lisätiedot
                </Button>

                <Button
                  variant="danger"
                  onClick={poistaTilaus}
                  value={tilaus._links.self.href}
                >
                  <DeleteIcon /> Poista
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Tilaushallinta
        handleOpen={handleOpen}
        open={open}
        tilaus={tilaus}
        loppusumma={loppusumma}
      />
    </>
  );
}
