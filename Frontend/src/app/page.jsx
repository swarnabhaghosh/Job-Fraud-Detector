import JobDetector from '../components/JobDetector.jsx';

export default function Page() {
  return (
    <div className="container">
      <header className="header">
        <h1>Fake Job Posting Detector</h1>
        <p className="sub">AI-based detector for job and internship scams</p>
      </header>
      <main>
        <JobDetector />
      </main>
      <footer className="footer">
        <small>Provide either full job text or fill the structured fields.</small>
      </footer>
    </div>
  );
}
