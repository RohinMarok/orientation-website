import { React, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { getQuestions, submitQuestion } from './functions';
import './FAQ.scss';
import Wave from '../../assets/misc/wave-reverse.png';
import WaveDarkMode from '../../assets/darkmode/misc/wave-reverse.png';
import { ButtonSelector } from '../../components/buttonSelector/buttonSelector/ButtonSelector';
import { SingleAccordion } from '../../components/text/Accordion/SingleAccordion/SingleAccordion';
import { Button } from '../../components/button/Button/Button';
import { ButtonOutlined } from '../../components/button/ButtonOutlined/ButtonOutlined';
import { TextInput } from '../../components/input/TextInput/TextInput';
import SearchIcon from '../../assets/misc/magnifying-glass-solid.svg';
import DeleteIcon from '../../assets/misc/circle-xmark-solid.svg';
import { ErrorSuccessBox } from '../../components/containers/ErrorSuccessBox/ErrorSuccessBox';
import LoadingAnimation from '../../components/misc/LoadingAnimation/LoadingAnimation';
import QuestionMark from '../../../assets/icons/question-mark-solid.svg';

import { PopupModal } from '../../components/popup/PopupModal';
import { userSelector } from '../userSlice';
import { useSelector } from 'react-redux';

const PageFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSearch, setIsSearch] = useState(false);
  const [isMultiSearch, setIsMultiSearch] = useState(false);
  const [isNoMatch, setIsNoMatch] = useState(false);
  const [selectedSearchResult, setSelectedSearchResult] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageState, setPageState] = useState('form');
  const data = getQuestions();
  const unsortedQuestions = [];
  const questionsObjects = {};
  const questionCategories = [];
  const { user } = useSelector(userSelector);
  for (let i = 0; i < data.length; i++) {
    if (!questionsObjects.hasOwnProperty(data[i].category)) {
      questionsObjects[data[i].category] = [];
      questionsObjects[data[i].category].push({
        question: data[i].question,
        answer: data[i].answer,
      });
      questionCategories.push({ name: data[i].category });
    } else {
      questionsObjects[data[i].category].push({
        question: data[i].question,
        answer: data[i].answer,
      });
    }
    unsortedQuestions.push({
      question: data[i].question,
      answer: data[i].answer,
      id: i,
      category: data[i].category,
    });
  }
  const allQuestions = [];
  for (let i = 0; i < Object.keys(questionsObjects).length; i++) {
    allQuestions.push(questionsObjects[Object.keys(questionsObjects)[i]]);
  }

  return (
    <div>
      <div>
        <FAQPageHeader
          questions={unsortedQuestions}
          setIsSearch={setIsSearch}
          setIsMultiSearch={setIsMultiSearch}
          setSelectedQuestion={setSelectedQuestion}
          setSelectedQuestions={setSelectedQuestions}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedSearchResult={selectedSearchResult}
          setSelectedSearchResult={setSelectedSearchResult}
          setIsNoMatch={setIsNoMatch}
          setActiveIndex={setActiveIndex}
          questionCategories={questionCategories}
        />
        <img src={Wave} className={'faq-wave-image faq-page-top-wave-image'} />
        <img src={WaveDarkMode} className={'faq-wave-image faq-page-top-wave-image-darkmode'} />
        <div
          className={`faq-button-selector-container ${
            isSearch ? 'faq-hide-button-selector' : 'faq-show-button-selector'
          }`}
        >
          <FAQButtons
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            setIsSearch={setIsSearch}
            setIsMultiSearch={setIsMultiSearch}
            setSearchQuery={setSearchQuery}
            questionCategories={questionCategories}
          />
        </div>
        <div
          className={`faq-accordion-container ${
            isSearch ? 'faq-hide-accordion' : 'faq-show-accordion'
          }`}
        >
          <FAQCategoryAccordions
            allQuestions={allQuestions}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
        </div>
        <div
          className={`faq-display-questions-container ${
            isSearch ? 'faq-show-accordion' : 'faq-hide-accordion'
          }`}
        >
          <div
            className={`${
              !isMultiSearch && !isNoMatch ? 'faq-show-accordion' : 'faq-hide-accordion'
            }`}
          >
            <FAQDisplaySearchQuestion
              selectedQuestion={selectedQuestion}
              questions={unsortedQuestions}
            />
          </div>
          <div
            className={`${
              isMultiSearch && !isNoMatch ? 'faq-show-accordion' : 'faq-hide-accordion'
            }`}
          >
            <h1 className="faq-all-search-results">Search results...</h1>
            <FAQDisplayAllSearchQuestion selectedQuestions={selectedQuestions} />
          </div>
          <div
            className={`faq-no-results ${isNoMatch ? 'faq-show-accordion' : 'faq-hide-accordion'}`}
          >
            <h1>No results</h1>
          </div>
        </div>
        <FAQFab pageState={pageState} setPageState={setPageState} user={user} />
      </div>
    </div>
  );
};

