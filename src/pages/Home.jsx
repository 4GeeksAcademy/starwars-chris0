import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {
  const [planets, setPlanets] = useState(null);
  const [people, setPeople] = useState(null);
  const [vehicles, setVehicles] = useState(null);

  const { store, dispatch } = useGlobalReducer();
  const fallbackImage = "https://via.placeholder.com/300?text=Image+Not+Available";

  const getIdFromUrl = (url) => url.split("/").filter(Boolean).pop();

  // Generic fetcher for all categories
  const fetchAndSetDetails = async (endpoint, setter, limit = 5) => {
    try {
      const res = await fetch(`https://www.swapi.tech/api/${endpoint}/`);
      const data = await res.json();
      const items = data.results.slice(0, limit);
      const details = [];

      for (const item of items) {
        const detailRes = await fetch(item.url);
        const detailData = await detailRes.json();
        details.push({ 
          ...detailData.result.properties, 
          description: detailData.result.description, 
          url: item.url 
        });
      }

      setter(details);
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err);
    }
  };

  useEffect(() => {
    fetchAndSetDetails("people", setPeople);
    fetchAndSetDetails("vehicles", setVehicles);
    fetchAndSetDetails("planets", setPlanets);
  }, []);

  const handleAddFavorite = (item, type) => {
    const id = getIdFromUrl(item.url);
    dispatch({
      type: "ADD_TO_FAVORITES",
      payload: {
        id,
        name: item.name,
        type: type === "characters" ? "people" : type,
      },
    });
  };

  const CardComponent = ({ item, type }) => {
    const id = getIdFromUrl(item.url);
    const imageUrl = `https://starwars-visualguide.com/assets/img/${type}/${id}.jpg`;

    return (
      <div className="card p-3" style={{ width: "300px" }}>
        <img
          src={imageUrl}
          alt={item.name}
          onError={(e) => (e.target.src = fallbackImage)}
          style={{ width: "100%", height: "200px", objectFit: "cover" }}
        />
        <h5 className="mt-2">{item.name}</h5>

        {type === "characters" && (
          <>
            <p className="mb-1"><strong>Gender:</strong> {item.gender}</p>
            <p className="mb-1"><strong>Hair Color:</strong> {item.hair_color}</p>
            <p className="mb-2"><strong>Eye Color:</strong> {item.eye_color}</p>
          </>
        )}

        {type === "vehicles" && (
          <>
            <p className="mb-1"><strong>Model:</strong> {item.model}</p>
            <p className="mb-1"><strong>Manufacturer:</strong> {item.manufacturer}</p>
            <p className="mb-2"><strong>Passengers:</strong> {item.passengers}</p>
          </>
        )}

        {type === "planets" && (
          <>
            <p className="mb-1"><strong>Climate:</strong> {item.climate}</p>
            <p className="mb-1"><strong>Terrain:</strong> {item.terrain}</p>
            <p className="mb-2"><strong>Population:</strong> {item.population}</p>
          </>
        )}

        <div className="d-flex justify-content-between mt-2">
          <Link
            to={`/${type === "characters" ? "people" : type}/${id}`}
            className="btn btn-primary btn-sm"
          >
            Learn More
          </Link>
          <button
            className="btn btn-warning btn-sm"
            onClick={() => handleAddFavorite(item, type)}
          >
            Favorite
          </button>
        </div>
      </div>
    );
  };

  const Section = ({ title, data, type }) => (
    <>
      <h2 className="mt-5">{title}</h2>
      {data ? (
        <div className="d-flex flex-wrap justify-content-center gap-4">
          {data.map((item, index) => (
            <CardComponent key={index} item={item} type={type} />
          ))}
        </div>
      ) : (
        <p>Loading {title.toLowerCase()}...</p>
      )}
    </>
  );

  return (
    <div className="text-center mt-5">
      <h1>Star Wars Explorer</h1>
      <Section title="Characters" data={people} type="characters" />
      <Section title="Vehicles" data={vehicles} type="vehicles" />
      <Section title="Planets" data={planets} type="planets" />
    </div>
  );
};
