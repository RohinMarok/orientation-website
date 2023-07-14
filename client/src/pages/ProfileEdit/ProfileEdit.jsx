import React from 'react';
import './ProfileEdit.scss';
import { PageRegistrationForm } from '../Registration/RegistrationForm';
import { registeredSelector, userSelector } from '../../state/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserInfo } from '../../state/user/saga';
import { useNavigate } from 'react-router-dom';

const PageProfileEdit = () => {
  const { user } = useSelector(userSelector);
  const isRegistered = useSelector(registeredSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const submit = (newInfo) => {
    dispatch(updateUserInfo({ newInfo, navigate, isRegistered }));
  };
  if (!isRegistered) {
    navigate('/profile');
  }
  const { ProfilePageFroshHeader } = import('../Profile/PageProfileFrosh');

  return (
    <>
      {isRegistered && (
        <>
          <ProfilePageFroshHeader editButton={false} />
          <div className="edit-form-container">
            <PageRegistrationForm
              editFieldsPage={true}
              initialValues={user}
              onEditSubmit={submit}
            />
          </div>
        </>
      )}
    </>
  );
};

export { PageProfileEdit };
