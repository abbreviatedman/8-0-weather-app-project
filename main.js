// An array to keep track of searches we've already entered.
const previousSearches = [];

// A function that takes in two strings and returns a populated HTML node.
// For example, if passed "Average Temperature" and "37°F", it will return
// an HTML element that looks like this:
// <p><span>Average Temperature: </span>37°F</p>
const makeDataText = (headingText, valueText) => {
  const paragraph = document.createElement("p");
  const heading = document.createElement("span");
  heading.textContent = headingText + ": ";
  const value = document.createTextNode(valueText);
  paragraph.append(heading);
  paragraph.append(value);

  return paragraph;
};

// A function that takes in a string and a day object and returns a populated HTML node.
// For example, if passed "Today" and an object that looks like this:
// { avgtempF: 35, maxtempF: 38, mintempF: 32 }
// It will return an HTML element that looks like this:
// <section>
//   <h3>Today</h3>
//   <p><span>Average Temperature:</span> 35°F</p>
//   <p><span>Max Temperature:</span> 38°F</p>
//   <p><span>Min Temperature:</span> 32°F</p>
// </section>
// It leverages makeDataText to do so.
const makeThreeDaySection = (headingText, day) => {
  const { avgtempF, maxtempF, mintempF } = day;
  const section = document.createElement("section");
  const heading = document.createElement("h3");
  heading.textContent = headingText;
  section.append(
    heading,
    makeDataText("Average Temperature", `${avgtempF}°F`),
    makeDataText("Max Temperature", `${maxtempF}°F`),
    makeDataText("Min Temperature", `${mintempF}°F`)
  );

  return section;
};

// Refactored out of the callback so that we can make this code work whether
// the search is coming from the form or from the link.
const search = (city) => {
  city = city[0].toUpperCase() + city.slice(1).toLowerCase();
  fetch(`https://wttr.in/${city}?format=j1`)
    .then((response) => response.json())
    .then((data) => {
      const { weather, nearest_area, current_condition } = data;
      const area = nearest_area[0].areaName[0].value;
      const region = nearest_area[0].region[0].value;
      const country = nearest_area[0].country[0].value;
      const temperature = current_condition[0].FeelsLikeF;
      // Deconstructing the first three elements of the weather array.
      const [today, tomorrow, dayAfterTomorrow] = weather;
      const heading = document.createElement("h2");
      heading.textContent = city;

      // replaceChildren is a great modern DOM function that is the equivalent of:
      // 1. removing all previous children
      // 2. calling append with each parameter

      // Don't forget that you can append multiple elements with one append call!
      document
        .querySelector(".current")
        .replaceChildren(
          heading,
          makeDataText("Area", area),
          makeDataText("Region", region),
          makeDataText("Country", country),
          makeDataText("Currently", `Feels Like ${temperature}°F`)
        );

      document
        .querySelector(".three-day")
        .replaceChildren(
          makeThreeDaySection("Today", today),
          makeThreeDaySection("Tomorrow", tomorrow),
          makeThreeDaySection("Day After Tomorrow", dayAfterTomorrow)
        );

      // Some tells you if any of the elements in the array return true from the callback.
      // By using `!`, we can change that to "none of the elements return true".
      if (!previousSearches.some((search) => search === city)) {
        const historyItem = document.createElement("li");
        const link = document.createElement("a");
        link.href = "#history";
        link.textContent = city;
        const text = document.createTextNode(` - ${temperature}°F`);
        historyItem.append(link, text);
        document.querySelector(".history ul").append(historyItem);
        previousSearches.push(city);
        // This is the simplest way to add the event listener to each link.
        // Rather than looping through the links later,
        // just add the listener to them them when you make them!
        link.addEventListener("click", () => search(city));
      }
    })
    .catch((error) => console.log);
};

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
  const city = event.target.city.value;
  search(city);
  event.target.reset();
  // It's nice to also refocus the input box, rather than keep the button focused.
  event.target.city.focus();
});
