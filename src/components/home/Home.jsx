import { useUser } from "../../contexts/UserContext";

const Home = () => {
    const {currentUser} = useUser();
  return (
    <div id="home">
      <h1>Welcome to Gigmatch Calendar App</h1>
      <p>
        A place for artists & venues to connect, book shows, and share
        availability.
      </p>
      {currentUser ? <p>Welcome back, {currentUser.name}</p> : ""}
    </div>
  );
};
export default Home;
