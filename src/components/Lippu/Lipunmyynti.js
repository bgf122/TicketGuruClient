import React, { useState, useEffect } from "react";
import {
  TextField,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@material-ui/core/";
import TapahtumaLista from "./TapahtumaLista";
import Ostoslista from "./Ostoslista";
import { Button } from "react-bootstrap";

export default function Lipunmyynti() {
  const [maara, setMaara] = useState(1);
  const [liput, setLiput] = useState([]);
  const [tilaus, setTilaus] = useState();
  const [tapahtumat, setTapahtumat] = useState([]);
  const [tapahtuma, setTapahtuma] = useState();
  const [hintakategoriat, setHintakategoriat] = useState([]);
  const [hintakategoria, setHintakategoria] = useState([]);
  const [eventOpen, setEventOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const loppusumma = liput.reduce((sum, lippu) => sum + lippu.price, 0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch("https://ticketguru-app.herokuapp.com/api/events", {
      method: "GET",
      headers: {
        Authorization: JSON.parse(localStorage.getItem("user")).token,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTapahtumat(data);
      })
      .then(setReady(true));
  };

  const uusiLippu = async (uudetLiput, newTilaus) => {
    for (let i = 0; i < uudetLiput.length; i++) {
      let body = {
        pricecat: uudetLiput[i].pricecat,
        unitprice: uudetLiput[i].price,
        ordr: newTilaus,
      };

      await fetch("https://ticketguru-app.herokuapp.com/api/tickets", {
        method: "POST",
        headers: {
          Authorization: JSON.parse(localStorage.getItem("user")).token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
        .then((response) => response.json())
        .then((data) => {
          uudetLiput[i] = { ...uudetLiput[i], link: data._links.self.href };
          uudetLiput[i] = {
            ...uudetLiput[i],
            hash: data._links.self.href.toString().slice(-36),
          };
        });
    }
    setLiput([...liput, ...uudetLiput]);
  };

  const tulostaTilaus = () => {
    setOpen(!open);
  };

  const handleEventOpen = async (event) => {
    setTapahtuma(event);
    await fetch(event._links.priceCats.href, {
      method: "GET",
      headers: {
        Authorization: JSON.parse(localStorage.getItem("user")).token,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setHintakategoriat(data._embedded.priceCats);
      });
    setEventOpen(true);
  };

  const handleEventClose = () => {
    setEventOpen(false);
  };

  const catItems = hintakategoriat.map((kategoria, index) => {
    return (
      <MenuItem value={kategoria} key={index}>
        {kategoria.price_cat_name} {kategoria.price} €
      </MenuItem>
    );
  });

  const suljeTilaus = () => {
    let order = {
      sold: new Date().toISOString(),
    };

    fetch(tilaus, {
      method: "PUT",
      headers: {
        Authorization: JSON.parse(localStorage.getItem("user")).token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    setMaara(1);
    setLiput([]);
    setTilaus(undefined);
  };

  const poistaLippu = (event) => {
    event.preventDefault();

    fetch(event.target.value, {
      method: "DELETE",
      headers: {
        Authorization: JSON.parse(localStorage.getItem("user")).token,
        "Content-Type": "application/json",
      },
    });
    setLiput(
      liput.filter((item, index) => parseInt(event.target.id) !== index)
    );
  };

  const lisaaLippu = async () => {
    let newTilaus = [];

    let uudetLiput = [];
    for (let i = 0; i < maara; i++) {
      let lippu = {
        pricecat: hintakategoria._links.self.href,
        price_cat_name: hintakategoria.price_cat_name,
        price: hintakategoria.price,
        event: tapahtuma.event_name,
        start: tapahtuma.starts_at,
        end: tapahtuma.ends_at,
        hash: "",
        link: "",
      };

      uudetLiput.push(lippu);
    }

    handleEventClose();

    if (tilaus === undefined) {
      const user = JSON.parse(window.localStorage.getItem("user")).link;
      let orderBody = {
        user: user,
      };
      await fetch("https://ticketguru-app.herokuapp.com/api/ordrs/", {
        method: "POST",
        headers: {
          Authorization: JSON.parse(localStorage.getItem("user")).token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderBody),
      })
        .then((response) => response.json())
        .then((data) => {
          setTilaus(data._links.self.href);
          newTilaus = data._links.self.href;
        });
    } else {
      newTilaus = tilaus;
    }
    uusiLippu(uudetLiput, newTilaus);
  };

  const poistaTilaus = () => {
    fetch(tilaus, {
      method: "DELETE",
      headers: {
        Authorization: JSON.parse(localStorage.getItem("user")).token,
        "Content-Type": "application/json",
      },
    });
    suljeTilaus();
  };

  if (!ready) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <Dialog
        open={eventOpen}
        onClose={handleEventClose}
        aria-labelledby="form-dialog-title"
        fullWidth
      >
        <DialogTitle>Lipunmyynti</DialogTitle>
        <DialogContent>
          <TextField
            id="select"
            select
            label="Hintakategoria"
            name="hintakategoria"
            margin="dense"
            value={hintakategoria}
            onChange={(event) => setHintakategoria(event.target.value)}
            fullWidth
          >
            {catItems}
          </TextField>
          <TextField
            id="maaraSelect"
            select
            label="Määrä"
            name="maara"
            margin="dense"
            value={maara}
            onChange={(event) => setMaara(event.target.value)}
          >
            <MenuItem key="1" value={1}>
              1
            </MenuItem>
            <MenuItem key="2" value={2}>
              2
            </MenuItem>
            <MenuItem key="3" value={3}>
              3
            </MenuItem>
            <MenuItem key="4" value={4}>
              4
            </MenuItem>
            <MenuItem key="5" value={5}>
              5
            </MenuItem>
            <MenuItem key="6" value={6}>
              6
            </MenuItem>
            <MenuItem key="7" value={7}>
              7
            </MenuItem>
            <MenuItem key="8" value={8}>
              8
            </MenuItem>
            <MenuItem key="9" value={9}>
              9
            </MenuItem>
            <MenuItem key="10" value={10}>
              10
            </MenuItem>
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleEventClose} variant="dark">
            Sulje
          </Button>
          <Button onClick={lisaaLippu} variant="success">
            Lisää
          </Button>
        </DialogActions>
      </Dialog>
      <div className="components">
        <TapahtumaLista
          tapahtumat={tapahtumat}
          handleEventOpen={handleEventOpen}
        />
        {tilaus === undefined ? (
          <div />
        ) : (
          <Ostoslista
            loppusumma={loppusumma}
            open={open}
            liput={liput}
            tilaus={tilaus}
            tulostaTilaus={tulostaTilaus}
            poistaLippu={poistaLippu}
            poistaTilaus={poistaTilaus}
            valmis={suljeTilaus}
          />
        )}
      </div>
    </div>
  );
}
