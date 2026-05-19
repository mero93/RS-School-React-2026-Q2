import './About.css';

export default function About() {
  return (
    <div className="about-container">
      <div className="about-card">
        <h1 className="about-heading">About This Project</h1>
        <p className="about-text">
          This application is a Star Trek Comic Strip Archive Explorer built
          using React, TypeScript, and React Router. It fetches data dynamically
          from the STAPI REST endpoint and features clean URL state management
          for searching, pagination, and side-by-side details tracking.
        </p>
        <div className="course-info">
          <p className="course-text">
            Developed as part of the hands-on curriculum for the{' '}
            <strong>RS School React Course</strong>.
          </p>
          <a
            href="https://rs.school/courses/reactjs"
            target="_blank"
            rel="noopener noreferrer"
            className="course-link"
          >
            View Course Details &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
