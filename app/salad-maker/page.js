'use client'
import styles from './page.module.css'
import { useState, useEffect, useRef } from 'react'
import SaladMaker from "./SaladMaker";

// Main code here.
export const SaladMakerPage = (params) => {

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <a href="/">Home</a>
      </div>
      <SaladMaker />
    </main>
  )

}

export default SaladMakerPage;
