// import { useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
// import "../css/Settings.css"; // Import custom CSS

// const Settings = () => {
//     const [categories, setCategories] = useState([]);
//     const [selectedCategory, setSelectedCategory] = useState("");
//     const [difficulty, setDifficulty] = useState("");
//     const [questionType, setQuestionType] = useState("");
//     const [amount, setAmount] = useState(10);

//     useEffect(() => {
//         const url = `https://opentdb.com/api_category.php`;
//         fetch(url)
//             .then((response) => response.json())
//             .then((data) => {
//                 setCategories(data.trivia_categories || []);
//             })
//             .catch((error) => console.error("Error fetching categories:", error));
//     }, []);

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log({
//             selectedCategory,
//             difficulty,
//             questionType,
//             amount,
//         });
//     };

//     return (
//         <div className="settings-container d-flex align-items-center justify-content-center vh-100">
//             <div className="card p-4 shadow-lg rounded">
//                 <h1 className="text-center mb-4 text-light">Quiz App</h1>
//                 <form onSubmit={handleSubmit}>
//                     {/* Select Category */}
//                     <div className="mb-3">
//                         <label htmlFor="category" className="form-label text-light">
//                             Select Category:
//                         </label>
//                         <select
//                             className="form-select"
//                             value={selectedCategory}
//                             onChange={(e) => setSelectedCategory(e.target.value)}
//                         >
//                             <option value="">All</option>
//                             {categories.map((cat) => (
//                                 <option key={cat.id} value={cat.id}>
//                                     {cat.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     {/* Select Difficulty */}
//                     <div className="mb-3">
//                         <label htmlFor="difficulty" className="form-label text-light">
//                             Select Difficulty:
//                         </label>
//                         <select
//                             className="form-select"
//                             value={difficulty}
//                             onChange={(e) => setDifficulty(e.target.value)}
//                         >
//                             <option value="">All</option>
//                             <option value="easy">Easy</option>
//                             <option value="medium">Medium</option>
//                             <option value="hard">Hard</option>
//                         </select>
//                     </div>

//                     {/* Select Question Type */}
//                     <div className="mb-3">
//                         <label htmlFor="questionType" className="form-label text-light">
//                             Select Question Type:
//                         </label>
//                         <select
//                             className="form-select"
//                             value={questionType}
//                             onChange={(e) => setQuestionType(e.target.value)}
//                         >
//                             <option value="">All</option>
//                             <option value="multiple">Multiple Choice</option>
//                             <option value="boolean">True/False</option>
//                         </select>
//                     </div>

//                     {/* Amount of Questions */}
//                     <div className="mb-3">
//                         <label htmlFor="amount" className="form-label text-light">
//                             Amount of Questions:
//                         </label>
//                         <input
//                             type="number"
//                             className="form-control"
//                             value={amount}
//                             onChange={(e) => setAmount(e.target.value)}
//                             min="10"
//                             max="50"
//                         />
//                     </div>

//                     {/* Submit Button */}
//                     <button type="submit" className="btn btn-light w-100">
//                         Get Started
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default Settings;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "../css/Settings.css"; // Import custom CSS

const Settings = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [amount, setAmount] = useState(10);

  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    const url = `https://opentdb.com/api_category.php`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCategories(data.trivia_categories || []);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigate to /question with the settings data as state
    navigate("/question", {
      state: {
        selectedCategory,
        difficulty,
        questionType,
        amount,
      },
    });
  };

  return (
    <div className="settings-container d-flex align-items-center justify-content-center vh-100">
      <div className="card p-4 shadow-lg rounded">
        <h1 className="text-center mb-4 text-light">Quiz App</h1>
        <form onSubmit={handleSubmit}>
          {/* Select Category */}
          <div className="mb-3">
            <label htmlFor="category" className="form-label text-light">
              Select Category:
            </label>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Select Difficulty */}
          <div className="mb-3">
            <label htmlFor="difficulty" className="form-label text-light">
              Select Difficulty:
            </label>
            <select
              className="form-select"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="">All</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Select Question Type */}
          <div className="mb-3">
            <label htmlFor="questionType" className="form-label text-light">
              Select Question Type:
            </label>
            <select
              className="form-select"
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
            >
              <option value="">All</option>
              <option value="multiple">Multiple Choice</option>
              <option value="boolean">True/False</option>
            </select>
          </div>

          {/* Amount of Questions */}
          <div className="mb-3">
            <label htmlFor="amount" className="form-label text-light">
              Amount of Questions:
            </label>
            <input
              type="number"
              className="form-control"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="10"
              max="50"
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-light w-100">
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
