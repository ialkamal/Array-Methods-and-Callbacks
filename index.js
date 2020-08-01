import { fifaData } from "./fifa.js";
//console.log(fifaData);

//console.log("its working");
// ⚽️ M  V P ⚽️ //

/* Task 1: Investigate the data above. Practice accessing data by console.log-ing the following pieces of data 

(a) Home Team name for 2014 world cup final
(b) Away Team name for 2014 world cup final
(c) Home Team goals for 2014 world cup final
(d) Away Team goals for 2014 world cup final
(e) Winner of 2014 world cup final */

const worldCupFinal2014 = fifaData.filter((el, i) => {
  return el.Year === 2014 && el.Stage === "Final";
})[0];

console.log("Home Team: " + worldCupFinal2014["Home Team Name"]);
console.log("Away Team: " + worldCupFinal2014["Away Team Name"]);
console.log("Home Team Goals: " + worldCupFinal2014["Home Team Goals"]);
console.log("Away Team Goals: " + worldCupFinal2014["Away Team Goals"]);
console.log("Winner: " + worldCupFinal2014["Win conditions"].split(" ")[0]);

/* Task 2: Create a function called  getFinals that takes `data` as an argument and returns an array of objects with only finals data */

function getFinals(data) {
  return data.filter((el, i) => {
    return el.Stage === "Final";
  });
}

/* Task 3: Implement a higher-order function called `getYears` that accepts the callback function `getFinals`, and returns an array called `years` containing all of the years in the dataset */

function getYears(myFunc) {
  const years = myFunc(fifaData).map((element) => {
    return element.Year;
  });
  return years;
}

console.log(getYears(getFinals));

/* Task 4: Implement a higher-order function called `getWinners`, that accepts the callback function `getFinals()` and determine the winner (home or away) of each `finals` game. Return the name of all winning countries in an array called `winners` */

function getWinners(myFunc) {
  const winners = myFunc(fifaData).map((element, i) => {
    if (element["Home Team Goals"] === element["Away Team Goals"])
      return element["Win conditions"].split(" ")[0];
    if (element["Home Team Goals"] > element["Away Team Goals"])
      return element["Home Team Name"];
    else return element["Away Team Name"];
  });
  return winners;
}

console.log(getWinners(getFinals));

/* Task 5: Implement a higher-order function called `getWinnersByYear` that accepts the following parameters and returns a set of strings "In {year}, {country} won the world cup!" 

Parameters: 
 * callback function getWinners
 * callback function getYears
 */

function getWinnersByYear(getYearsFunc, getWinnersFunc) {
  const years = getYearsFunc(getFinals);
  const winners = getWinnersFunc(getFinals);

  const stringSet = years.map((element, i) => {
    return `In ${element}, ${winners[i]} won the world cup!`;
  });

  return stringSet;
}
console.log(getWinnersByYear(getYears, getWinners));

/* Task 6: Write a function called `getAverageGoals` that accepts a parameter `data` and returns the the average number of home team goals and away team goals scored per match (Hint: use .reduce and do this in 2 steps) */

function getAverageGoals(data) {
  const goalsPerMatch = data.map((element, i) => {
    return element["Home Team Goals"] + element["Away Team Goals"];
  });

  const averageGoalsPerMatch =
    goalsPerMatch.reduce((sum, element) => {
      return (sum += element);
    }, 0) / goalsPerMatch.length;
  //console.log(goalsPerMatch);

  return averageGoalsPerMatch;
}

console.log(getAverageGoals(fifaData));

/// STRETCH 🥅 //

/* Stretch 1: Create a function called `getCountryWins` that takes the parameters `data` and `team initials` and returns the number of world cup wins that country has had. 

Hint: Investigate your data to find "team initials"!
Hint: use `.reduce` */

