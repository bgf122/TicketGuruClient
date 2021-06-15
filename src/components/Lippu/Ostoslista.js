import React from "react";
import { Button } from "react-bootstrap";
import { QRCode } from "react-qr-svg";
import NewWindow from "react-new-window";
import "./lippu.css";
import moment from "moment";
import "moment/locale/fi";

export default function Ostoslista(props) {


  return (
    <>
      <h1>Ostoslista</h1>
      <h2>
        {props.tilaus !== "" && props.tilaus !== undefined
          ? `Tilausrivit tilaukselle #${props.tilaus.split("ordrs/")[1]}`
          : `Tilausta ei ole`}
      </h2>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Tapahtuman nimi</th>
            <th>Lippukategoria</th>
            <th>Hinta</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {props.liput.length > 0
            ? props.liput.map((lippu, index) => (
                <tr key={index} className="active-row">
                  <td>{lippu.event}</td>
                  <td>{lippu.price_cat_name}</td>
                  <td>{lippu.price}€</td>
                  <td>
                    <Button
                      id={index}
                      onClick={(event) => props.poistaLippu(event)}
                      value={lippu.link}
                      variant="dark"
                    >
                      Poista rivi
                    </Button>
                  </td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
      {props.liput.length > 0 ? (
        <div>
          <h5>Tilauksen loppusumma:</h5>
          <strong>
            <h4>{props.loppusumma}€</h4>
          </strong>
          <br></br>
          <br></br>
          <div className="tableButtons">
            <Button onClick={props.valmis} variant={"dark"}>
              Valmis
            </Button>
            <Button onClick={props.tulostaTilaus} variant="dark">
              Tulosta tilaus
            </Button>
            <Button
              onClick={props.poistaTilaus}
              variant="danger"
              value={props.tilaus}
            >
              Poista tilaus
            </Button>
          </div>
          {props.open ? (
            <NewWindow
              title="Tulostetut liput"
              copyStyles={true}
              features={{ left: 200, top: 200, width: 400, height: 400 }}
              onUnload={props.tulostaTilaus}
            >
              <div className="lippuContainer">
                {props.liput.map((lippu, index) => {
                  return (
                    <div className="singleTicket">
                      <h3>{lippu.event}</h3>
                      <h4>
                        {
                          (moment.locale("fi"),
                          moment(lippu.start).format("LLL"))
                        }
                      </h4>

                      <div style={{ alignItems: "center" }}>
                        <QRCode
                          bgColor="#FFFFFF"
                          fgColor="#000000"
                          level="Q"
                          style={{ width: 350 }}
                          value={lippu.hash}
                        />

                        <h4>
                          <strong>Lipputyyppi:</strong>
                        </h4>
                        <h3>{lippu.price_cat_name}</h3>
                        <h4>
                          <strong>Lipun hinta:</strong>
                        </h4>
                        <h3>{lippu.price} €</h3>
                        <h4><strong>Lippuhash</strong></h4>
                        <h3>{lippu.hash}</h3>
                      </div>
                    </div>
                  );
                })}
                <button onClick={props.tulostaTilaus}>Sulje</button>
              </div>
            </NewWindow>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
