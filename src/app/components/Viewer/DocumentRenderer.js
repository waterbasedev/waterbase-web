import React from "react";
import Showdown from "showdown";
import styles from "./documentViewer.module.css";

const converter = new Showdown.Converter();

const parseCustomLinks = (text, onLinkClick) => {
  const regex = /\[([^\[]+)\[([^\]]+)\]\]/g;
  return text.replace(regex, (match, p1, p2) => {
    return `<span class="${styles.clickableText}" data-link="${p2}">${p1}</span>`;
  });
};

const CustomMarkdown = ({ content, onLinkClick }) => {
  const htmlContent = parseCustomLinks(
    converter.makeHtml(content),
    onLinkClick
  );

  const handleClick = (event) => {
    if (event.target.dataset.link) {
      onLinkClick(event.target.dataset.link);
    }
  };

  return (
    <div
      className={styles.documentText}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      onClick={handleClick}
    ></div>
  );
};

export default CustomMarkdown;
