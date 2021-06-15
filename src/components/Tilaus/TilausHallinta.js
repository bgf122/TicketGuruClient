import React from "react";
import "./styles.css";
import "moment/locale/fi";
import Modal from "react-modal";
import moment from "moment";
import "moment/locale/fi";
import { QRCode } from "react-qr-svg";
import { Button } from "react-bootstrap";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

export default function Tilaushallinta(props) {
  return (
    <>
      {props.open && props.tilaus[0] !== undefined ? (
        <Modal
          isOpen={props.open}
          onRequestClose={props.handleOpen}
          style={customStyles}
          contentLabel="Lisätiedot"
          ariaHideApp={false}
        >
          <h2>Tilauksen tiedot</h2>

          <table className="styled-table">
            <thead>
              <tr>
                <th>Tapahtuman nimi</th>
                <th>Lippukategoria</th>
                <th>Hinta</th>
                <th>Myyjä</th>
                <th>QR</th>
              </tr>
            </thead>
            <tbody>
              {props.tilaus.map((lippu, index) => (
                <tr key={index} className="active-row">
                  <td>{lippu.pricecat.event.event_name}</td>
                  <td>{lippu.pricecat.price_cat_name}</td>
                  <td>{lippu.pricecat.price}€</td>
                  <td>
                    {lippu.ordr.user.firstname} {lippu.ordr.user.lastname}
                  </td>
                  <td>
                    <QRCode
                      bgColor="#FFFFFF"
                      fgColor="#000000"
                      level="Q"
                      style={{ width: 50, textAlign: "right" }}
                      value={lippu.ticketid}
                    />
                  </td>
                </tr>
              ))}
              <h4>Loppusumma:</h4>
              <h5>{props.loppusumma ? `${props.loppusumma}€` : null}</h5>
              <h4>Myyntipäivä</h4>
              <h5>
                {props.tilaus !== [] || props.tilaus[0].ordr !== undefined
                  ? (moment.locale("fi"),
                    moment(props.tilaus[0].ordr.sold).format("LLL"))
                  : null}
              </h5>
              <h4>Käyttäjä: </h4>
              <h5>
                {props.tilaus !== [] || props.tilaus[0].ordr !== undefined
                  ? `${props.tilaus[0].ordr.user.firstname} ${props.tilaus[0].ordr.user.lastname}`
                  : null}
              </h5>
            </tbody>
          </table>

          <Button variant="danger" onClick={props.handleOpen}>
            Sulje
          </Button>
        </Modal>
      ) : null}
    </>
  );
}
