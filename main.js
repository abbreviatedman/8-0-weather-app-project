const previousSearches = [];

const makeDataText = (headingText, valueText) => {
  const paragraph = document.createElement("p");
  const heading = document.createElement("span");
  heading.textContent = headingText + ": ";
  const value = document.createTextNode(valueText);
  paragraph.append(heading);
  paragraph.append(value);

  return paragraph;
};

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
      const [today, tomorrow, dayAfterTomorrow] = weather;
      const heading = document.createElement("h2");
      heading.textContent = city;
      // document
      //   .querySelector(".current")
      //   .replaceChildren(
      //     heading,
      //     makeDataText("Area", area),
      //     makeDataText("Region", region),
      //     makeDataText("Country", country),
      //     makeDataText("Currently", `Feels Like ${temperature}°F`)
      //   );
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

      if (!previousSearches.some((search) => search === city)) {
        const historyItem = document.createElement("li");
        const link = document.createElement("a");
        link.href = "#history";
        link.textContent = city;
        const text = document.createTextNode(` - ${temperature}°F`);
        historyItem.append(link, text);
        document.querySelector(".history ul").append(historyItem);
        previousSearches.push(city);
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
  event.target.city.focus();
});
