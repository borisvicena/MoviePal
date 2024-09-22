"use client";
import axios from "axios";
import React, { useState } from "react";

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

function Search() {
  const [movieTitle, setMovieTitle] = useState("");
  const [recommendations, setRecommendations] = useState<Item[]>([]);
  const [searchType, setSearchType] = useState("movie");

  const handleSearch = async () => {
    const recommendedItems = await getRecommendations({ title: movieTitle, type: searchType });
    setRecommendations(recommendedItems);
  };

  return (
    <>
      <div id="search" className="pt-20 flex flex-col items-center justify-center">
        <div className="w-full flex flex-col items-center justify-center max-w-xl">
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
              placeholder="Enter Your Favorite Movie or TV Show"
              className="input input-bordered w-full"
              value={movieTitle}
              onChange={(e) => setMovieTitle(e.target.value)}
            />
          </div>

          <button className="btn btn-neutral w-full mt-2" onClick={handleSearch}>
            ✨&nbsp;Get recommendation&nbsp;✨
          </button>
        </div>

        <div className="w-full max-w-screen-lg mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 mt-10">
          {recommendations.length > 0 ? (
            recommendations.map((item: Item) => (
              <div
                key={item.id}
                className="card bg-base-200 hover:shadow-xl hover:shadow-accent transition-shadow duration-300 rounded-lg overflow-hidden"
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
                  <p className="text-accent items-end flex">
                    Year: <span className="font-medium">{item.release_date || item.first_air_date}</span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex justify-center items-center">
              <p className="text-gray-600 text-center">No recommendations found</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Search;