const FAQPageHeader = ({
  questions,
  setIsSearch,
  setSelectedQuestion,
  searchQuery,
  setSearchQuery,
  selectedSearchResult,
  setSelectedSearchResult,
  setSelectedQuestions,
  setIsMultiSearch,
  setIsNoMatch,
  setActiveIndex,
  questionCategories,
}) => {
  const filterQuestions = (questions, query) => {
    if (!query) {
      return questions;
    }
    return questions.filter((question) => {
      const questionName = question.question.toLowerCase();
      return questionName.includes(query.toLowerCase());
    });
  };

  const filteredQuestions = filterQuestions(questions, searchQuery);
  const handleDeleteIconClick = () => {
    setSearchQuery('');
    setIsSearch(false);
  };
  return (
    <>
      <div className="navbar-space-top" />
      <div className={'faq-page-header'}>
        <div className={'faq-page-header-container'}>
          <div className="faq-page-header-text">
            <h1>FAQ</h1>
            <p>How can we help you?</p>
          </div>
          <div className="faq-page-header-search">
            <div
              className="searchIcon"
              style={{
                borderRadius:
                  searchQuery.length > 0 && !selectedSearchResult && filteredQuestions.length > 0
                    ? '15px 0px 0px 0px'
                    : '',
              }}
              // onClick={() => handleSearchIconClick()}
            >
              <img src={SearchIcon} alt="Search Button" height={30} />
            </div>
            <div className={'faq-page-header-searchbar'}>
              <FAQSearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setIsSearch={setIsSearch}
                setIsMultiSearch={setIsMultiSearch}
                setSelectedQuestion={setSelectedQuestion}
                questions={filteredQuestions}
                selectedSearchResult={selectedSearchResult}
                setSelectedSearchResult={setSelectedSearchResult}
                setIsNoMatch={setIsNoMatch}
                setSelectedQuestions={setSelectedQuestions}
                setActiveIndex={setActiveIndex}
                questionCategories={questionCategories}
              />
            </div>
            <div
              className="deleteIcon"
              style={{
                borderRadius:
                  searchQuery.length > 0 && !selectedSearchResult && filteredQuestions.length > 0
                    ? '0px 15px 0px 0px'
                    : '',
              }}
            >
              {searchQuery.length > 0 ? (
                <img
                  onClick={() => handleDeleteIconClick()}
                  src={DeleteIcon}
                  alt="Search Button"
                  height={30}
                />
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

FAQPageHeader.propTypes = {
  questions: PropTypes.array.isRequired,
  setIsSearch: PropTypes.func.isRequired,
  setSelectedQuestion: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  selectedSearchResult: PropTypes.number.isRequired,
  setSelectedSearchResult: PropTypes.bool.isRequired,
  setSelectedQuestions: PropTypes.func.isRequired,
  setIsMultiSearch: PropTypes.func.isRequired,
  setIsNoMatch: PropTypes.bool.isRequired,
  setActiveIndex: PropTypes.number.isRequired,
  questionCategories: PropTypes.array.isRequired,
};

const FAQButtons = ({
  activeIndex,
  setActiveIndex,
  setIsSearch,
  setSearchQuery,
  questionCategories,
}) => {
  return (
    <div
      onClick={() => {
        setIsSearch(false);
        setSearchQuery('');
      }}
    >
      <ButtonSelector
        buttonList={questionCategories}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        maxWidthButton={200}
      />
    </div>
  );
};

FAQButtons.propTypes = {
  activeIndex: PropTypes.number.isRequired,
  setActiveIndex: PropTypes.func.isRequired,
  setIsSearch: PropTypes.func.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  questionCategories: PropTypes.array.isRequired,
};

const FAQCategoryAccordions = ({ allQuestions, activeIndex }) => {
  const questionsAccordion = allQuestions[activeIndex].map((question, index) => (
    <div key={index} className={'faq-accordion-wrapper'}>
      <FAQAccordionWrapper scheduleData={question} openStatus={false} activeIndex={activeIndex} />
    </div>
  ));
  return <div>{questionsAccordion}</div>;
};

FAQCategoryAccordions.propTypes = {
  allQuestions: PropTypes.array.isRequired,
  activeIndex: PropTypes.number.isRequired,
};

const FAQAccordionWrapper = ({ scheduleData, openStatus, activeIndex }) => {
  const [isOpen, setIsOpen] = useState(openStatus);
  useEffect(() => {
    setIsOpen(false);
  }, [activeIndex]);
  return (
    <SingleAccordion
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      header={<div className={'faq-search-result-question-accordion'}>{scheduleData.question}</div>}
      style={{ backgroundColor: '#ecd6ff', padding: '0px 30px 0px 30px' }}
    >
      <div className={'faq-search-result-answer-accordion'}>{scheduleData.answer}</div>
    </SingleAccordion>
  );
};

FAQAccordionWrapper.propTypes = {
  scheduleData: PropTypes.object.isRequired,
  openStatus: PropTypes.bool.isRequired,
  activeIndex: PropTypes.number.isRequired,
};

const FAQSearchBar = ({
  searchQuery,
  setSearchQuery,
  setIsSearch,
  setIsMultiSearch,
  setSelectedQuestion,
  questions,
  selectedSearchResult,
  setSelectedSearchResult,
  setIsNoMatch,
  setSelectedQuestions,
  setActiveIndex,
  questionCategories,
}) => {
  useEffect(() => {
    setIsSearch(true);
    setSelectedQuestions(questions);
    setIsMultiSearch(true);
    setSelectedSearchResult(true);
    if (questions.length == 0) {
      setIsNoMatch(true);
    } else if (searchQuery == '') {
      setIsSearch(false);
    } else {
      setIsNoMatch(false);
    }
  }, [searchQuery]);
  const handleQueryChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedSearchResult(false);
    if (e.target.value == '') {
      setIsSearch(false);
    }
  };

  return (
    <div className={'faq-search'}>
      <div className={'faq-search-input'}>
        <input
          value={searchQuery}
          onInput={(e) => handleQueryChange(e)}
          type="text"
          placeholder={'Search for a question'}
        />
      </div>
    </div>
  );
};

FAQSearchBar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  setIsSearch: PropTypes.func.isRequired,
  setIsMultiSearch: PropTypes.func.isRequired,
  setSelectedQuestion: PropTypes.func.isRequired,
  questions: PropTypes.array.isRequired,
  selectedSearchResult: PropTypes.bool.isRequired,
  setSelectedSearchResult: PropTypes.func.isRequired,
  setIsNoMatch: PropTypes.bool.isRequired,
  setSelectedQuestions: PropTypes.func.isRequired,
  setActiveIndex: PropTypes.number.isRequired,
  questionCategories: PropTypes.array.isRequired,
};

const FAQDisplaySearchQuestion = ({ selectedQuestion, questions }) => {
  return (
    <div className={'faq-search-result-container'}>
      <div className={'faq-search-result-question'}>{questions[selectedQuestion].question}</div>
      <div className={'faq-search-result-answer'}>{questions[selectedQuestion].answer}</div>
    </div>
  );
};

FAQDisplaySearchQuestion.propTypes = {
  selectedQuestion: PropTypes.number.isRequired,
  questions: PropTypes.array.isRequired,
};

const FAQDisplayAllSearchQuestion = ({ selectedQuestions, questions }) => {
  const allSearchQuestions = selectedQuestions.map((question, index) => (
    <div key={index} className={'faq-search-result-container'}>
      <div className={'faq-search-result-question'}>{question.question}</div>
      <div className={'faq-search-result-answer'}>{question.answer}</div>
    </div>
  ));
  return <div>{allSearchQuestions}</div>;
};

FAQDisplayAllSearchQuestion.propTypes = {
  selectedQuestions: PropTypes.array.isRequired,
  questions: PropTypes.array.isRequired,
};

const FAQAskQuestion = ({ pageState, setPageState, user }) => {
  const [signUpError, setSignUpError] = useState('');
  const [errorColor, setErrorColor] = useState(false);
  const initialFormData = {
    question: '',
    email: user?.email ?? '',
  };
  const [emailText, setEmailText] = useState({ email: user ? user.email : '' });
  const [questionText, setQuestionText] = useState({});
  const [formData, updateFormData] = useState(initialFormData);
  const [clearText, setClearText] = useState(false);
  useEffect(() => {
    updateFormData({ question: questionText.question, email: emailText.email });
  }, [emailText, questionText]);
  const handleChangeEmail = (text) => {
    let newEmailState = { ...emailText };
    newEmailState.email = text;
    setEmailText(newEmailState);
  };
  const handleChangeQuestion = (text) => {
    let newQuestionState = { ...questionText };
    newQuestionState.question = text;
    setQuestionText(newQuestionState);
  };
  async function handleSubmit(text) {
    // console.log(submitQuestion(formData));
    //console.log(formData);
    if (formData?.question?.length > 0 && formData?.email?.length > 0) {
      setPageState('loading');
      const result = await submitQuestion(formData);
      if (result !== true) {
        setSignUpError(result);
        setErrorColor(true);
        setPageState('form');
      } else {
        setPageState('success');
        updateFormData(initialFormData);
        setClearText(true);
        setSignUpError('Thank you for submitting your question!');
        setErrorColor(false);
        setPageState('form');
      }
    }
  }

  return (
    <div className={'faq-ask-question-container'}>
      <div className={'faq-ask-question-stacking'}>
        <div
          className={`faq-page-questions ${
            pageState !== 'form' ? 'faq-page-disappear' : 'faq-page-appear'
          }`}
        >
          <h1 className={'faq-ask-question-title'}>Can&apos;t Find Your Question?</h1>
          <ErrorSuccessBox content={signUpError} error={errorColor} success={!errorColor} />
          <form>
            <label>
              <div className={'faq-ask-question-email-box'}>
                <TextInput
                  onChange={(text) => handleChangeEmail(text)}
                  inputType={'text'}
                  placeholder={'Email'}
                  initialValue={emailText.email}
                  style={{ height: '45px' }}
                  clearText={clearText}
                  setClearText={setClearText}
                />
              </div>
            </label>
            <label>
              <div className={'faq-ask-question-box'}>
                <TextInput
                  onChange={(text) => handleChangeQuestion(text)}
                  inputType={'textArea'}
                  placeholder={'Type your question here...'}
                  style={{ height: '150px', resize: 'vertical' }}
                  clearText={clearText}
                  setClearText={setClearText}
                />
              </div>
            </label>
            <div style={{ textAlign: 'center' }}>
              <Button label={'Submit'} onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </form>
        </div>
        <div
          className={`faq-loading ${pageState === 'loading' ? 'faq-loading-appear' : ''} 
          ${pageState === 'success' ? 'faq-loading-disappear' : ''}`}
        >
          <LoadingAnimation size={'60px'} />
        </div>
      </div>
    </div>
  );
};

FAQAskQuestion.propTypes = {
  pageState: PropTypes.string.isRequired,
  setPageState: PropTypes.string.isRequired,
  user: PropTypes.object,
};

const FAQFab = ({ pageState, setPageState, user }) => {
  const [showPopUp, setShowPopUp] = useState(false);

  return (
    <>
      <PopupModal
        trigger={showPopUp}
        setTrigger={setShowPopUp}
        blurBackground={false}
        exitIcon={true}
      >
        <div className="ask-question-popup">
          <div className={'faq-ask-question-outer-container'}>
            <FAQAskQuestion pageState={pageState} setPageState={setPageState} user={user} />
          </div>
        </div>
      </PopupModal>
      <div className={'faq-fab'}>
        <Button
          style={{ boxShadow: '5px 5px 20px #13131362' }}
          class_options={'faq-fab-button'}
          label={
            <div className={'faq-fab-container'}>
              <img
                className={'faq-fab-icon'}
                src={QuestionMark}
                alt="Question Button"
                height={30}
              />
              <span className={'faq-fab-content'}>Ask a Question</span>
            </div>
          }
          isSecondary
          onClick={() => {
            setShowPopUp(true);
          }}
        />
      </div>
    </>
  );
};

FAQFab.propTypes = {
  pageState: PropTypes.string.isRequired,
  setPageState: PropTypes.string.isRequired,
  user: PropTypes.object,
};

export { PageFAQ };
