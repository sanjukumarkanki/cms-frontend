import React, { Fragment, useEffect, useState } from "react";
import "./index.css";
import { SiLevelsdotfyi } from "react-icons/si";
import { FaHandHoldingMedical, FaRedo, FaUser } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import FollowupCard from "../FollowupCard";
import Navbar from "../Navbar";
import { baseUrl, getRequestHeaders } from "../../App";
import { fetchData } from "../../ApiRoutes";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import MemoizedFollowupCard from "../FollowupCard";

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
  // Filter state
  const [selectedFilters, setSelectedFilters] = useState([
    { filterType: "coachName", filterOptions: [] },
    { filterType: "level", filterOptions: [] },
    { filterType: "stage", filterOptions: [] },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // To fetch all the followup cards
    getFollowups();
    // To get all the stored filters in Cookies
    const storedFilters = sessionStorage.getItem("selectedFilters");
    // If there is filters than it will update the it will parsed the obnject
    if (storedFilters) {
      const parsedFilters = JSON.parse(storedFilters);
      // Check if parsedFilters is not empty
      if (parsedFilters.some((filter) => filter.filterOptions.length > 0)) {
        setSelectedFilters(parsedFilters);
      }
    }
  }, []);

  // To save the filter in cookies whenver there is a updated in the selectedFilter State
  useEffect(() => {
    sessionStorage.setItem("selectedFilters", JSON.stringify(selectedFilters));
  }, [selectedFilters]);

  // To fetch all the followups Cards
  const getFollowups = async () => {
    try {
      const getDashboardFollowups = await fetchData(
        "dashboard-followups",
        getRequestHeaders
      );
      // If the array length < 0 than it will show the no followup data
      if (getDashboardFollowups.length > 0) {
        setDashboardFollowups(getDashboardFollowups);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setIsError(true);
      }
    } catch (err) {
      setIsLoading(false);
      setIsError(true);
    }
  };

  const addFilterFunction = (e, filterType) => {
    const selectedCity = e.selectedOption.value;
    // To add the selectedFilter into state than it will update that into cookies so even the user refresh tha page the filter will display..
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

  const removeFilterOption = (filterValue) => {
    // To remove the Filter when the user clicks on checkbox or chip cancel toggle button
    setSelectedFilters((prevState) => {
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

  let filteredFollowups = [...DashboardFollowUps];
  // To filter the Dashboard Followups based on selectedFilters
  selectedFilters.forEach((filter) => {
    if (filter.filterOptions.length > 0) {
      filteredFollowups = DashboardFollowUps.filter((followup) => {
        return filter.filterOptions.includes(followup[filter.filterType]);
      });
    }
  });

  // To add and remove the filters based on checkbox toggle
  const onCheckBox = (e, filterType, filterValue) => {
    if (e.target.checked) {
      const filterByCoach = DashboardFollowUps.filter(
        (each) => each[filterType] === filterValue
      );
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

  // To check wherether the checkbo is selected or not
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
          {/* Selecte Filter Chip Container */}
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
          {/* Selecte Filter DropDown */}
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
                  {/* Followup Each Filter Type */}
                  <li>
                    <span>
                      {each.icon} {each.name}
                    </span>
                    {/* Followup Each Filter Type Sub Options container */}

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
        {!isLoading ? (
          <div className="patient-dashboard__followup-cards-container d-flex flex-wrap  align-items-center   justify-content-center ">
            <Fragment>
              {/* It will check if there is andy error otherwise it will display the not data found */}
              {isError || filteredFollowups.length === 0 ? (
                <div className="d-flex flex-column  justify-content-center  align-items-center ">
                  <img
                    draggable={false}
                    width="30%"
                    src="https://res.cloudinary.com/deo74k78q/image/upload/v1715663915/Data_Mesa_de_trabajo_1_f5shc5.png"
                    alt=""
                  />
                  <h2 className=" fs-5  fw-bold " style={{ color: "#80288f" }}>
                    No Data Found
                  </h2>
                </div>
              ) : (
                <Fragment>
                  {/* Followup Cards Container */}
                  {filteredFollowups.map((each, index) => (
                    <MemoizedFollowupCard
                      getFollowups={getFollowups}
                      each={each}
                      setDashboardFollowups={setDashboardFollowups}
                      index={index}
                    />
                  ))}
                </Fragment>
              )}
            </Fragment>
          </div>
        ) : (
          <div className="patient-dashboard__followup-cards-container">
            {/* Followup Card Skeletion Loader */}
            {Array.from({ length: 8 }).map((each, index) => (
              <div
                key={index}
                className=" p-2 rounded-3 "
                style={{
                  width: "9rem",
                  height: "6.8rem",
                  backgroundColor: "lightgray",
                }}
              >
                <Skeleton width="100%" />
                <div>
                  <Skeleton width="90%" />
                  <Skeleton width="95%" />
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
