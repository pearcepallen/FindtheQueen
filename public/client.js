//Check Token
async function intialize() {
  const token = localStorage.getItem("token");

  const response = await axios
    .post("/user/verify", {
      token: `${token}`,
    })
    .catch((err) => {
      console.log(err);
    });

  localStorage.removeItem("token");

  if (response.data.verified) {
    // Make connection
    const socket = io.connect("http://localhost:7621");

    // Query DOM
    const message = document.getElementById("message"),
      output = document.getElementById("output");

    ["1", "2", "3"].forEach((id) => {
      const button = document.getElementById(id);
      button.addEventListener("click", () => {
        socket.emit("choice", Number(button.value));
      });
    });

    socket.on("message", function (data) {
      output.innerHTML += "<p><strong>" + data + "</strong></p>";
    });

    socket.on("disconnectClient", function () {
      setTimeout(() => {
        window.location.href = "/";
      }, 10000);
    });
  } else {
    alert("Incorrect/Missing Credentials. Please try again");
    window.location.href = "/";
  }
}
