
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import he from "he"; // For decoding HTML entities
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "../index.css"; // Import custom CSS

const Questions = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { selectedCategory, difficulty, questionType, amount } =
    location.state || {};

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [score, setScore] = useState(0);
  const [answerStatus, setAnswerStatus] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [nextButtonVisible, setNextButtonVisible] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Retry logic variables
  const MAX_RETRIES = 5; // Maximum number of retries for 429 errors
  const RETRY_DELAY = 2000; // Delay between retries (in milliseconds)

  // Fetch questions on component mount
  useEffect(() => {
    const fetchQuestions = async (retryCount = 0) => {
      setLoading(true);
      setError("");

      // Construct API URL
      const url = `https://opentdb.com/api.php?amount=${amount || 10}${
        selectedCategory ? `&category=${selectedCategory}` : ""
      }${difficulty ? `&difficulty=${difficulty}` : ""}${
        questionType ? `&type=${questionType}` : ""
      }`;

      try {
        console.log("Fetching from URL:", url); // Debug the API URL
        const response = await fetch(url);

        if (response.status === 429) {
          // Handle rate limit error (retry after delay)
          if (retryCount < MAX_RETRIES) {
            console.warn(
              `Rate limit hit. Retrying in ${RETRY_DELAY / 1000} seconds...`
            );
            setTimeout(() => fetchQuestions(retryCount + 1), RETRY_DELAY);
            return;
          } else {
            throw new Error(
              "Failed to fetch questions due to rate limiting. Please try again later."
            );
          }
        }

        if (!response.ok) {
          throw new Error(
            `Failed to fetch questions. Status: ${response.status}`
          );
        }

        const data = await response.json();
        console.log("API Response:", data); // Debug the API response

        if (data.response_code !== 0 || !data.results.length) {
          throw new Error("No questions available for the selected settings.");
        }

        setQuestions(data.results);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching questions:", err.message);
        setError(err.message || "An unexpected error occurred.");
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [selectedCategory, difficulty, questionType, amount]);

  // Handle answer selection
  const handleAnswer = (option) => {
    setSelectedOption(option);

    const isCorrect =
      option === questions[currentQuestionIndex].correct_answer;
    if (isCorrect) {
      setScore(score + 1);
      setAnswerStatus("correct");
    } else {
      setAnswerStatus("incorrect");
    }

    setShowCorrectAnswer(true);
    setNextButtonVisible(true);
  };

  // Move to the next question
  const goToNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswerStatus("");
      setSelectedOption("");
      setShowCorrectAnswer(false);
      setNextButtonVisible(false);
    } else {
      setQuizCompleted(true);
    }
  };

  // Restart the quiz
  const restartQuiz = () => {
    setQuizCompleted(false);
    setScore(0);
    setCurrentQuestionIndex(0);
    setAnswerStatus("");
    setSelectedOption("");
    setShowCorrectAnswer(false);
    setNextButtonVisible(false);
    navigate("/");
  };

  // If still loading, show a spinner
  if (loading) {
    return <div className="text-center text-light">Loading questions...</div>;
  }

  // If an error occurred, show an error message
  if (error) {
    return (
      <div className="text-center text-danger">
        {error}
        <br />
        <button
          className="btn btn-light mt-3"
          onClick={() => navigate("/")}
        >
          Go Back
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="questions-container d-flex align-items-center justify-content-center vh-100">
      {!quizCompleted ? (
        <div className="card p-4 shadow-lg rounded w-75">
          <h2 className="text-center text-light mb-4">
            Question {currentQuestionIndex + 1}/{questions.length}
          </h2>
          <p className="text-light">{he.decode(currentQuestion.question)}</p>
          <div className="options">
            {currentQuestion.type === "multiple" &&
              currentQuestion.incorrect_answers
                .concat(currentQuestion.correct_answer)
                .sort(() => Math.random() - 0.5)
                .map((option, index) => (
                  <button
                    key={index}
                    className={`btn mb-2 w-100 ${
                      (answerStatus === "incorrect" &&
                        selectedOption === option &&
                        "btn-danger") ||
                      (answerStatus === "incorrect" &&
                        option === currentQuestion.correct_answer &&
                        "btn-success") ||
                      (answerStatus === "correct" &&
                        selectedOption === option &&
                        "btn-success")
                    }`}
                    onClick={() => handleAnswer(option)}
                    disabled={nextButtonVisible}
                  >
                    {he.decode(option)}
                  </button>
                ))}

            {currentQuestion.type === "boolean" && (
              <>
                <button
                  className={`btn mb-2 w-100 ${
                    (answerStatus === "incorrect" &&
                      selectedOption === "True" &&
                      "btn-danger") ||
                    (answerStatus === "incorrect" &&
                      currentQuestion.correct_answer === "True" &&
                      "btn-success") ||
                    (answerStatus === "correct" &&
                      selectedOption === "True" &&
                      "btn-success")
                  }`}
                  onClick={() => handleAnswer("True")}
                  disabled={nextButtonVisible}
                >
                  True
                </button>
                <button
                  className={`btn w-100 ${
                    (answerStatus === "incorrect" &&
                      selectedOption === "False" &&
                      "btn-danger") ||
                    (answerStatus === "incorrect" &&
                      currentQuestion.correct_answer === "False" &&
                      "btn-success") ||
                    (answerStatus === "correct" &&
                      selectedOption === "False" &&
                      "btn-success")
                  }`}
                  onClick={() => handleAnswer("False")}
                  disabled={nextButtonVisible}
                >
                  False
                </button>
              </>
            )}
          </div>

          {showCorrectAnswer && (
            <div className="text-center text-light mt-3">
              {answerStatus === "incorrect" && (
                <p className="text-danger">
                  Incorrect! The correct answer is:{" "}
                  <span className="text-success">
                    {he.decode(currentQuestion.correct_answer)}
                  </span>
                </p>
              )}
              {answerStatus === "correct" && (
                <p className="text-success">Correct Answer!</p>
              )}
            </div>
          )}

          {nextButtonVisible && (
            <div className="text-center mt-4">
              <button
                onClick={goToNextQuestion}
                className="btn btn-light next"
              >
                Next Question
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="card p-4 shadow-lg rounded w-75">
          <h2 className="text-center text-light mb-4">Quiz Completed!</h2>
          <p className="text-light">
            Your final score is {score}/{questions.length}
          </p>
          <div className="text-center mt-4">
            <button onClick={restartQuiz} className="btn btn-light restart">
              Restart Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Questions;
