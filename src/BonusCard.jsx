import { useLayoutEffect } from "react";
import { useEffect, useState } from "react";
import {
  AccessKey,
  accessTokenUrl,
  getBonusUrl,
  ClientID,
  DeviceID,
} from "./config";

function BonusCard() {
  const [info, setInfo] = useState(null);
  const [error, setError] = useState(null)
  useEffect(() => {
    let data = {
      idClient: ClientID,
      accessToken: "",
      paramName: "device",
      paramValue: DeviceID,
      latitude: 0,
      longitude: 0,
      sourceQuery: 0,
    };
    fetch(accessTokenUrl, {
      method: "POST",
      headers: {
        AccessKey: AccessKey,
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) =>
        fetch(`${getBonusUrl}/${res.accessToken}`, {
          method: "GET",
          headers: {
            AccessKey: AccessKey,
          },
        })
      )
      .then((res) => res.json())
      .then((res) => setInfo(res))
      .catch(e => setError(e.message))
  }, []);
  
  if(error) return <>{error}</>
  
  if (!info) return <>loading...</>;

  let { currentQuantity, forBurningQuantity } = info.data;
  let dayOfBurning = new Date(info.data.dateBurning).getDate();
  let monthOfBurning =
    new Date(info.data.dateBurning).getMonth() + 1 >= 10
      ? new Date(info.data.dateBurning).getMonth() + 1
      : "0" + (new Date(info.data.dateBurning).getMonth() + 1);
  return (
    <>
      <div className="bg-c">
        <div className="container">
          <div className="bonus-card">
            <div className="currentQuantity">{currentQuantity} бонусов </div>
            <div className="burningQuantity">
              {dayOfBurning}.{monthOfBurning} сгорит &#128293;
              {forBurningQuantity} бонусов
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BonusCard;
