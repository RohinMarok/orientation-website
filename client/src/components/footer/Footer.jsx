import React from 'react';
import PropTypes from 'prop-types';
import './Footer.scss';
import { pages } from '../../util/pages';
import { Link } from 'react-router-dom';

import InstagramLogo from '../../assets/social/instagram-brands.svg';
import DiscordLogo from '../../assets/social/discord-brands.svg';

const Footer = () => {
  return (
    <div className="container">
      <div className="sitemap">
        <div className="sitemap-text">Site Map</div>
        <div className="sitemap-links">
          {pages.main.map((page, index) => {
            return (
              <div key={page.path}>
                <Link className="links" to={page.path} key={page.path}>
                  {page.label}
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      <div className="socials">
        <div className="icons">
          <a href="https://www.instagram.com/froshweek/" target="_blank" rel="noreferrer">
            <img className="svg-icons" alt="instagram" src={InstagramLogo}></img>
          </a>
          <a href="https://discord.gg/BPR8V5zSwB" target="_blank" rel="noreferrer">
            <img className="svg-icons" alt="discord" src={DiscordLogo}></img>
          </a>
        </div>
        <div className="message">Made with 💜 by the F!rosh Week 2T2 Tech Team</div>
      </div>
    </div>
  );
};

export { Footer };
