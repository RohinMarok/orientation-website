import React, { useEffect, useState, useLayoutEffect } from 'react';
import { ScuntLinks } from '../../components/ScuntLinks/ScuntLinks';
import { Header } from '../../components/text/Header/Header';
import { ExecProfile } from '../About/ExecProfile/ExecProfile';
import { scuntJudges } from '../../util/scunt-judges';
import { PopupModal } from '../../components/popup/PopupModal';
import { Confetti } from '../../components/misc/Confetti/Confetti';

import './ScuntJudges.scss';

const ScuntJudges = () => {
  let clicks = 3; // only show tech team if this number of profiles have been clicked
  const [totalClicks, setTotalClicks] = useState(0);
  const [openPopup, setOpenPopup] = useState(true);
  const [showTechTeam, setShowTechTeam] = useState(false); // shows tech team image
  const [showTechTeamPopup, setShowTechTeamPopup] = useState(false); // shows secret judges revealed popup
  const [profileClicks, setProfileClicks] = useState([{ name: 'test', clicks: 0 }]);

  useLayoutEffect(() => {
    // do this first!
    const popupdata = window.localStorage.getItem('scunt-judges-popup');
    const showtechteamdata = window.localStorage.getItem('show-tech-team-secret-judge');
    const scuntprofiledata = window.localStorage.getItem('scunt-judges-profile');

    if (popupdata !== null) {
      setOpenPopup(JSON.parse(popupdata));
      setShowTechTeam(JSON.parse(showtechteamdata));
      setProfileClicks(JSON.parse(scuntprofiledata));
    }
  }, []);

  useEffect(() => {
    const data = window.localStorage.getItem('Profile_Clicks_Scunt_Judges');
    if (data !== null) {
      setTotalClicks(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('Profile_Clicks_Scunt_Judges', JSON.stringify(totalClicks));
  }, [totalClicks]);

  useEffect(() => {
    window.localStorage.setItem('scunt-judges-popup', JSON.stringify(openPopup));
  }, [openPopup]);

  useEffect(() => {
    window.localStorage.setItem('show-tech-team-secret-judge', JSON.stringify(showTechTeam));
  }, [showTechTeam]);

  useEffect(() => {
    window.localStorage.setItem('scunt-judges-profile', JSON.stringify(profileClicks));
  }, [profileClicks]);

  useEffect(() => {
    if (totalClicks === clicks) {
      setShowTechTeam(true);

      if (!showTechTeam) {
        setShowTechTeamPopup(true);
        window.scrollTo(0, 0);
      }
    }

    setTimeout(() => {
      // automatically close popup, or users can click bg to close
      setShowTechTeamPopup(false);
    }, 10000);
  }, [totalClicks]);

  return (
    <>
      <Header text={'Judges'} underlineDesktop={'265px'} underlineMobile={'180px'}>
        <ScuntLinks />
      </Header>
      <div className="scunt-judges-container">
        {scuntJudges.map((judge) => {
          const [clickProfile, setClickProfile] = useState(false);
          const [numClicks, setNumClicks] = useState(0);

          useEffect(() => {
            // getting numclicks from local storage
            const data = window.localStorage.getItem('scunt-judges-profile');
            let updateData = JSON.parse(data);

            let index = updateData.findIndex((i) => i.name === judge.name);

            if (index !== -1) {
              // not in array
              setNumClicks(updateData[index].clicks);
            }
          }, []);

          useEffect(() => {
            // updating local storage with clicks
            const data = window.localStorage.getItem('scunt-judges-profile');
            let updateData = JSON.parse(data);
            //console.log(updateData);

            let index = updateData.findIndex((i) => i.name === judge.name);

            if (index === -1) {
              // not in array
              let obj = { name: judge.name, clicks: numClicks };

              updateData.push(obj);
            } else {
              updateData[index].clicks = numClicks;
            }

            window.localStorage.setItem('scunt-judges-profile', JSON.stringify(updateData));

            if (numClicks === 1 && clickProfile) {
              setTotalClicks(totalClicks + 1);
            }
          }, [numClicks]);

          if (judge.name === 'Tech Team') {
            if (showTechTeam) {
              return (
                <div key={judge.name}>
                  <ExecProfile
                    image={judge.img}
                    name={judge.name}
                    scuntJudge={true}
                    bribes={judge.content}
                    description={judge.description}
                  />
                </div>
              );
            } else {
              return <div key={judge.name} style={{ display: 'none' }}></div>;
            }
          } else {
            return (
              <div
                key={judge.name}
                onClick={() => {
                  setClickProfile(!clickProfile);
                  setNumClicks(numClicks + 1);
                }}
              >
                <ExecProfile
                  image={judge.img}
                  name={judge.name}
                  scuntJudge={true}
                  bribes={judge.content}
                  description={judge?.description}
                />
              </div>
            );
          }
        })}
      </div>
      <>
        {/* this popup will automatically disapear */}
        <Confetti animate={showTechTeamPopup} />
        <PopupModal
          trigger={showTechTeamPopup}
          setTrigger={setShowTechTeamPopup}
          blurBackground={false}
          exitIcon={false}
        >
          <div className="scunt-judges-bribe-message-popup">
            Secret Judges have been revealed! 🤫
          </div>
        </PopupModal>
      </>{' '}
      : <></>
      {/* wrapping to prevent seeing popup for a split second upon refresh */}
      {openPopup ? (
        <PopupModal trigger={openPopup} setTrigger={setOpenPopup} blurBackground={false}>
          <div className="scunt-judges-bribe-message-popup">
            Click the judges to reveal bribes! 😏
          </div>
        </PopupModal>
      ) : (
        <></>
      )}
    </>
  );
};

export { ScuntJudges };