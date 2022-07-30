import React, { useState, useEffect, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import './ScuntJudgeForm.scss';
import { Header } from '../../components/text/Header/Header';
import { TextInput } from '../../components/input/TextInput/TextInput';
import { useSelector } from 'react-redux';
import { userSelector } from '../userSlice';
import { list } from './scuntTempData';
import ReactSlider from 'react-slider';
import { Dropdown } from '../../components/form/Dropdown/Dropdown';
import { Button } from '../../components/button/Button/Button';
import { ErrorSuccessBox } from '../../components/containers/ErrorSuccessBox/ErrorSuccessBox';
import { QRScannerDisplay } from '../../components/QRScannerDisplay/QRScannerDisplay';
import { ButtonOutlined } from '../../components/button/ButtonOutlined/ButtonOutlined';
import { PopupModal } from '../../components/popup/PopupModal';
import { SnackbarContext } from '../../util/SnackbarProvider';

export const PageScuntJudgeForm = () => {
  const { user } = useSelector(userSelector);
  const teams = [
    'Team 1',
    'Team 2',
    'Team 3',
    'Team 4',
    'Team 5',
    'Team 6',
    'Team 7',
    'Team 8',
    'Team 9',
    'Team 10',
  ];
  return (
    <>
      {/* <Header text={"Missions"}/> */}
      <div className="navbar-space-top" />
      <div className="scunt-judge-form-page">
        <div className="scunt-judge-form-container">
          <h1>Judge Dashboard</h1>
          <h3>
            Hello,{' '}
            {user?.preferredName === '' || !user?.preferredName
              ? user?.firstName
              : user?.preferredName}
          </h3>
          <ScuntMissionSelection teams={teams} missions={list} />
          <div className="separator" />
          <ScuntBribePoints teams={teams} />
        </div>
      </div>
      <ScuntExecDashboard teams={teams} />
    </>
  );
};

const ScuntExecDashboard = ({ teams }) => {
  const [showPopUp, setShowPopUp] = useState(false);
  const [action, setAction] = useState('');
  const [amountOfRefillPoints, setAmountOfRefillPoints] = useState(0);
  const [amountOfRemovePoints, setAmountOfRemovePoints] = useState(0);
  const { setSnackbar } = useContext(SnackbarContext);

  const confirmAction = (action) => {
    setShowPopUp(true);
    setAction(action);
  };

  const performAction = async (action) => {
    if (action === 'Allow Missions Page') {
      console.log('allow missions page');
    } else if (action === 'Hide Missions Page') {
      console.log('hide missions page');
    } else if (action === 'Show Wedding Missions') {
      console.log('show wedding missions');
    } else if (action === 'Hide Wedding Missions') {
      console.log('hide wedding missions');
    } else if (action === 'Allow Leaderboard') {
      console.log('allow leaderboard');
    } else if (action === 'Hide Leaderboard') {
      console.log('hide leaderboard');
    } else if (action === 'Refill') {
      console.log(amountOfRefillPoints);
    } else if (action === 'Remove Points') {
      console.log(amountOfRemovePoints);
    }
    setSnackbar('Success: ' + action);
    setShowPopUp(false);
  };

  return (
    <>
      <div className="scunt-judge-form-page">
        <div className="scunt-judge-form-container">
          <h1>Exec Dashboard</h1>

          <div className="scunt-exec-dashboard">
            <div style={{ height: '15px' }} />

            <h2>Refill Bribe Points</h2>
            <div style={{ height: '5px' }} />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Dropdown
                values={['Judge 1', 'Judge 2']}
                initialSelectedIndex={0}
                onSelect={() => {}}
              />
              <div className="fill-remaining-width-input">
                <TextInput
                  placeholder={'# Points'}
                  onChange={(value) => {
                    setAmountOfRefillPoints(value);
                  }}
                />
              </div>
            </div>
            <Button label={'Refill'} onClick={() => confirmAction('Refill')} />

            <div style={{ height: '15px' }} />
            <h2>Negative Points</h2>
            <div style={{ height: '5px' }} />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Dropdown values={teams} initialSelectedIndex={0} onSelect={() => {}} />
              <div className="fill-remaining-width-input">
                <TextInput
                  placeholder={'# Points'}
                  onChange={(value) => {
                    setAmountOfRemovePoints(value);
                  }}
                />
              </div>
            </div>
            <Button label={'Remove Points'} onClick={() => confirmAction('Remove Points')} />

            <div style={{ height: '15px' }} />
            <h2>Controls</h2>
            <div style={{ height: '5px' }} />
            <Button
              label={'Allow Missions Page'}
              onClick={() => confirmAction('Allow Missions Page')}
            />
            <ButtonOutlined
              label={'Hide Missions Page'}
              onClick={() => confirmAction('Hide Missions Page')}
            />
            <Button
              label={'Show Wedding Missions'}
              onClick={() => confirmAction('Show Wedding Missions')}
            />
            <ButtonOutlined
              label={'Hide Wedding Missions'}
              onClick={() => confirmAction('Hide Wedding Missions')}
            />
            <Button
              label={'Allow Leaderboard'}
              onClick={() => confirmAction('Allow Leaderboard')}
            />
            <ButtonOutlined
              label={'Hide Leaderboard'}
              onClick={() => confirmAction('Hide Leaderboard')}
            />
          </div>
        </div>
      </div>
      <PopupModal
        trigger={showPopUp}
        setTrigger={setShowPopUp}
        blurBackground={false}
        exitIcon={true}
      >
        <div className="scunt-exec-dashboard-popup">
          <h2>Are you sure?</h2>
          <h3>{action}</h3>
          <Button
            label={'Yes'}
            onClick={() => {
              performAction(action);
            }}
          ></Button>
        </div>
      </PopupModal>
    </>
  );
};

ScuntExecDashboard.propTypes = {
  teams: PropTypes.array,
};

const ScuntBribePoints = ({ teams }) => {
  const [remainingBribePoints, setRemainingBribePoints] = useState(500);
  const [assignedPoints, setAssignedPoints] = useState(0);
  const [assignedTeam, setAssignedTeam] = useState('');
  const [clearPointsInput, setClearPointsInput] = useState(false);

  const { setSnackbar } = useContext(SnackbarContext);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ height: '15px' }} />
      <h2>Bribe Points</h2>
      <h4>Remaining bribe points: {remainingBribePoints}</h4>
      {remainingBribePoints === 0 ? (
        <></>
      ) : (
        <>
          <div style={{ height: '10px' }} />
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginLeft: '5px',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ width: '100%' }}>
              <Dropdown
                label={'Team'}
                initialSelectedIndex={0}
                values={teams}
                onSelect={(value) => {
                  setAssignedTeam(value);
                }}
                isDisabled={false}
                localStorageKey={'scunt-team-choice'}
              />
            </div>
            <div>
              <TextInput
                label={'Points'}
                placeholder={assignedPoints}
                onChange={(value) => {
                  if (isNaN(parseInt(value))) {
                    return;
                  }
                  if (value === '' || value === undefined) {
                    setAssignedPoints(0);
                  } else if (parseInt(value) >= remainingBribePoints) {
                    setAssignedPoints(remainingBribePoints);
                  } else {
                    setAssignedPoints(parseInt(value));
                  }
                }}
                setClearText={setClearPointsInput}
                clearText={clearPointsInput}
              />
            </div>
          </div>
          <div style={{ height: '10px' }} />
          <ReactSlider
            value={assignedPoints}
            defaultValue={0}
            max={remainingBribePoints > 500 ? 500 : remainingBribePoints}
            min={0}
            className="horizontal-slider"
            thumbClassName="slider-thumb"
            trackClassName="slider-track"
            renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
            onChange={(value) => {
              setAssignedPoints(value);
              setClearPointsInput(true);
            }}
          />
          <div style={{ height: '60px' }} />
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            <Button
              label={'Submit'}
              onClick={() => {
                setAssignedPoints(0);
                //Submit points here
                setRemainingBribePoints(remainingBribePoints - assignedPoints);
                setSnackbar(`Added ${assignedPoints} points to ${assignedTeam}`);
              }}
            />
          </div>
          <h2 style={{ textAlign: 'center' }}>{assignedTeam}</h2>
          <h3 style={{ textAlign: 'center' }}>{assignedPoints} Points</h3>
        </>
      )}
    </div>
  );
};

