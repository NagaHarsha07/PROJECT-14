// Fetch and display relevant laws
async function findRelevantLaws(userInput) {
  try {
    const response = await fetch("laws.json");
    const laws = await response.json();

    const input = userInput.toLowerCase();

    // Match laws based on keyword score
    const matchedLaws = laws
      .map(law => {
        const score = law.keywords.reduce((count, keyword) => {
          return input.includes(keyword.toLowerCase()) ? count + 1 : count;
        }, 0);
        return { ...law, score };
      })
      .filter(law => law.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Show top 5

    displayResults(matchedLaws);
  } catch (error) {
    console.error("Error loading laws:", error);
    document.getElementById("results").innerHTML =
      "<p style='color: white;'>Error loading legal data. Please try again.</p>";
  }
}

// Show the results in readable cards
function displayResults(laws) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  if (laws.length === 0) {
    resultsDiv.innerHTML =
      "<p style='color: white;'>No relevant laws found. Try rephrasing your query.</p>";
    return;
  }

  laws.forEach(law => {
    const card = document.createElement("div");
    card.className = "law-result";

    card.innerHTML = `
      <h3>${law.title}</h3>
      <p>${law.summary}</p>
    `;

    resultsDiv.appendChild(card);
  });
}

// When button is clicked
document.getElementById("searchButton").addEventListener("click", () => {
  const userInput = document.getElementById("userInput").value.trim();
  if (userInput === "") {
    document.getElementById("results").innerHTML =
      "<p style='color: white;'>Please enter your legal problem above.</p>";
    return;
  }
  findRelevantLaws(userInput);
});
