document.addEventListener("DOMContentLoaded", function () {
  document.getElementById('login').addEventListener("submit", (event) => {
    event.preventDefault();
    const user = document.getElementById("username");
    const pass = document.getElementById("password");

    axios.post("/user/login", {
        username: `${user.value}`,
        password: `${pass.value}`,
      })
      .then(function (response) {
        const token = response.data.userToken;
        if(token !== undefined)
        {
          console.log(token);
          localStorage.setItem('token', token);
          window.location.href = '/client.html';
        }
        else {
          alert('Incorrect Credentials or client is already logged in. Please try again');
        }
      })
      .catch(function (error) {
        console.log(error);
        alert('Incorrect Credentials');
      });
  });
});

