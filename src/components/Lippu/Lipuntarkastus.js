import React from "react";
import { useState } from "react";
import QrReader from "react-qr-scanner";
import moment from "moment";
import "moment/locale/fi";

export default function Lipuntarkastus() {
  const [hakusana, setHakusana] = useState("");
  const [lippu, setLippu] = useState({});

  const handleScan = (data) => {
    if (data && hakusana !== data) {
      setHakusana(data);
      haeLippu();
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const haeLippu = () => {
    let temp = [];
    console.log(hakusana);

    fetch(`https://ticketguru-app.herokuapp.com/api/tickets/${hakusana}`, {
      method: "GET",
      headers: {
        Authorization: JSON.parse(localStorage.getItem("user")).token,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.status >= 400) {
          alert("Jotain meni pieleen, tarkasta lipun koodi!");
        } else {
          setLippu(res);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const merkkaaKaytetyksi = () => {
    if (lippu.usedat !== null) {
      alert("LIPPU ON JO KÄYTETTY!");
    } else {
      fetch(
        `https://ticketguru-app.herokuapp.com/api/tickets/useticket/${hakusana}`,
        {
          method: "PATCH",
          headers: {
            Authorization: JSON.parse(localStorage.getItem("user")).token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: "30%", height: "30%", margin: "20px auto" }}
      />
      <div>
        <input
          type="text"
          name="searchWord"
          value={hakusana}
          onChange={(e) => setHakusana(e.target.value)}
        />

        <button onClick={haeLippu}>Hae tunnisteella</button>
      </div>

      <table style={{ marginLeft: "auto", marginRight: "auto" }}>
        {lippu.ticketid !== undefined ? (
          <tbody>
            <tr>
              <th>Lippuhash</th>
              <th>Tapahtuma</th>
              <th>Lippukategoria</th>
              <th>Hinta</th>
              <th>Käytetty</th>
            </tr>

            <tr>
              <td>{lippu.ticketid}</td>
              <td>{lippu.pricecat.event.event_name}</td>
              <td>{lippu.pricecat.price_cat_name}</td>
              <td>{lippu.unitprice}</td>

              <td>
                {lippu.usedat === null ? (
                  <button value={lippu.ticketid} onClick={merkkaaKaytetyksi}>
                    Merkkaa käytetyksi
                  </button>
                ) : (
                  (moment.locale("fi"), moment(lippu.usedat).format("LLL"))
                )}
              </td>
            </tr>
          </tbody>
        ) : null}
      </table>
    </div>
  );
}
