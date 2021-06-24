const updatedAt = document.getElementById("updated-date");
const container = document.getElementById("container");

const fetchPromoCodes = async () => {
  const res = await fetch("https://promo.myconfig.store/api/v1/public_codes");
  const json = await res.json();

  return json;
};

const copyToClipboard = (text) => {
  return navigator.permissions
    .query({ name: "clipboard-write" })
    .then((result) => {
      if (result.state == "granted" || result.state == "prompt") {
        return navigator.clipboard.writeText(text).then(
          function () {
            return true;
          },
          function () {
            return false;
          }
        );
      }
    });
};

const updatePage = async () => {
  updatedAt.innerHTML =
    '<div class="spinner-grow spinner-grow-sm text-primary" role="status"></div>';
  container.innerHTML =
    '<div class="d-flex align-items-center justify-content-center p-4"><div class="spinner-border text-primary" role="status"></div></div>';

  const data = await fetchPromoCodes();

  if (data?.data && data?.updatedAt) {
    updatedAt.innerText = `: ${data.updatedAt}`;
    container.innerHTML = Object.keys(data.data)
    .map((code) => {
      const promo = data.data[code];

      return `<div class="card m-4 shadow-lg" style="max-width: 500px">
        <div class="card-header w-100 bg-primary py-3 d-flex align-items-center justify-content-center">
          <h4 class="text-center text-white fw-bolder mb-0">${code}</h4>
          <button type="button" id="copy-btn-for-${code}" class="copy-btn btn btn-light ms-4 fw-bold text-primary">Copy</button>
        </div>
        <div class="card-body w-100 p-4">
          <h5 class="card-title">Get a discount of ${promo}%</h5>
          <p class="card-text">by using the promo code <strong>${code}</strong></p>
        </div>
      </div>`;
    });

    const copyButton = document.getElementsByClassName("copy-btn");

    const copyButtons = [...copyButton];

    return copyButtons.forEach((btn) =>
      btn.addEventListener("click", () => {
        const code = btn.attributes.getNamedItem("id").value.split("-")[3];

        if (copyToClipboard(code)) {
          btn.innerHTML = "Copied";

          setTimeout(() => {
            btn.innerHTML = "Copy";
          }, 3000);
        }
      })
    );
  }
};

updatePage();
