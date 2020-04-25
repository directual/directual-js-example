import React, { useEffect, useState } from 'react'
import Directual from 'directual-api';
import { useAuth } from '../auth'
const api = new Directual({apiHost: '/'});

export default function DashBoardPage () {
  const [payload, setPayload] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = useAuth();

  useEffect( ()=>{
    api
      .structure('test')
      .getData('test', {sessionID:auth.sessionID})
      .then((response) => {
        setPayload(response.payload)
        setLoading(false)
      })
      .catch((e) => {
        setLoading(false)
        if(!e.response){
          //check you API endpoint, you must enable CORS header in settings
        }
        if(e.response && e.response.status === 403){
          //todo: api endpoint required authorisation
        }
      })
  })


  return (
    <div>
      <h2>Dashboard</h2>
      {loading && <span>loading</span>}
      {payload.map((data)=>{
        return <div>{JSON.stringify(data)}</div>
      })}
    </div>
  )
}