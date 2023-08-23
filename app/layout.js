import './globals.css'
import localFont from 'next/font/local'

const signikaRegular = localFont({ src: '../public/fonts/Signika-Regular.ttf' })

export const metadata = {
  title: 'Farmy / Salad Maker',
  description: 'Make all the salads!',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={signikaRegular.className}>{children}</body>
    </html>
  )
}
