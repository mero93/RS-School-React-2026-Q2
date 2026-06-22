import './styles.css';
import { getTranslations } from 'next-intl/server';

export default async function About() {
  const t = await getTranslations('About.AboutPage');

  return (
    <div className="about-container">
      <div className="about-card">
        <h1 className="about-heading">{t('heading')}</h1>
        <p className="about-text">{t('text')}</p>
        <div className="course-info">
          <p className="course-text">
            {t('courseTextStart')}
            <strong>{t('courseLinkText')}</strong>.
          </p>
          <a
            href="https://rs.school/courses/reactjs"
            target="_blank"
            rel="noopener noreferrer"
            className="course-link"
          >
            {t('viewCourse')}
          </a>
        </div>
      </div>
    </div>
  );
}
