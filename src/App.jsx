import "./App.css";
import { useMemo, useState } from "react";
import Dropdown from "./components/Dropdown.jsx";
import { sleep } from "./utils.js";
import { mockData } from "./constants.js";

function App() {
  const initialOptions = useMemo(() => mockData, []);

  const [value1, setValue1] = useState(null);
  const [value2, setValue2] = useState(null);
  const [value3, setValue3] = useState(null);

  async function asyncSearch(query, options) {
    await sleep(400);
    if (!query) return options;
    return options.filter((o) =>
      o.label.toLowerCase().includes(query.toLowerCase())
    );
  }

  return (
    <div className="app__container">
      <h2>Custom Dropdown Demo</h2>

      <div className="card__wrapper">
        <section className="card">
          <h3>Basic usage</h3>
          <Dropdown
            options={initialOptions}
            value={value1}
            onChange={setValue1}
            placeholder="Choose an option"
          />
          <div className="card--description">
            <small>Selected: {value1 ? value1.label : "None"}</small>
          </div>
        </section>

        <section className="card">
          <h3>Custom renderers</h3>
          <Dropdown
            options={initialOptions}
            value={value2}
            onChange={setValue2}
            placeholder="Pick a fruit or vegetable"
            renderSelected={(val) => (
              <span>
                <strong>{val.label}</strong>{" "}
                <em style={{ color: "#888" }}>({val.group})</em>
              </span>
            )}
            renderOption={(opt, isActive, isSelected) => (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <span>{opt.label}</span>
                <span style={{ opacity: 0.6, fontSize: 12 }}>{opt.group}</span>
                {isSelected ? <span aria-hidden>✓</span> : null}
              </div>
            )}
          />
          <div className="card--description">
            <small>Selected: {value2 ? value2.label : "None"}</small>
          </div>
        </section>

        <section className="card">
          <h3>Async search</h3>
          <Dropdown
            options={initialOptions}
            value={value3}
            onChange={setValue3}
            placeholder="Search with debounce"
            searchFn={asyncSearch}
            searchDebounceMs={300}
          />
          <div className="card--description">
            <small>Selected: {value3 ? value3.label : "None"}</small>
          </div>
        </section>
      </div>
      <p className="read-the-docs">
        Open multiple dropdowns to test auto-closing behavior.
      </p>
    </div>
  );
}

export default App;
