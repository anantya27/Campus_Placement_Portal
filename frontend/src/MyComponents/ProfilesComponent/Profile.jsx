import React, { useState } from "react";
import axios from "axios";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [contributions, setContributions] = useState([]);
  const [repositories, setRepositories] = useState([]);

  const handleInputChange = (event) => {
    setUsername(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const [contributionsResponse, repositoriesResponse] = await Promise.all([
        axios.get(`https://api.github.com/users/${username}/events`),
        axios.get(`https://api.github.com/users/${username}/repos`),
      ]);
      const contributionsData = contributionsResponse.data.filter((event) => {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        return (
          event.type === "PushEvent" && new Date(event.created_at) > oneYearAgo
        );
      });
      const formattedContributionsData = contributionsData.map((event) => {
        return {
          date: new Date(event.created_at).toLocaleDateString(),
          count: event.payload.commits.length,
        };
      });
      setContributions(formattedContributionsData);
      setRepositories(repositoriesResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ color: "white", padding: "5%" }}>
      <form onSubmit={handleSubmit}>
        <label>
          GitHub Username:
          <input
            type="text"
            value={username}
            onChange={handleInputChange}
            style={{
              border: "1mm slid black",
              borderRadius: "50px",
              marginLeft: "10px",
            }}
          />
        </label>
        <button
          type="submit"
          style={{
            backgroundColor: "#8c52ff",
            border: "1mm slid black",
            borderRadius: "50px",
            marginLeft: "10px",
          }}
        >
          Submit
        </button>
      </form>
      <h2>Contributions</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {contributions.map((contribution) => (
            <tr key={contribution.date}>
              <td>{contribution.date}</td>
              <td>{contribution.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Repositories</h2>
      <ul>
        {repositories.map((repository) => (
          <li key={repository.id}>
            <a href={repository.html_url}>{repository.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;
