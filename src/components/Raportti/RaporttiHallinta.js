import React from "react";

import "./styles.css";

import "moment/locale/fi";
import { CircularProgress } from "@material-ui/core";

export default function RaporttiHallinta(props) {
  
  let yhteismyynti = 0
  let yhteispaikat = 0
  let myyntirivit = []

  const tapahtumaRaportti = (k,l) => {
    
    let kat = k
    let pit = l.length
    let myy = l.reduce((accumulator, currentValue) => accumulator + currentValue.unitprice, 0)
    let hin = myy / pit
    let myyntirivi = {kategoria: kat, kpl: pit, hinta: hin, myynti: myy}
    if (pit > 0) {myyntirivit.push(myyntirivi)}
    yhteismyynti = myyntirivit.reduce((accumulator, currentValue) => accumulator + currentValue.myynti, 0)
    yhteispaikat = myyntirivit.reduce((accumulator, currentValue) => accumulator + currentValue.kpl, 0)
  }

  return (
    <>
      <h2>Myyntiraportti</h2>
      {props.loading ? null : (props.myydytLiput.map(({ lippukategoria, liput }, i) => (
        tapahtumaRaportti(lippukategoria,liput))),
      <>
          <h3>{`${props.name}:`}</h3>
          <h4>{`Myynti ${yhteismyynti} €`}</h4>
          <h4>{props.capacity-yhteispaikat >= 0 ? `Jäljellä ${props.capacity-yhteispaikat} paikkaa` : `Kapasiteetti ylitetty ${Math.abs(props.capacity-yhteispaikat)} paikalla`}</h4>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Lippukategoria</th>
                <th>Kappale</th>
                <th>Hinta</th>
                <th>Myynti</th>
              </tr>
            </thead>
            <tbody>
              {myyntirivit.map((rivi,j) => (
                <tr key={j}>
                  <td>{rivi.kategoria}</td>
                  <td>{rivi.kpl}</td>
                  <td>{rivi.hinta}</td>
                  <td>{rivi.myynti}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>)}
    </>
  );
}
