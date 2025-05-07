import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Demo = () => {
  const { store, dispatch } = useGlobalReducer();

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Todo List</h2>
      <ul className="list-group">
        {store && store.todos?.length > 0 ? (
          store.todos.map((item) => (
            <li
              key={item.id}
              className="list-group-item d-flex justify-content-between align-items-center"
              style={{ background: item.background || "#fff" }}
            >
              <div>
                <Link to={`/single/${item.id}`} className="fw-bold text-decoration-none">
                  {item.title}
                </Link>
                <p className="mb-0 small text-muted">
                  Open <code>./store.js</code> to see the global store that manages colors.
                </p>
              </div>
              <button
                className="btn btn-success"
                onClick={() =>
                  dispatch({
                    type: "update_color",
                    payload: { id: item.id, color: "#ffa500" },
                  })
                }
              >
                Change Color
              </button>
            </li>
          ))
        ) : (
          <p className="text-muted">No todos available.</p>
        )}
      </ul>

      <div className="mt-4">
        <Link to="/">
          <button className="btn btn-primary">Back home</button>
        </Link>
      </div>
    </div>
  );
};