ScuntBribePoints.propTypes = {
  teams: PropTypes.array,
};

const ScuntMissionSelection = ({ missions, teams }) => {
  const extraPointsFactor = 0.3;
  const minPointsFactor = 0.3;
  const [assignedMission, setAssignedMission] = useState(undefined);
  const [searchedMissions, setSearchedMissions] = useState([]);
  const [assignedPoints, setAssignedPoints] = useState(0);
  const [assignedTeam, setAssignedTeam] = useState('');
  const [clearText, setClearText] = useState(false);
  const [clearPointsInput, setClearPointsInput] = useState(false);
  const [hasQRScanned, setHasQRScanned] = useState(false);
  const { setSnackbar } = useContext(SnackbarContext);

  const getMissionSearchName = (searchName) => {
    if (searchName === '') {
      setSearchedMissions([]);
      return;
    }
    const output = [];
    for (let mission of missions) {
      if (mission?.name?.toLowerCase().includes(searchName.toLowerCase())) {
        output.push(mission);
      }
    }
    setSearchedMissions(output);
  };

  const getMissionSearchID = (searchNumber) => {
    for (let mission of missions) {
      if (mission?.number?.toString() === searchNumber.toString()) {
        setSearchedMissions([mission]);
        setAssignedMission(mission);
        setAssignedPoints(mission?.points);
        return;
      }
    }
    getMissionSearchName('');
  };

  return (
    <>
      <QRScannerDisplay
        setScannedData={(data) => {
          const missionID = data.split('|')[1];
          if (missionID === undefined) {
            setSnackbar('There was an error with the QR code', true);
            return;
          }
          for (let mission of missions) {
            if (mission?.number.toString() === missionID.toString()) {
              setAssignedPoints(mission?.points);
              setAssignedMission(undefined);
              setAssignedMission(mission);
            }
          }
          const team = data.split('|')[0];
          if (team === undefined) {
            setSnackbar('There was an error with the QR code', true);
            return;
          } else if (!teams.includes(team)) {
            setSnackbar('There was an error with the QR code', true);
            return;
          }
          setAssignedTeam(team);
          setHasQRScanned(true);
        }}
      />
      <h2>Mission Points</h2>
      <p className="text-input-title">{'Search for a mission'}</p>
      <div className="small-width-input">
        <TextInput
          clearText={clearText}
          setClearText={setClearText}
          placeholder={'#'}
          errorFeedback={''}
          onChange={(value) => {
            if (hasQRScanned === true) setHasQRScanned(false);
            setAssignedMission(undefined);
            getMissionSearchID(value);
          }}
          onEnterKey={(value) => {
            if (hasQRScanned === true) setHasQRScanned(false);
            setAssignedMission(searchedMissions[0]);
            setAssignedPoints(searchedMissions[0]?.points);
          }}
        />
      </div>
      <div className="fill-remaining-width-input">
        <TextInput
          clearText={clearText}
          setClearText={setClearText}
          placeholder={'Search by name'}
          errorFeedback={''}
          onChange={(value) => {
            if (hasQRScanned === true) setHasQRScanned(false);
            setAssignedMission(undefined);
            getMissionSearchName(value);
          }}
          onEnterKey={(value) => {
            if (hasQRScanned === true) setHasQRScanned(false);
            setAssignedMission(searchedMissions[0]);
            setAssignedPoints(searchedMissions[0]?.points);
          }}
        />
      </div>
      {assignedMission !== undefined ? (
        <div
          style={{ width: '100%', cursor: 'pointer', marginRight: '9px' }}
          onClick={() => {
            setAssignedMission(undefined);
            setSearchedMissions([]);
            setClearText(true);
          }}
        >
          <ScuntMissionEntry mission={assignedMission} selected />
        </div>
      ) : (
        searchedMissions.map((mission) => {
          return (
            <div
              key={mission?.number}
              style={{ width: '100%', cursor: 'pointer', marginRight: '9px' }}
              onClick={() => {
                setAssignedMission(mission);
                setAssignedPoints(mission?.points);
                window.scrollTo(0, 0);
              }}
            >
              <ScuntMissionEntry mission={mission} />
            </div>
          );
        })
      )}
      {assignedMission !== undefined ? (
        <div style={{ width: '100%', marginRight: '2px', marginTop: '20px' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginLeft: '5px',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {hasQRScanned === false ? (
              <div style={{ width: '100%' }}>
                <Dropdown
                  label={'Team'}
                  initialSelectedIndex={0}
                  values={teams}
                  onSelect={(value) => {
                    setAssignedTeam(value);
                  }}
                  isDisabled={false}
                  localStorageKey={'scunt-team-choice'}
                />
              </div>
            ) : (
              <div style={{ width: '100%' }}>
                <p style={{ marginBottom: '8px' }}>Team</p>
                <h2>{assignedTeam}</h2>
              </div>
            )}
            <div>
              <TextInput
                label={'Points'}
                placeholder={assignedPoints}
                onChange={(value) => {
                  console.log('VALUE', value);
                  if (isNaN(parseInt(value))) {
                    return;
                  }
                  const maxPoints =
                    parseInt(assignedMission?.points) +
                    parseInt(assignedMission?.points * extraPointsFactor);
                  const minPoints =
                    parseInt(assignedMission?.points) -
                    parseInt(assignedMission?.points * minPointsFactor);
                  if (value === '' || value === undefined) {
                    setAssignedPoints(assignedMission?.points);
                  } else if (parseInt(value) >= maxPoints) {
                    setAssignedPoints(maxPoints);
                  } else if (parseInt(value) <= minPoints) {
                    setAssignedPoints(minPoints);
                  } else {
                    setAssignedPoints(parseInt(value));
                  }
                }}
                setClearText={setClearPointsInput}
                clearText={clearPointsInput}
              />
            </div>
          </div>

          <div style={{ height: '15px' }} />
          <p style={{ textAlign: 'center' }}>
            <b>This mission has already been completed by this team.</b>
          </p>
          <div style={{ height: '15px' }} />
          <ReactSlider
            value={assignedPoints}
            defaultValue={parseInt(assignedMission?.points)}
            max={
              parseInt(assignedMission?.points) +
              parseInt(assignedMission?.points * extraPointsFactor)
            }
            min={
              parseInt(assignedMission?.points) -
              parseInt(assignedMission?.points * minPointsFactor)
            }
            className="horizontal-slider"
            thumbClassName="slider-thumb"
            trackClassName="slider-track"
            renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
            onChange={(value) => {
              setAssignedPoints(value);
              setClearPointsInput(true);
            }}
          />
          <div
            style={{
              width: '100%',
              marginTop: '60px',
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            <Button
              label={'Submit'}
              onClick={() => {
                window.scrollTo(0, 0);
                //Submit points here
                setSnackbar(
                  `Added ${assignedPoints} points to ${assignedTeam} for ${assignedMission?.name}`,
                );
                setAssignedPoints(0);
                setClearText(true);
                setAssignedMission(undefined);
                setSearchedMissions([]);
                setHasQRScanned(false);
              }}
            />
          </div>
          <h2 style={{ textAlign: 'center' }}>{assignedTeam}</h2>
          <h3 style={{ textAlign: 'center' }}>
            Mission {assignedMission?.number} - {assignedPoints} Points
          </h3>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

ScuntMissionSelection.propTypes = {
  missions: PropTypes.array,
  teams: PropTypes.array,
};

export const ScuntMissionEntry = ({ mission, selected }) => {
  return (
    <div className={`scunt-mission-entry ${selected ? 'scunt-mission-entry-selected' : ''}`}>
      <h3 className="mission-id">{mission?.number}</h3>
      <p className="mission-name">{mission?.name}</p>
      <h3 className="mission-points">{mission?.points}</h3>
    </div>
  );
};

ScuntMissionEntry.propTypes = {
  mission: PropTypes.object,
  selected: PropTypes.bool,
};