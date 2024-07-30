import NavBar from "./components/NavBar";
import Main from "./components/Main";
import Logo from "./components/Logo";
import Search from "./components/Search";
import NumResults from "./components/NumResults";
import MovieList from "./components/MovieList";
import Box from "./components/Box";
import { useEffect, useState } from "react";
import WatchSummary from "./components/WatchSummary";
import WatchedList from "./components/WatchedList";
import { tempMovieData } from "./utils/constant";
import { tempWatchedData } from "./utils/constant";
import { API } from "./utils/constant";
import ErrorMessage from "./components/ErrorMessage";
import Loading from "./components/Loading";
import SelectedMovie from "./components/SelectedMovie";

export default function App() {
  const [movies, setMovies] = useState([]);

  const [watched, setWatched] = useState(() => {
    const data = localStorage.getItem("watched");
    return data ? JSON.parse(data) : [];
  });

  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedID, setSelectedID] = useState(null);

  useEffect(() => {
    fetchApi();

    return () => setMovies([]);
  }, [query]);

  async function fetchApi() {
    try {
      if (query.length < 3) {
        setError("");
        return;
      }

      setIsLoading(true);
      setError("");

      const res = await fetch(API + `&s=${query}`);
      const data = await res.json();
      if (data.Response === "False") throw new Error("Movie not found..");
      setMovies(data.Search);
      setError("");
      setIsLoading(false);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleStepBack() {
    setSelectedID(null);
  }

  function handleSelection(id) {
    setSelectedID(id);
  }

  function handleAddWatchedMovies(newWatch) {
    setWatched((watched) => [...watched, newWatch]);
  }

  function handleDelete(id) {
    setWatched((watched) => watched.filter((watch) => watch.imdbID !== id));
  }

  useEffect(() => {
    console.log("useEffect fired with watched:", watched);
    localStorage.setItem("watched", JSON.stringify(watched));
  }, [watched]);

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loading />}
          {error && <ErrorMessage message={error} />}
          {!error && !isLoading && (
            <MovieList movies={movies} onSelect={handleSelection} />
          )}
        </Box>

        <Box>
          <>
            {selectedID ? (
              <SelectedMovie
                selectedID={selectedID}
                onBack={handleStepBack}
                onAddWatched={handleAddWatchedMovies}
                watched={watched}
              />
            ) : (
              <>
                <WatchSummary watched={watched} />
                <WatchedList watched={watched} onDelete={handleDelete} />
              </>
            )}
          </>
        </Box>
      </Main>
    </>
  );
}
