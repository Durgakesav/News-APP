import React from 'react';

function NewsCard({ article }) {
  const { title, description, url, urlToImage, content } = article;

  return (
    <div className="news-card">
      {urlToImage && <img src={urlToImage} alt="news" />}
      <h3>{title}</h3>
      <p><strong>{description}</strong></p>
      <a href={url} target="_blank" rel="noopener noreferrer">
        Read more 🔗
      </a>
      <p className="extra-paragraph">
        {content
          ? content
          : 'This article provides additional insights on the topic. Stay informed with the latest updates as they unfold.'}
      </p>
    </div>
  );
}

export default NewsCard;
