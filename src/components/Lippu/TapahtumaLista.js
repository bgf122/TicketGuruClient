import React from "react";
import { Button } from "react-bootstrap";
import "./styles.css"
import moment from "moment";
import 'moment/locale/fi';

export default function TapahtumaLista(props) {
  return (
    <><h1>Tapahtumat</h1>
    <table className="styled-table">
      <thead>
        <tr>
          <th>Tapahtuman nimi</th>
          <th>Pvm</th>
          <th>Kapasiteetti/Jäljellä</th>
          <th></th>
        </tr>
        </thead>
        <tbody>        
        {props.tapahtumat.length === 0 ? null : props.tapahtumat._embedded.events.map((tapahtuma, index) => (
          <tr key={index} className="active-row">
            <td>{tapahtuma.event_name}</td>
            <td>{(moment.locale("fi"),
                    moment(tapahtuma.starts_at).format("LLL"))}</td>
            <td>{tapahtuma.capacity}</td>
            
            <td>
              <Button id={index} onClick={() => props.handleEventOpen(tapahtuma)} variant="dark">
                Lisää
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </>
  );
}