function getCountryWins(data, teamInitials) {
  const winners = getFinals(data).map((element, i) => {
    if (element["Home Team Goals"] === element["Away Team Goals"])
      if (element["Win conditions"].split(" ")[0] === element["Home Team Name"])
        return element["Home Team Initials"];
      else return element["Away Team Initials"];

    if (element["Home Team Goals"] > element["Away Team Goals"])
      return element["Home Team Initials"];
    else return element["Away Team Initials"];
  });

  const wins = winners.reduce((sum, el) => {
    if (teamInitials === el) sum++;
    return sum;
  }, 0);

  return wins;
}

console.log("BRA: " + getCountryWins(fifaData, "BRA"));
console.log("ITA: " + getCountryWins(fifaData, "ITA"));
console.log("ARG: " + getCountryWins(fifaData, "ARG"));
console.log("FRA: " + getCountryWins(fifaData, "FRA"));
console.log("PER: " + getCountryWins(fifaData, "PER"));

/* Stretch 2: Write a function called getGoals() that accepts a parameter `data` and returns the team with the most goals score per appearance (average goals for) in the World Cup finals */

function getGoals(data) {
  const winners = getFinals(data).map((el) => {
    const HomeGoals = data.reduce((sum, elData) => {
      if (elData.Year === el.Year) {
        if (elData["Home Team Name"] === el["Home Team Name"])
          sum += elData["Home Team Goals"];
        else if (elData["Away Team Name"] === el["Home Team Name"])
          sum += elData["Away Team Goals"];
      }
      return sum;
    }, 0);

    const HomeAppearances = data.reduce((count, elData) => {
      if (elData.Year === el.Year) {
        if (elData["Home Team Name"] === el["Home Team Name"]) count++;
        else if (elData["Away Team Name"] === el["Home Team Name"]) count++;
      }
      return count;
    }, 0);

    const AwayGoals = data.reduce((sum, elData) => {
      if (elData.Year === el.Year) {
        if (elData["Home Team Name"] === el["Away Team Name"])
          sum += elData["Home Team Goals"];
        else if (elData["Away Team Name"] === el["Away Team Name"])
          sum += elData["Away Team Goals"];
      }
      return sum;
    }, 0);

    const AwayAppearances = data.reduce((count, elData) => {
      if (elData.Year === el.Year) {
        if (elData["Home Team Name"] === el["Away Team Name"]) count++;
        else if (elData["Away Team Name"] === el["Away Team Name"]) count++;
      }
      return count;
    }, 0);

    const HomeGoalsFor = HomeGoals / HomeAppearances;
    const AwayGoalsFor = AwayGoals / AwayAppearances;

    if (HomeGoalsFor === AwayGoalsFor)
      return `${el["Home Team Name"]} and ${el["Away Team Name"]} had the same average goals per appearance`;
    else if (HomeGoalsFor > AwayGoalsFor)
      return `In ${el.Year}: ${el["Home Team Name"]} had a better offence with an average goals per appearance of ${HomeGoalsFor}.`;
    else
      return `In ${el.Year}: ${el["Away Team Name"]} had a better offence with an average goals per appearance of ${AwayGoalsFor}.`;
  });
  return winners;
}

console.log(getGoals(fifaData));

/* Stretch 3: Write a function called badDefense() that accepts a parameter `data` and calculates the team with the most goals scored against them per appearance (average goals against) in the World Cup finals */

