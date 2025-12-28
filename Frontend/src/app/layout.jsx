import './globals.css';

export const metadata = {
  title: 'Fake Job Posting Detector',
  description: 'AI-based detector for job and internship scams',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
