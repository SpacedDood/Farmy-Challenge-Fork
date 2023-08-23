'use client'
import styles from '../page.module.css'
import { useState, useEffect, useRef } from 'react'
import SaladMaker from "../saladMaker";

export const SaladMakerLoaderPage = ({params}, props) => {

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [loadedData, setLoadedData] = useState(null)

  useEffect(() => {
    fetch('/api/salads/' + params.id)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        setLoadedData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error)
        setError(true);
        setLoading(false);
      });
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <a href="/">Home</a>
      </div>

      {error ? <p>Issues loading salad! Sorry :( </p> : null}


      {loading ?
        (<div className={styles.loading}>Loading Salads...</div>)
        :
        (<SaladMaker
          loadedData={loadedData ? loadedData : null}
        />)
      }

    </main>

  )
}


export default SaladMakerLoaderPage;
