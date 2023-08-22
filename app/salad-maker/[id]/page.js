'use client'
import styles from '../page.module.css'
import { useState, useEffect, useRef } from 'react'
import SaladMaker from "../SaladMaker";

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
      })
      .catch((error) => {
        console.log(error)
        setError(true)
      });
  }, []);

  return (

    <main className={styles.main}>
      <div className={styles.description}>
        <a href="/">Home</a>
      </div>

      {error ? <p>Issues loading salad! Sorry :( </p> : null}

      <SaladMaker
        saladData={loadedData ? loadedData : null}
      />

    </main>

  )
}


export default SaladMakerLoaderPage;
