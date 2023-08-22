import Image from 'next/image'
import styles from './page.module.css'

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
          href="/salad-maker"
          rel="noopener noreferrer"
        >
          <h1>Make a salad!</h1>
        </a>
      </div>

      <div className={styles.grid}>
        {/*
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Docs <span>-&gt;</span>
          </h2>
          <p>Find in-depth information about Next.js features and API.</p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Learn <span>-&gt;</span>
          </h2>
          <p>Learn about Next.js in an interactive course with&nbsp;quizzes!</p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Templates <span>-&gt;</span>
          </h2>
          <p>Explore the Next.js 13 playground.</p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Deploy <span>-&gt;</span>
          </h2>
          <p>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
        */
        }

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
