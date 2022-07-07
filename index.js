const express = require("express");
const app = express();
const fsPromises = require("fs").promises;
const mongoose = require("mongoose");
app.use(express.json());



//conectando con la bd de mongo
mongoose
  .connect("mongodb+srv://noemigp19:mongo123@kodemia.infez.mongodb.net/kodemia")
  .then(() => {
    console.log("BD connected..");

    app.listen(8080, (request, response) => {
      console.log("Nuestro servidor esta prendido");
    });
  })
  .catch((err) => console.log(`No se pudo conectar a la b.d debido a: ${err}`));


  app.get("/", (request, response) => {
  response.json({
    message: "Endpoint de HOME",
  });
});

const koderShema = new mongoose.Schema({
    name: {
        type: String,
        minlenth: 3,
        maxlength: 20,
        required: true 
    },
    edad: {
        type: Number,
        min: 18,
        max: 150
    },
    gen: {
        type: String,
        required: true
    },
    modulo: {
        type: String
    },
    hobbies: {
        type: [String],
    },
    genero: {
        type: String,
        enum: ["f","m", "o"]
    }
})

//modelos
const Koders = mongoose.model("Koder", koderShema)

app.get("/koders", async (request, response) => {
    //utilizar modelo para acceder a nuestra bd
    const koders = await Koders.find({}) //promesa
    console.log("koders", koders)

    response.json({
        "message": "El endpoint koders funciona"
    })
})

app.get("/koder-by-id/:id", async (request, response) => {
    //utilizar modelo para acceder a nuestra bd
    const { id } = request.params
    const koders = await Koders.findById(id) //promesa
    console.log("koders", koders)

    response.json({
        "message": "El endpoint koders funciona"
    })
})