import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import './ScuntGameSettings.scss';

import { TextInput } from '../../components/input/TextInput/TextInput';
import { Button } from '../../components/button/Button/Button';

import { useDispatch, useSelector } from 'react-redux';
import { requestPasswordResetSelector, userSelector } from '../../state/user/userSlice';
import { getGameSettings, setGameSettings } from './functions';
import { SnackbarContext } from '../../util/SnackbarProvider';

import useAxios from '../../hooks/useAxios';
const { axios } = useAxios();

const scuntsettings = [
  {
    parameter: 'Amount of Teams',
    key: 'amountOfTeams', // key in the model
    default: 10,
  },
  {
    parameter: 'Amount of Starter Bribe Points',
    key: 'amountOfStarterBribePoints',
    description: 'Set all judges bribe points to this number when the game starts',
    default: 10000,
  },
  {
    parameter: 'Max Amount of Points',
    key: 'maxAmountPointsPercent',
    description:
      'The max amount of points allowed to be given out over the recommended amount for missions',
    default: 0.3,
  },
  {
    parameter: 'Min Amount of Points',
    key: 'minAmountPointsPercent',
    description:
      'The min amount of points allowed to be given out over the recommended amount for missions',
    default: 0.3,
  },
];

const ScuntGameSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialSettings = {
    name: 'Scunt2T2 Settings',
    amountOfTeams: 10,
    amountOfStarterBribePoints: 10000,
    maxAmountPointsPercent: 0.3,
    minAmountPointsPercent: 0.3,
    revealTeams: true,
    discordLink: true,
    revealLeaderboard: true,
    revealMissions: true,
    allowJudging: true,
  };

  const [newSettings, setNewSettings] = useState(initialSettings);
  const { setSnackbar } = useContext(SnackbarContext);

  const startScuntButton = async () => {
    console.log(newSettings);
    const result = await setGameSettings(newSettings);
    if (result !== true) {
      setSnackbar('Error', true);
    } else {
      setSnackbar('Starting Scunt!', false);
    }
  };

  const getGameSettings = async () => {
    try {
      // getting stuff from backend
      const response = await axios.get('/scunt-game-controls');
      setSnackbar('Starting Scunt!', false);
      console.log(response);
    } catch (error) {
      console.log(error);
      setSnackbar('Error', true);
    }
  };

  useEffect(() => {
    console.log(newSettings);
  }, []);

  return (
    <div className="scunt-game-settings-page">
      <Button
        label="Back to Profile"
        onClick={() => {
          navigate('/profile');
        }}
        style={{ marginBottom: '25px' }}
      />

      <div className="scunt-game-settings-container">
        <p style={{ color: 'var(--text-dynamic)', textAlign: 'center' }}>
          Note: placeholder are the default values!
        </p>

        {scuntsettings.map((i) => {
          return (
            <div key={i.parameter}>
              <ScuntGameSettingsTextbox
                objKey={i.key}
                parameter={i.parameter}
                description={i.description}
                placeholder={i.default}
                newSettings={newSettings}
                setNewSettings={setNewSettings}
              />
            </div>
          );
        })}

        <Button
          label="Start Scunt!"
          isSecondary={true}
          style={{ width: '50%', justifySelf: 'center', margin: '0 auto' }}
          onClick={() => {
            //dispatch or something here...!
          }}
        ></Button>
      </div>
    </div>
  );
};

const ScuntGameSettingsTextbox = ({
  objKey,
  parameter,
  description,
  placeholder,
  newSettings,
  setNewSettings,
}) => {
  const [changes, setChanges] = useState(false);
  const [input, setInput] = useState('');

  //console.log(objKey);

  return (
    <div className="scunt-game-settings-textbox-container">
      <div className="scunt-game-settings-textbox">
        <TextInput
          inputType={'text'}
          label={parameter}
          description={description}
          onChange={(amount) => {
            setInput(amount);
            setChanges(true);
          }}
          placeholder={String(placeholder)}
          onEnterKey={(amount) => {
            newSettings[objKey] = parseFloat(input);
            setNewSettings(newSettings);
            setChanges(false);
            console.log(newSettings);
          }}
        ></TextInput>
        <Button
          label="Submit"
          onClick={() => {
            newSettings[objKey] = parseFloat(input);
            setNewSettings(newSettings);
            console.log(newSettings);
            setChanges(false);
          }}
          isDisabled={!changes}
        ></Button>
      </div>
    </div>
  );
};

ScuntGameSettingsTextbox.propTypes = {
  objKey: PropTypes.string,
  parameter: PropTypes.string,
  description: PropTypes.string,
  placeholder: PropTypes.number,
  newSettings: PropTypes.object,
  setNewSettings: PropTypes.func,
};

export { ScuntGameSettings };
