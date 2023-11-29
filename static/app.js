const BASE_URL = "http://localhost:5000/api";
const $cupcakesList = $("#cupcakes-container");
const $newCupcakeForm = $("#create-cupcake");

function generateCupcakeHTML(cupcake) {
  return `
    <div data-cupcake-id="${cupcake.id}">
      <li>
        ${cupcake.flavor} / ${cupcake.size} / ${cupcake.rating}
        <button class="delete-button">X</button>
      </li>
      <img class="cupcake-img"
            src="${cupcake.image || 'No Image Available*'}"
            alt="No Image Available*">
    </div>
  `;
}

async function showInitialCupcakes() {
  try {
    const response = await axios.get(`${BASE_URL}/cupcakes`);
    const cupcakesData = response.data.cupcakes;

    const cupcakesHTML = cupcakesData.map(generateCupcakeHTML).join('');
    $cupcakesList.html(cupcakesHTML);
  } catch (error) {
    console.error("Error when showing initial cupcakes", error);
  }
}

$newCupcakeForm.on("submit", async function (evt) {
  evt.preventDefault();

  const flavor = $("#flavor").val();
  const rating = $("#rating").val();
  const size = $("#size").val();
  const image = $("#image").val();

  try {
    const newCupcakeResponse = await axios.post(`${BASE_URL}/cupcakes`, {
      flavor,
      rating,
      size,
      image
    });

    const newCupcakeHTML = generateCupcakeHTML(newCupcakeResponse.data.cupcake);
    $cupcakesList.append(newCupcakeHTML);
    $newCupcakeForm.trigger("reset");
  } catch (error) {
    console.error("Error adding new cupcake:", error);
  }
});

$cupcakesList.on("click", ".delete-button", async function (evt) {
  evt.preventDefault();
  const $cupcake = $(evt.target).closest("div");
  const cupcakeId = $cupcake.attr("data-cupcake-id");

  try {
    await axios.delete(`${BASE_URL}/cupcakes/${cupcakeId}`);
    $cupcake.remove();
  } catch (error) {
    console.error("Error deleting cupcake:", error);
  }
});

$(showInitialCupcakes);