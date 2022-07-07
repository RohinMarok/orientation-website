import { useState } from 'react';
import PropTypes from 'prop-types';
import { React, useEffect } from 'react';

import './AccountsApproval.scss';
import './AccountsPageNumber.scss';
import './ApproveDenyCheckbox.scss';

import { TestEmails, sendApprovedEmails } from './functions';
import { ButtonOutlined } from '../../components/button/ButtonOutlined/ButtonOutlined';
import { Button } from '../../components/button/Button/Button';

import GrayCross from '../../assets/misc/xmark-solid-gray.svg';
import WhiteCross from '../../assets/misc/xmark-solid-white.svg';
import GrayCheck from '../../assets/misc/check-solid-gray.svg';
import WhiteCheck from '../../assets/misc/check-solid-white.svg';
import ArrowRight from '../../assets/steps/arrow-right-solid-purple.svg';
import ArrowLeft from '../../assets/steps/arrow-left-solid-purple.svg';

const bubbleButtonStyle = {
  borderWidth: '3px',
};
const bubbleButtonStyleClick = {
  borderWidth: '3px',
  fontWeight: 'bold',
};

const AllAccountsTable = ({ numResultsDisplayed }) => {
  const [emailList, setEmailList] = useState(TestEmails); // email list that is displayed
  const [isApproveVerified, setIsApproveVerified] = useState(false); // approve state for emails that match frosh leedur email list
  const [accountStatus, setAccountStatus] = useState([]); // this is an array that will store objects -- email and approved and deny status

  useEffect(() => {
    setEmailList(TestEmails);
  }, [emailList]);

  // states for displaying n results per page
  const [currentPage, setCurrentPage] = useState(1); // default to display page 1

  // numResultsDisplayed = the number of results you want to display per page
  let pageNumber = Math.ceil(emailList.length / numResultsDisplayed); // the number of page numbers you will have
  let numCurrentlyDisplayed = 0;
  let nthAccount = numResultsDisplayed * (currentPage - 1); // the nth account that is the first to be displayed on the page

  // make an array that stores page numbers
  let pageNumberList = [];
  for (let i = 1; i <= pageNumber; i++) {
    pageNumberList.push(i); // add each page # to list
  }

  return (
    <div className="all-accounts-container">
      {/* adding buttons */}
      <div className="all-accounts-buttons">
        <ButtonOutlined
          label={isApproveVerified ? 'Approved Verified Accounts' : 'Approve All Verified Accounts'}
          style={isApproveVerified ? bubbleButtonStyleClick : bubbleButtonStyle}
          isSecondary={true}
          onClick={() => {
            setIsApproveVerified(!isApproveVerified);
          }}
        />
        <Button
          label="Save"
          onClick={() => {
            sendApprovedEmails(accountStatus);
          }}
        />
      </div>

      <table className="all-accounts-table">
        <tbody>
          <tr className="all-accounts-table-header-row">
            <th className="all-accounts-table-header">Verified</th>
            <th className="all-accounts-table-header-left-align">Email</th>
            <th className="all-accounts-table-header">Approve/Deny</th>
          </tr>

          {emailList.map((account) => {
            numCurrentlyDisplayed++;

            // only display a certain number of accounts if the number is between the ranges
            if (
              numCurrentlyDisplayed >= nthAccount + 1 &&
              numCurrentlyDisplayed <= nthAccount + numResultsDisplayed
            ) {
              const [approve, setApprove] = useState(account.approved);
              const [deny, setDeny] = useState(account.deny);

              useEffect(() => {
                // when the page changes, set everything to false
                setAccountStatus([]);
                setApprove(false);
                setDeny(false);
                setIsApproveVerified(false);
              }, [currentPage]);

              useEffect(() => {
                if (isApproveVerified && account.valid) {
                  setApprove(true);
                  setDeny(false);
                } else {
                  setApprove(false);
                }
              }, [isApproveVerified]);

              useEffect(() => {
                // adding objec to state var array that will be "sent" to the backend
                // TODO: bug -- initial click of save, has an entry in the accountStatus array, it should be empty...
                const object = {
                  key: account.email,
                  email: account.email,
                  approve: approve,
                  deny: deny,
                };

                if (accountStatus.filter((obj) => obj.email === account.email).length > 0) {
                  accountStatus.map((e) => {
                    // if email in array
                    if (e.email === account.email) {
                      e.approve = approve;
                      e.deny = deny;
                    }
                  });
                } else {
                  // wrapper function as a call-back, found this online?
                  // TODO: what's the difference between including wrapper function and no wrapper function?
                  setAccountStatus((accountStatus) => accountStatus.concat(object));
                }
              }, [approve, deny]);

              return (
                <tr className="all-accounts-row" key={account.email}>
                  <td className="all-account-data-verified-container">
                    {/* verified indication */}
                    <div
                      className={`verified-circle ${
                        account.valid ? 'green-verified-circle' : 'gray-verified-circle'
                      }`}
                    ></div>
                  </td>
                  <td className="all-account-data">
                    {/* email */}
                    <p className="all-account-data-email">{account.email}</p>
                  </td>
                  <td className="all-account-data-checkboxes">
                    {/* approve or deny component */}
                    <>
                      <div
                        className="approve-deny-checkbox-container"
                        style={{ marginLeft: 'auto', marginRight: 'auto' }}
                      >
                        <div
                          className={`approve-deny-checkbox ${
                            approve ? 'approve-green-check' : 'approve-gray-checkbox'
                          }`}
                          onClick={() => {
                            if (deny) {
                              setDeny(false);
                              setApprove(true);
                            } else {
                              setApprove(!approve);
                            }
                          }}
                        >
                          <img
                            className="approve-icon"
                            src={`${approve ? WhiteCheck : GrayCheck}`}
                            alt="approval check"
                          />
                        </div>

                        <div
                          className={`approve-deny-checkbox ${
                            deny ? 'approve-red-cross' : 'approve-gray-checkbox'
                          }`}
                          onClick={() => {
                            if (approve) {
                              setApprove(false);
                              setDeny(true);
                            } else {
                              setDeny(!deny);
                            }
                          }}
                        >
                          <img
                            className="deny-icon"
                            src={`${deny ? WhiteCross : GrayCross}`}
                            alt="deny cross"
                          />
                        </div>
                      </div>
                    </>
                  </td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>

      {/* page numbers thing */}
      <div className="accounts-page-number-container">
        <div className="page-number-arrow-container">
          <img
            className="page-number-arrow"
            src={ArrowLeft}
            alt="left arrow"
            onClick={() => {
              if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
              }
            }}
          />
        </div>
        {pageNumberList.map((num) => {
          return (
            <div
              key={num}
              className={`accounts-page-number-box ${
                num === currentPage ? 'accounts-page-number-box-current' : ''
              }`}
              style={
                num === 1
                  ? { borderLeftWidth: '2px' }
                  : num === pageNumber
                  ? { borderRightWidth: '2px' }
                  : {}
              }
              onClick={() => {
                setCurrentPage(num);
              }}
            >
              <p>{num}</p>
            </div>
          );
        })}
        <div className="page-number-arrow-container">
          <img
            className="page-number-arrow"
            src={ArrowRight}
            alt="right arrow"
            onClick={() => {
              if (currentPage < pageNumber) {
                setCurrentPage(currentPage + 1);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

AllAccountsTable.propTypes = {
  numResultsDisplayed: PropTypes.number,
};

export { AllAccountsTable };
