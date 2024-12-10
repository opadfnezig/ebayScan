import { useState, useEffect } from "react";
import "./App.css";

import AddListenerForm from './components/AddListenerForm/AddListenerForm.tsx';
import AddSearchForm from './components/AddSearchForm/AddSearchForm.tsx';

const HOST = "localhost";
const PORT = 3000;

const App = () => {
  const [tab, setTab] = useState(0);
  const [listeners, setListeners] = useState([]);
  const [searches, setSearches] = useState([]);
  const [selectedListener, setSelectedListener] = useState(null);
  const [selectedSearch, setSelectedSearch] = useState(null);
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    fetchListeners();
    fetchSearches();
  }, []);

  const fetchListeners = async () => {
    const response = await fetch(`http://${HOST}:${PORT}/listeners`);
    if (response.ok) {
      const data = await response.json();
      setListeners(data);
    } else {
      console.error("Failed to fetch listeners");
    }
  };

  const addListener = async (data) => {
    await fetch(`http://${HOST}:${PORT}/listener`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    await fetchListeners();
    setSelectedListener(null)
  };

  const editListener = async (data) => {
    await fetch(`http://${HOST}:${PORT}/listener/${data._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    await fetchListeners();
    setSelectedListener(null)
  };

  const enableListener = async (_id) => {
    await fetch(`http://${HOST}:${PORT}/listener/${_id}/enable`, {
      method: "POST",
    });
    setListeners((prev) =>
      prev.map((listener) =>
        listener._id === _id ? { ...listener, enabled: true } : listener
      )
    );
  };

  const disableListener = async (_id) => {
    await fetch(`http://${HOST}:${PORT}/listener/${_id}/disable`, {
      method: "POST",
    });
    setListeners((prev) =>
      prev.map((listener) =>
        listener._id === _id ? { ...listener, enabled: false } : listener
      )
    );
  };

  const deleteListener = async (_id) => {
    await fetch(`http://${HOST}:${PORT}/listener/${_id}`, {
      method: "DELETE",
    });
    setListeners((prev) => prev.filter((listener) => listener._id !== _id));
  };

  const fetchSearches = async () => {
    const response = await fetch(`http://${HOST}:${PORT}/searches`);
    if (response.ok) {
      const data = await response.json();
      setSearches(data);
    };
  }

  const editSearch = async (data) => {
    await fetch(`http://${HOST}:${PORT}/search/${data._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    await fetchSearches();
    setSelectedSearch(null);
  };

  const addSearch = async (data) => {
    await fetch(`http://${HOST}:${PORT}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    await fetchSearches();
    setSelectedSearch(null);
  }

  const deleteSearch = async (_id) => {
    await fetch(`http://${HOST}:${PORT}/search/${_id}`, {
      method: "DELETE",
    });
    setSearches((prev) => prev.filter((search) => search._id !== _id));
  }

  const fetchSearchResults = async (searchName) => {
    const response = await fetch(`http://${HOST}:${PORT}/search_results/${searchName}`, {
      method: "GET",
    });
    if (response.ok) {
      const data = await response.json();
      setSearchResults(data);
    };
  }

  const handleAddButtonClick = () => {
    if (tab === 0)
      setSelectedListener({});
    else if (tab === 1)
      setSelectedSearch({});
  };

  const handleEditButtonClick = (element) => {
    if (tab === 0)
      setSelectedListener(element);
    else if (tab === 1)
      setSelectedSearch(element)
  };

  return (
    <div className="container">
      <div className="header">
        <div
          className={tab === 0 ? "tab active" : "tab"}
          onClick={() => {
            setTab(0)
          }}
        >
          Listener
        </div>
        <div
          className={tab === 1 ? "tab active" : "tab"}
          onClick={() => {
            setTab(1)
            setSearchResults(null);
          }}
        >
          Search
        </div>
      </div>

      <div className="content">
        {tab === 0 && (
          <div>
            {selectedListener ? (
              <AddListenerForm
                initialData={selectedListener}
                onSave={selectedListener._id ? editListener : addListener}
                onCancel={async () => {
                  setSelectedListener({});
                  await fetchListeners();
                  setSelectedListener(null);
                }}
              />
            ) : (
              <>
                <div className="add-button" onClick={handleAddButtonClick}>
                  <span>+</span>
                </div>
                <div className="item_list">
                  {listeners.map((listener) => (
                    <div key={listener._id} className="item_list__item">
                      <div className="item_list__item__name">{listener.name}</div>
                      <div className="item_list__item__buttons">
                        <button
                          className="item_list__button button-yellow"
                          onClick={() =>
                            listener.enabled
                              ? disableListener(listener._id)
                              : enableListener(listener._id)
                          }
                        >
                          {listener.enabled ? "Disable" : "Enable"}
                        </button>
                        <button
                          className="item_list__button button-yellow"
                          onClick={() => handleEditButtonClick(listener)}
                        >
                          Edit
                        </button>
                        <button
                          className="item_list__button button-yellow"
                          onClick={() => deleteListener(listener._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
        {tab === 1 && (
          <div>
            {selectedSearch ? (
              <AddSearchForm
                initialData={selectedSearch}
                onSave={selectedSearch._id ? editSearch : addSearch}
                onCancel={async () => {
                  setSelectedSearch({});
                  await fetchSearches();
                  setSelectedSearch(null);
                }}
              />
            ) : (
              <>
                {searchResults != null ? (
                  <>
                    <div className="item_list">
                      {searchResults.map((res) => (
                        <div key={res._id} className="item_list__item">
                          <div className="item_list__item__name">
                            <a href={JSON.parse(res.data).link} target="_blank" rel="noopener noreferrer">
                              {JSON.parse(res.data).title}
                            </a>
                          </div>
                          <div className="item_list__item__buttons">
                            <div className="item_list__item__listener_name">{res.score}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="add-button" onClick={handleAddButtonClick}>
                      <span>+</span>
                    </div>
                    <div className="item_list">
                      {searches.map((search) => (
                        <div key={search._id} className="item_list__item">
                          <div className="item_list__item__name">{search.name}</div>
                          <div className="item_list__item__listener_name">{search.listenerName}</div>
                          <div className="item_list__item__buttons">
                            <button
                              className="item_list__button button-yellow"
                              onClick={() => fetchSearchResults(search.name)}
                            >
                              Results
                            </button>
                            <button
                              className="item_list__button button-yellow"
                              onClick={() => handleEditButtonClick(search)}
                            >
                              Edit
                            </button>
                            <button
                              className="item_list__button button-yellow"
                              onClick={() => deleteSearch(search._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
