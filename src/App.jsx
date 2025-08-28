import "./App.css";
import { useMemo, useState } from "react";
import Dropdown from "./components/Dropdown.jsx";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function App() {
  const initialOptions = useMemo(
    () => [
      { id: "ap", label: "Apple", group: "Fruits" },
      { id: "bn", label: "Banana", group: "Fruits" },
      { id: "or", label: "Orange", group: "Fruits" },
      { id: "ca", label: "Carrot", group: "Vegetables" },
      { id: "tm", label: "Tomato", group: "Vegetables" },
      { id: "pt", label: "Potato", group: "Vegetables" },
    ],
    []
  );

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

      <div style={{ display: "flex", gap: 16, textAlign: "left" }}>
        <section
          className="card"
          style={{ border: "1px solid #ddd", borderRadius: 8 }}
        >
          <h3>Basic usage</h3>
          <Dropdown
            options={initialOptions}
            value={value1}
            onChange={setValue1}
            placeholder="Choose an option"
          />
          <div style={{ marginTop: 8 }}>
            <small>Selected: {value1 ? value1.label : "None"}</small>
          </div>
        </section>

        <section
          className="card"
          style={{ border: "1px solid #ddd", borderRadius: 8 }}
        >
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
          <div style={{ marginTop: 8 }}>
            <small>Selected: {value2 ? value2.label : "None"}</small>
          </div>
        </section>

        <section
          className="card"
          style={{ border: "1px solid #ddd", borderRadius: 8 }}
        >
          <h3>Async search</h3>
          <Dropdown
            options={initialOptions}
            value={value3}
            onChange={setValue3}
            placeholder="Search with debounce"
            searchFn={asyncSearch}
            searchDebounceMs={300}
          />
          <div style={{ marginTop: 8 }}>
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
