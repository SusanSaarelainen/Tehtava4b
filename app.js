const express = require("express");
const fs = require("fs");

const app = express();

const port = 3000;

let sanakirja = [];

const data = fs.readFileSync("./sanakirja.txt", {
  encoding: "utf8",
  flag: "r",
});

const splitLines = data.split(/\r?\n/); //jaetaan merkkijono rivin vaihtojen perusteella

splitLines.forEach((line) => {
  const sanat = line.split(" "); //jaetaan yhden rivin merkkijono kahteen osaan

  const sana = {
    fin: sanat[0],
    eng: sanat[1],
  };

  sanakirja.push(sana);
});

console.log(sanakirja);

app.use(express.json()); //käytetään json-muotoista dataa

app.use(express.urlencoded({ extended: true })); //käytetään tiedonsiirrossa laajennettua muotoa

//CORS-määrittely
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Content-type", "application/json");

  next();
});

app.get("/sanakirja", (req, res) => {
  res.json(sanakirja);
});

// haesana
app.get("/sanakirja/:fin", (req, res) => {
  const fin = String(req.params.fin);
  const sana = sanakirja.find((sana) => sana.fin === fin);
  res.json(sana ? sana : { message: "Ei löydy" });
});
// lisaasana
app.post("/sanakirja", (req, res) => {
  const sana = req.body;
  console.log("lisätään");
  console.log(sana);
  sanakirja.push(sana);
  console.log(sanakirja);
  //data.push(user);
  res.json(sanakirja);
});

// paiitasanaa
app.put("/sanakirja/:fin", (req, res) => {
  const fin = String(req.params.fin);
  const paivitetty = req.body;
  sanakirja = sanakirja.map((sana) => (sana.fin === fin ? paivitetty : sana));
  res.json(sanakirja);
});

app.listen(port, () => {
  console.log(`Kuunnellaan portissa ${port}`);
});

/*<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script>
      //$("form").submit(function (e) {
      $(document).ready(function () {
        $('[name="Submit"]').click(function (e) {
          alert("lähetys");

          const sana = {
            fin: $("#fin").val(),
            eng: $("#eng").val(),
          };

          $.ajax({
            type: "POST",
            url: "http://localhost:3000/sanakirja",
            dataType: "json",
            data: JSON.stringify(sana),
            contentType: "application/json",
          })
            .done((data) => {
              console.log({ data });
            })
            .fail((err) => {
              console.error(err);
            })
            .always(() => {
              console.log("always called");
            });
        });
        e.preventDefault();
      });
    </script>
    <title>Artistit</title>
  </head>
  <body>
    <form name="form">
      <label for="fin">Suomeksi</label>
      <input type="text" id="fin" name="fin" />
      <label for="eng">Englanniksi</label>
      <input type="text" id="eng" name="eng" />
      <input name="Submit" type="button" value="Tallenna" />
    </form>
  </body>
</html>
*/
