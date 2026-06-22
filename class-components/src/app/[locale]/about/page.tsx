'use client';

import { useTranslations } from 'next-intl';
import './styles.css';

export default function About() {
  const t = useTranslations('About.AboutPage');

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
