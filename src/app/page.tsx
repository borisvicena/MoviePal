"use client";
import React, { useState } from "react";
import axios from "axios";
import { clear } from "console";

const avatar = {
  src: "icon.png",
  alt: "MoviePal",
};

interface Item {
  id: string;
  title: string;
  name: string;
  release_date?: string;
  first_air_date?: string;
  poster_path: string;
}

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const getRecommendations = async ({ title, type }: { title: string; type: string }) => {
  try {
    const searchResponse = await axios.get(
      `https://api.themoviedb.org/3/search/${type}?api_key=${API_KEY}&query=${encodeURIComponent(title)}`
    );

    if (searchResponse.data.results.length > 0) {
      const itemId = searchResponse.data.results[0].id;
      const searchedItem = searchResponse.data.results[0];

      const recommendationsResponse = await axios.get(
        `https://api.themoviedb.org/3/${type}/${itemId}/recommendations?api_key=${API_KEY}`
      );

      return [searchedItem, ...recommendationsResponse.data.results];
    } else {
      console.log(`${type.charAt(0).toUpperCase() + type.slice(1)} not found`);
      return [];
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
    return [];
  }
};

export default function Home() {
  const [movieTitle, setMovieTitle] = useState("");
  const [recommendations, setRecommendations] = useState<Item[]>([]);
  const [searchType, setSearchType] = useState("movie");
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const handleSearch = async () => {
    const recommendedItems = await getRecommendations({ title: movieTitle, type: searchType });
    setRecommendations(recommendedItems);
  };

  const handleReload = () => {
    setLoading(true);
    setLoadingProgress(0);

    const incrementProgress = () => {
      setLoadingProgress((prevProgress) => {
        if (prevProgress >= 100) {
          window.location.reload(); // Reload once progress is complete
          return 100;
        }
        return prevProgress + 2; // Smaller increment for smoother transition
      });
    };

    const startProgress = () => {
      if (loadingProgress < 100) {
        incrementProgress();
        requestAnimationFrame(startProgress); // Use requestAnimationFrame for smoother updates
      }
    };

    startProgress(); // Start the progress
  };

  return (
    <>
      {loading && (
        <progress
          className="progress progress-info w-full fixed top-0 left-0 z-50"
          value={loadingProgress}
          max="100"
        ></progress>
      )}
      <header className="w-full my-4 px-4 md:pt-4">
        <div className="navbar justify-between bg-base-200 text-base-content rounded-box w-full max-w-xl mx-auto">
          <div className="flex-none">
            <button className="btn btn-square btn-ghost" onClick={handleReload}>
              <img src={avatar.src} alt={avatar.alt} className="w-10 h-10 rounded-full" />
            </button>
          </div>
          <div className="flex-none" onClick={handleReload}>
            <a className="normal-case font-bold text-lg btn btn-ghost tracking-tight">Movie Pal</a>
          </div>
          <div className="flex-none">
            <button className=" btn btn-square btn-ghost swap swap-rotate">
              {/* this hidden checkbox controls the state */}
              <input type="checkbox" className="theme-controller" value="synthwave" />

              {/* sun icon */}
              <svg className="swap-off h-7 w-7 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
              </svg>

              {/* moon icon */}
              <svg className="swap-on h-7 w-7 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="w-full flex justify-center items-center">
          <div className="mt-20 w-full flex flex-col justify-center items-center max-w-xl">
            <div className="inline-flex w-full gap-2">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="select select-bordered"
              >
                <option value="movie">Movies</option>
                <option value="tv">TV Shows</option>
              </select>
              <input
                type="text"
                placeholder="Enter a movie title"
                className="input input-bordered w-full"
                value={movieTitle}
                onChange={(e) => setMovieTitle(e.target.value)}
              />
            </div>

            <button className="btn btn-neutral w-full mt-2" onClick={handleSearch}>
              Get recommendation
            </button>
          </div>
        </div>
        <div className="w-full max-w-screen-lg mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
          {recommendations.length > 0 ? (
            recommendations.map((item: Item) => (
              <div
                key={item.id}
                className="card bg-base-200 hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden"
              >
                <figure>
                  <img
                    src={`https://image.tmdb.org/t/p/original${item.poster_path}`}
                    alt={item.title || item.name}
                    className="w-full h-full object-cover"
                  />
                </figure>
                <div className="card-body p-4">
                  <h2 className="card-title text-lg font-semibold text-white">{item.title || item.name}</h2>
                  <p className="text-accent">
                    Year: <span className="font-medium">{item.release_date || item.first_air_date}</span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center">No recommendations found</p>
          )}
        </div>
      </header>
    </>
  );
}
