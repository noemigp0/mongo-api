const { json } = require("express");
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
    required: true,
  },
  edad: {
    type: Number,
    min: 18,
    max: 150,
  },
  gen: {
    type: String,
    required: true,
  },
  modulo: {
    type: String,
  },
  hobbies: {
    type: [String],
  },
  genero: {
    type: String,
    enum: ["f", "m", "o"],
  },
});

//modelos
const Koders = mongoose.model("Koder", koderShema);

// app.get("/koders", async (request, response) => {
//     //utilizar modelo para acceder a nuestra bd
//     const koders = await Koders.find({}) //promesa
//     console.log("koders", koders)

//     response.json({
//         "message": "El endpoint koders funciona"
//     })
// })

// app.get("/koder-by-id/:id", async (request, response) => {
//     //utilizar modelo para acceder a nuestra bd

//     try {
//     const { id } = request.params
//     const koder = await Koders.findById(id) //promesa
//     response.json({
//         sucess: true,
//         data: {
//             koder
//         }
//     })
//     } catch (error){
//         response.status(400)
//         response.json({
//             sucess: false,
//             error
//         })

//     }

// })

app.get("/koders/:identificador", async (request, response) => {
  console.log("Entre");
  try {
    const { identificador } = request.params;
    // const { name, modulo } = request.query
    //const koder = await Koders.find({ name: name, modulo: modulo}) // ejemplo con filtros
    const koder = await Koders.findById(identificador, "name"); //Ejemplo para cortar el json
    response.json({
      success: true,
      data: {
        koder,
      },
    });
  } catch (error) {
    response.status(404);
    response.json({
      sucess: false,
      message: error.message,
    });
  }
});

app.patch("koderss/:id", async (request, response) => {
  console.log("Estoy en el patch");
  const { nombre, gen } = request.body;
  console.log(nombre, gen);
  response.json("entre al patch");
});

//endpoint de patch
//Actualizar un koder
//Validen errroes

app.patch("/koderssu/:id", async (request, response) => {
  try {
    const { id } = request.params;
    //console.log(id)
    const newKoder = request.body;

    const koderUpdated = await Koders.findByIdAndUpdate(id, newKoder);

    response.json({
      success: true,
      koderUpdated,
    });
  } catch (err) {
    response.status(404)
    response.json({
      sucess: false,
      message: err.message,
    });
  }
});


//Post
//Delete




app.delete("/detelekoder/:id", async (request, response) => {
    try{
        const { id } = request.params
        //const deleteKoder = await Koders.deleteOne({ _id: id})//mi forma
        const deleteKoder = await Koders.findByIdAndDelete(id)

        response.status(200)
        response.json({
            success: true,
            deleteKoder
        })

    }catch (error){
        response.status(404)
        response.json({
            success: false,
            message: error.message
        })
    }
})


//Ejemplo de middleware
// app.use((request, response, next) => {
//     console.log("Estoy en mi MIDDLEWARE 1", request.body)
//     //Actualizar cuando se hace un endpoint
//     //Formatear fechas
//     request.body["created_at"] = new Date()

//     next()//Es uan funsion que se ejecuta
// })

// app.use((request, response, next) => {
//     console.log("Estoy en mi MIDDLEWARE 2", request.body)
//         next()//Es uan funsion que se ejecuta
// })

const middleRuta = (request, response, next) =>  {
    console.log("Esto es una funsion")
    next()
} 

app.post("/newkoder", middleRuta, async (request, response) => {//El middleware se pasa como segundo parametro, y no se debe hacer algo mas para invocar
    console.log(request.body);
    try {
        const newKoder = request.body
        const createKoder = await Koders.create(newKoder)
        response.status(201)
        response.json({
            success: true,
            createKoder
        })

    } catch (error) {
        response.status(404)
        response.json({
            success: false,
            message: error.message
        })
    }
})