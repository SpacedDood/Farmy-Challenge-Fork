'use client'
import Image from 'next/image'
import styles from './page.module.css'
import { useState, useEffect } from 'react'

export default function Home() {

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Hello there!
        </p>
        <div>
          <a
            href="http://spaceddood.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{' '}
            <Image
              src="http://spaceddood.com/images/spaced-logo.png"
              alt="Dood Logo"
              className={styles.vercelLogo}
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className={styles.center}>
        <a
          className={styles.mainButton}
          href="/salad-maker"
          rel="noopener noreferrer"
        >
          <h1>Make a salad!</h1>
        </a>
      </div>

      <SaladList />

      <div className={styles.grid}>

        <a
          href="/api/businessLogic"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Business <span>-&gt;</span>
          </h2>
          <p>
            businessLogic
          </p>
        </a>

        <a
          href="/api/ingredients"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Ingredients <span>-&gt;</span>
          </h2>
          <p>
            ingredients
          </p>
        </a>

        <a
          href="/api/suppliers"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Suppliers <span>-&gt;</span>
          </h2>
          <p>
            SuppliersLogic
          </p>
        </a>

        <a
          href="/api/salads"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Salads <span>-&gt;</span>
          </h2>
          <p>
            saladsLogic
          </p>
        </a>

        <a
          href="/api/subscriptions"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Subscriptions <span>-&gt;</span>
          </h2>
          <p>
            subscriptions
          </p>
        </a>
      </div>
    </main>
  )
}

const SaladList = (props) => {

  const [loading, setLoading] = useState(true)
  const [loadedData, setLoadedData] = useState(null)

  useEffect(() => {
    fetch('/api/salads/')
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


  if (loading)
      return (<div className={styles.loading}>Loading...</div>)

  return (
    <div className={styles.saladsList}>
      {loadedData.map((salad) => {
        return (
          <div className={styles.flexbetween}>
            <p>{salad.name}</p>
            <a className={styles.btn} href={"/salad-maker/" + salad.id}>Edit</a>
          </div>
        )
      })}
    </div>
  )
}