function badDefense(data) {
  const losers = getFinals(data).map((el) => {
    const HomeGoalsAgainst = data.reduce((sum, elData) => {
      if (elData.Year === el.Year) {
        if (elData["Home Team Name"] === el["Home Team Name"])
          sum += elData["Away Team Goals"];
        else if (elData["Away Team Name"] === el["Home Team Name"])
          sum += elData["Home Team Goals"];
      }
      return sum;
    }, 0);

    const HomeAppearances = data.reduce((count, elData) => {
      if (elData.Year === el.Year) {
        if (elData["Home Team Name"] === el["Home Team Name"]) count++;
        else if (elData["Away Team Name"] === el["Home Team Name"]) count++;
      }
      return count;
    }, 0);

    const AwayGoalsAgainst = data.reduce((sum, elData) => {
      if (elData.Year === el.Year) {
        if (elData["Home Team Name"] === el["Away Team Name"])
          sum += elData["Away Team Goals"];
        else if (elData["Away Team Name"] === el["Away Team Name"])
          sum += elData["Home Team Goals"];
      }
      return sum;
    }, 0);

    const AwayAppearances = data.reduce((count, elData) => {
      if (elData.Year === el.Year) {
        if (elData["Home Team Name"] === el["Away Team Name"]) count++;
        else if (elData["Away Team Name"] === el["Away Team Name"]) count++;
      }
      return count;
    }, 0);

    const HomeGoalsAgainstAvg = HomeGoalsAgainst / HomeAppearances;
    const AwayGoalsAgainstAvg = AwayGoalsAgainst / AwayAppearances;

    if (HomeGoalsAgainstAvg === AwayGoalsAgainstAvg)
      return `${el["Home Team Name"]} and ${el["Away Team Name"]} had the same average goals per appearance`;
    else if (HomeGoalsAgainstAvg > AwayGoalsAgainstAvg)
      return `In ${el.Year}: ${el["Home Team Name"]} had a bad defense with an average goals against per appearance of ${HomeGoalsAgainstAvg}.`;
    else
      return `In ${el.Year}: ${el["Away Team Name"]} had a bad defense with an average goals against per appearance of ${AwayGoalsAgainstAvg}.`;
  });
  return losers;
}

console.log(badDefense(fifaData));

/* If you still have time, use the space below to work on any stretch goals of your chosing as listed in the README file. */

// Stretch 4: Create a function that takes country initials as a parameter and returns their total number of World Cup appearances.

function getNumberOfAppearances(data, teamInitials) {
  const appearancesPerYear = getYears(getFinals).map((el) => {
    const numberOfAppearances = data.reduce((count, elData) => {
      if (elData.Year === el) {
        if (
          elData["Home Team Initials"] === teamInitials ||
          elData["Away Team Initials"] === teamInitials
        )
          count++;
      }
      return count;
    }, 0);

    return { year: el, appearances: numberOfAppearances };
  });

  return appearancesPerYear;
}
console.log("BRA:");
console.log(getNumberOfAppearances(fifaData, "BRA"));
console.log("ITA:");
console.log(getNumberOfAppearances(fifaData, "ITA"));
console.log("MEX:");
console.log(getNumberOfAppearances(fifaData, "MEX"));
console.log("FRA:");
console.log(getNumberOfAppearances(fifaData, "FRA"));
console.log("TUR:");
console.log(getNumberOfAppearances(fifaData, "TUR"));

//Stretch 5: Create a function that takes country initials as a parameter and determines how many goals that country has scored in World Cup games since 1930.

function getGoalsSince1930(data, teamInitials) {
  const goals = data.reduce((sum, elData) => {
    if (elData["Home Team Initials"] === teamInitials)
      sum += elData["Home Team Goals"];
    if (elData["Away Team Initials"] === teamInitials)
      sum += elData["Away Team Goals"];
    return sum;
  }, 0);

  return goals;
}
console.log("BRA:");
console.log(getGoalsSince1930(fifaData, "BRA"));
console.log("ITA:");
console.log(getGoalsSince1930(fifaData, "ITA"));
console.log("MEX:");
console.log(getGoalsSince1930(fifaData, "MEX"));
console.log("FRA:");
console.log(getGoalsSince1930(fifaData, "FRA"));
console.log("TUR:");
console.log(getGoalsSince1930(fifaData, "TUR"));

//Stretch 6: Use .map to format country names into <h1> HTML headers.

function formatH1(data) {
  const formattedData = data.map((elData) => {
    elData["Home Team Name"] = "<h1>" + elData["Home Team Name"] + "</h1>";
    elData["Away Team Name"] = "<h1>" + elData["Away Team Name"] + "</h1>";
    return elData;
  });

  return formattedData;
}

console.log(formatH1(fifaData)[0]);
