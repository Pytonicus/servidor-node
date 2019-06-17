var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors');

var app = express();

mongoose.connect('mongodb://localhost:27017/lista-angular');

var Lista = mongoose.model('Lista', {
    texto:String,
    terminado: Boolean 
}); 


app.listen(8080, function(){
    console.log('servidor API');
});

app.use(express.bodyParser());
app.use(express.methodOverride()); 

app.use(cors());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // Se incluye una información no visible pero accesible a cualquier usuario en la red gracias al *
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); // Estos son los headers básicos que vamos a permitir
    next(); 
  });

app.post('/api/lista', function(peticion, respuesta){ 
    Lista.create({
        texto: peticion.body.texto
    }, function(error, lista){ 
        if(error){
            respuesta.send(error); 
        }
        Lista.find(function(error, lista){
            respuesta.json(lista); 
        })
    });
});

app.get('/api/lista', function(peticion, respuesta){
    Lista.find(function(error, lista){
        if(error){
            respuesta.send(error);
        }
        respuesta.json(lista);
    });
});
app.delete('/api/lista/:item', function(peticion, respuesta){
    Lista.remove({
        _id: peticion.params.item 
    }, function(error, lista){ 
        Lista.find(function(error, lista){
        if(error){
            respuesta.send(error);
        }
        respuesta.json(lista);
    });
    })
});

app.put('/api/lista/:item', function(peticion, respuesta){
    Lista.findOneAndUpdate(
        {_id: peticion.params.item}, 
        {terminado: true, texto: peticion.body.texto}, // Asignamos el valor texto y establecemos que le llegará la petición desde el body. 
        function(error, lista){
            if(error){
                respuesta.send(error);
            }
            Lista.find(function(error,lista){
            if(error){
                respuesta.send(error);
            }
            respuesta.json(lista);
            })
        })
});

app.get('*', function(request, recursos){
    recursos.sendfile('./publico/index.html'); 
}); 