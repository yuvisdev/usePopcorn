import { useEffect, useState } from "react";
import { API } from "../utils/constant";
import StarComponent from "../StarComponent";
import Loading from "./Loading";

const SelectedMovie = ({ selectedID, onAddWatched, onBack, watched }) => {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  useEffect(() => {
    fetchMovie();
  }, [selectedID]);

  async function fetchMovie() {
    setIsLoading(true);
    const res = await fetch(API + `i=${selectedID}`);
    const data = await res.json();
    setMovie(data);
    setIsLoading(false);
  }

  useEffect(() => {
    document.title = `Movie | ${movie.Title}`;

    return () => (document.title = `usePopcorn`);
  }, [movie]);

  const {
    Title,
    Actors,
    Director,
    Genre,
    Plot,
    Released,
    Year,
    imdbRating,
    Runtime,
    Poster,
  } = movie;

  const isAlreadyAdded = watched.some((movie) => movie.imdbID === selectedID);

  function handleAdd() {
    if (isAlreadyAdded) {
      return;
    }
    const newObj = {
      Poster,
      Title,
      imdbRating: Number(imdbRating),
      runtime: Number(Runtime.split(" ").at(0)),
      imdbID: selectedID,
      userRating,
    };
    onAddWatched(newObj);
    onBack();
  }

  return isLoading ? (
    <Loading />
  ) : (
    <div className="details">
      <header>
        <button className="btn-back" onClick={onBack}>
          &larr;
        </button>
        <img src={Poster} alt={`${Title} poster`} />
        <div className="details-overview">
          <h2>{Title}</h2>
          <p>
            {Released} &bull; {Runtime}
          </p>
          <p>{Genre}</p>
          <p>
            <span>⭐️</span>
            {imdbRating} IMDb rating
          </p>
        </div>
      </header>

      <section>
        <div className="rating">
          {isAlreadyAdded ? (
            <p>You rated this movie {userRating} ⭐️</p>
          ) : (
            <>
              <StarComponent
                size={24}
                maxLen={10}
                onSetRating={setUserRating}
              />

              {userRating > 1 && (
                <button className="btn-add" onClick={handleAdd}>
                  + Add to list
                </button>
              )}
            </>
          )}
        </div>

        <p>
          <em>{Plot}</em>
        </p>

        <p>Starring {Actors}</p>
        <p>Directed By {Director}</p>
      </section>
    </div>
  );
};

export default SelectedMovie;
