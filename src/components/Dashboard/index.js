import React, { Fragment, useEffect, useState } from "react";
import "./index.css";
import { SiLevelsdotfyi } from "react-icons/si";
import { FaHandHoldingMedical, FaRedo, FaUser } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import FollowupCard from "../FollowupCard";
import Navbar from "../Navbar";
import { baseUrl } from "../../App";
import { toast } from "react-toastify";
import Popup from "reactjs-popup";
import { Skeleton } from "primereact/skeleton";

// import "primereact/resources/themes/saga-blue/theme.css"; // Theme CSS
// import "primereact/resources/primereact.min.css"; // PrimeReact CSS

const filtedOptions = [
  {
    name: "coachName",
    icon: <FaUser />,
    options: ["Ruthvik", "Mustafa", "Rani"],
  },
  {
    name: "stage",
    icon: <FaHandHoldingMedical />,
    options: ["Lead", "Op", "Ip", "Diag"],
  },
  {
    name: "level",
    icon: <SiLevelsdotfyi />,
    options: ["Very Hot", "Hot", "Cold", "Closed"],
  },
];

const Dashboard = () => {
  const [DashboardFollowUps, setDashboardFollowups] = useState([]);
  // const [selectedCities, setSelectedCities] = useState("");
  // const [filterButton, setFilterButton] = useState("");
  // const [filterdCards, setFilteredCards] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([
    { filterType: "coachName", filterOptions: [] },
    { filterType: "level", filterOptions: [] },
    { filterType: "stage", filterOptions: [] },
  ]);
  console.log(selectedFilters);

  // const [submenuVisible, setSubmenuVisible] = useState(false);

  useEffect(() => {
    const storedFilters = sessionStorage.getItem("selectedFilters");
    if (storedFilters) {
      const parsedFilters = JSON.parse(storedFilters);
      // Check if parsedFilters is not empty
      if (parsedFilters.some((filter) => filter.filterOptions.length > 0)) {
        setSelectedFilters(parsedFilters);
      }
    }
  }, []);

  // Save data to sessionStorage when selectedFilters change
  useEffect(() => {
    sessionStorage.setItem("selectedFilters", JSON.stringify(selectedFilters));
  }, [selectedFilters]);

  useEffect(() => {
    getFollowups();
  }, []);

  const getFollowups = async () => {
    try {
      const fetchDetails = await fetch(`${baseUrl}/dashboard-followups`);
      if (fetchDetails.ok) {
        const data = await fetchDetails.json();
        setDashboardFollowups(data);
        console.log(data);
      }
    } catch (err) {
      toast.error("Failed To Get Followups");
    }
  };

  // const onFilter = () => {
  //   const dropdownElement = document.getElementById("filterDropdown");
  //   dropdownElement.classList.toggle("dorpdown");
  // };

  const addFilterFunction = (e, filterType) => {
    const selectedCity = e.selectedOption.value; // Get the selected city

    setSelectedFilters((prevState) => {
      const updatedFilters = [...prevState];
      const existingFilterIndex = updatedFilters.findIndex(
        (filter) => filter.filterType === filterType
      );

      if (existingFilterIndex !== -1) {
        // Filter type already exists, toggle the selected city
        const existingFilter = updatedFilters[existingFilterIndex];
        const cityIndex = existingFilter.filterOptions.indexOf(selectedCity);

        if (cityIndex !== -1) {
          // City is already selected, remove it
          existingFilter.filterOptions.splice(cityIndex, 1);
        } else {
          // City is not selected, add it
          existingFilter.filterOptions.push(selectedCity);
        }
      } else {
        // Filter type doesn't exist, add it with the selected city
        updatedFilters.push({
          filterType: filterType,
          filterOptions: [selectedCity],
        });
      }
      return updatedFilters;
    });
  };

  const onDropDownClick = (e) => {
    setSelectedCities(e.value);
    const selectedValue = e.selectedOption.value;
    // Handle filters based on selected cities
    if (
      selectedValue === "Ruthvik" ||
      selectedValue === "Mustafa" ||
      selectedValue === "Rani"
    ) {
      addFilterFunction(e, "coachName");
    } else if (
      selectedValue === "Lead" ||
      selectedValue === "Op" ||
      selectedValue === "Ip" ||
      selectedValue === "Diag"
    ) {
      addFilterFunction(e, "stage");
    } else if (
      selectedValue === "Very Hot" ||
      selectedValue === "Hot" ||
      selectedValue === "Cold" ||
      selectedValue === "Closed"
    ) {
      addFilterFunction(e, "level");
    }
  };

  const removeFilterOption = (filterValue) => {
    setSelectedFilters((prevState) => {
      // Iterate over the existing filters
      const updatedFilters = prevState.map((filter) => {
        // Filter out the filter option with the specified filterValue
        filter.filterOptions = filter.filterOptions.filter(
          (option) => option !== filterValue
        );
        return filter;
      });
      return updatedFilters;
    });
  };

  const handleSubmenuToggle = (e) => {
    setSubmenuVisible(!submenuVisible);
    e.stopPropagation();
    e.preventDefault();
  };

  let filteredFollowups = [...DashboardFollowUps];

  selectedFilters.forEach((filter) => {
    if (filter.filterOptions.length > 0) {
      filteredFollowups = DashboardFollowUps.filter((followup) => {
        return filter.filterOptions.includes(followup[filter.filterType]);
      });
    }
  });

  const onCheckBox = (e, filterType, filterValue) => {
    if (e.target.checked) {
      const filterByCoach = DashboardFollowUps.filter(
        (each) => each[filterType] === filterValue
      );
      console.log(filterByCoach);
      setSelectedFilters((prevState) => {
        const updatedFilters = [...prevState];
        const existingCoachFilter = updatedFilters.find(
          (filter) =>
            filter.filterType === filterType &&
            filter.filterOptions.includes(filterValue) === false
        );
        if (existingCoachFilter) {
          existingCoachFilter.filterOptions.push(filterValue);
        }
        return updatedFilters;
      });
    } else {
      removeFilterOption(filterValue);
    }
  };

  const isCheckboxChecked = (checkBoxFilter) => {
    const findIndexOfCheckBoxFilter = selectedFilters.filter((each) =>
      each.filterOptions.includes(checkBoxFilter)
    );
    if (findIndexOfCheckBoxFilter.length > 0) {
      return true;
    }
    return false;
  };

  return (
    <div className="patient-dashboard">
      <Navbar title="Patient Dashboard" />
      <div className="patient-dashboard__sub-heading">
        <div className="patient-dashboard__selectedFilters-container">
          {selectedFilters.map((each) => (
            <Fragment>
              {each.filterOptions.map((each) => (
                <button>
                  <span>{each}</span>
                  <MdCancel onClick={() => removeFilterOption(each)} />
                </button>
              ))}
            </Fragment>
          ))}
        </div>

        <div className="patient-dashboard__btn-container">
          <div class="dropdown">
            <button
              data-mdb-button-init
              data-mdb-ripple-init
              data-mdb-dropdown-init
              class="add-button custom-button mx-1 dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-mdb-toggle="dropdown"
              aria-expanded="false"
            >
              <FaFilter />
            </button>
            <ul
              class="dropdown-menu  "
              style={{ width: "2rem !important" }}
              aria-labelledby="dropdownMenuButton"
            >
              {filtedOptions.map((each) => (
                <Fragment>
                  <li>
                    <span>
                      {each.icon} {each.name}
                    </span>
                    <ul class="dropdown-menu dropdown-submenu">
                      {each.options.map((eachFilter) => (
                        <li>
                          <input
                            type="checkbox"
                            className="mx-1"
                            checked={isCheckboxChecked(eachFilter)}
                            onClick={(e) =>
                              onCheckBox(e, each.name, eachFilter)
                            }
                          />
                          <span>{eachFilter}</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                </Fragment>
              ))}
            </ul>
          </div>

          <button
            className="add-button"
            onClick={() => {
              getFollowups();
            }}
          >
            <FaRedo className="" />
          </button>
        </div>
      </div>

      <div className="patient-dashboard__followup-cards">
        {DashboardFollowUps.length > 0 ? (
          <div className="patient-dashboard__followup-cards-container">
            <Fragment>
              {filteredFollowups.length > 0 ? (
                <Fragment>
                  {filteredFollowups.map((each, index) => (
                    <FollowupCard
                      getFollowups={getFollowups}
                      each={each}
                      index={index}
                    />
                  ))}
                </Fragment>
              ) : (
                <div>No Followups</div>
              )}
            </Fragment>
          </div>
        ) : (
          <div className="patient-dashboard__followup-cards-container">
            {Array.from({ length: 4 }).map((each, index) => (
              <div key={index} className="skeleton-loader">
                <div className="followup-card__name-container"></div>
                <div className="followup-card__stage-lead-container">
                  <div className="followup-card__stage-container"></div>
                  <div className="followup-card__lead-container"></div>
                </div>
                <div className="followup-card__name-container"></div>
                <div className="followup-card__snooze-done-container">
                  <button></button>
                  <button></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
