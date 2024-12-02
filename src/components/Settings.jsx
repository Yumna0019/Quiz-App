import { useState, useEffect } from "react";

const Settings = () => {
    const [category , setCategory] = useState([]);

    useEffect (() => {
        const url = `https://opentdb.com/api_category.php`;
        fetch(url)
        .then(response => response.json())
        .then((data) => { 
            console.log(data);
            setCategory(data.trivia_categories )})
        .catch(error => console.error(error))
    },[]);

    return (
        <form>
            <div className="mb-3">
                <label htmlFor="category" className="form-label">Select Category:</label>
                <select className="form-select">
                    <option value="">ALL</option>
                    {category.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option> )}
                </select>
            </div>
        </form>
    );
}

export default Settings;