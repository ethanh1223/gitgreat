const express = require('express');
const parser = require('body-parser');
const url = require('url');
var stormpath = require('express-stormpath');

const db = require('../db');
const dbModels = require('../db/index.js');
const utils = require('./utils.js');

const cloudinary = require('cloudinary');
const multiparty = require('multiparty');
var path = require('path');

// Wells's cloudinary api key, replace with your own as this key will be deleted soon
cloudinary.config({
 cloud_name: 'dhdysf6qc',
 api_key: '299727653385491',
 api_secret: 'vshmxkEjzRiylUjrXi20qk67hKA'
});

const app = express();
app.use(parser.json());

//serve public folder static files
app.use(express.static(path.join(__dirname, '..', '/public')));
//serve node_modules via the '/script' virtual file path
app.use('/scripts', express.static('../node_modules'));

app.use(stormpath.init(app, {
  apiKey: {
    id: process.env.STORMPATH_KEY,
    secret: process.env.STORMPATH_SECRET
  },
  application: {
    href: process.env.STORMPATH_HREF
  },
  website: true,
   web: {
    produces: ['application/json']
  }
}));

app.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/homepage.html'));
});

app.post('/eventTable', function(req, res, next) {
  var location = req.body.location;
  return dbModels.EventTable.create({
      name: req.body.name,
      when: req.body.when,
      // owner: req.body.owner.email
    })
    .then(function(event) {
      dbModels.UsersTable.findOne({where: {email: req.body.owner.email}})
      .then(function(user) {
        dbModels.UsersTableEventTable.create({
          userId: user.dataValues.id,
          eventId: event.dataValues.id
        })
        .then(function () {
          console.log('OMG WE DID IT!!!!!!!')
        })
      })
    })
    //NEED TO SPECIFY EMAIL AS FOREIGN KEY
    .then(function() {
      dbModels.EventTable.findOne({where: {name: req.body.name}})
        .then(function(event) {
          dbModels.LocationTable
            .create({
              label: location.label,
              address: location.address,
              latitude: location.latitude,
              longitude: location.longitude,
              placeID: location.placeID,
              categories: location.categories,
              eventId: event.id,
            })
            .then(function() {
              res.sendStatus(200);
            })
            .catch(function() {
              res.sendStatus(400);
            });
        })
    })
    .catch(function(err) {
      res.sendStatus(400);
    });
});

app.get('/eventTable', function(req, res, next) {
  var userEmail = url.parse(req.url).query.slice(9)
  console.log(userEmail)

  dbModels.UsersTable.findOne({where: {email: userEmail}})
  .then(function(user) {
    console.log('THIS THE FUKKIN USER', user)
    dbModels.EventTable.findAll({
      order: [['when', 'DESC']],
      include: [
        {
          model: dbModels.UsersTable, 
          through: {
            where: {id: user.dataValues.id}
          }
      }]
    })
    .then(function(userEvents) {
      dbModels.EventTable.findAll({order: [['when', 'DESC']], include: [dbModels.LocationTable]})
      .then(function(locationEvents) {
        console.log('USEREVENTS', userEvents)
        console.log('LOCATIONEVENTS', locationEvents)
        var result = [];
        for (var j = 0; j < userEvents.length; j++) {
          for (var i = 0; i < locationEvents.length; i++) {
            if (userEvents[j].dataValues.id === locationEvents[i].dataValues.id) {
              var formattedEvent = {};
              var event = locationEvents[i].dataValues;
              var location = event.location.dataValues;
              formattedEvent.name = event.name;
              formattedEvent.when = event.when;
              formattedEvent.location = {
                label: location.label,
                address: location.address,
                latitude: parseFloat(location.latitude),
                longitude: parseFloat(location.longitude),
                placeID: location.placeID,
                categories: JSON.parse(location.categories)
              }
              result.push(formattedEvent);
            }
          }
        }
        console.log('THIS IS THE RESULT', result)
        res.send(result)
      });
    })
  })
});

app.delete('/eventTable', function(req, res, next) {
  var eventName = url.parse(req.url).query.slice(5).split('_').join(' ');
  dbModels.EventTable.destroy({where: {name: eventName}})
    .then(function(event) {
      console.log('deleted');
      res.sendStatus(200);
    });
  console.log(eventName);
});

app.post('/itemList', function(req, res, next) {
  var eventName = url.parse(req.url).query.slice(10).split('_').join(' ');
  dbModels.EventTable.findOne({where: {name: eventName}})
    .then(function(event) {
      var eventId = event.id;
      dbModels.ItemListTable
      .create({
        item: req.body.item,
        owner: req.body.owner,
        cost: req.body.cost,
        eventId: eventId
      })
      .then(function(item) {
        utils.sendResponse(res, 201, 'text/html', 'item successfully posted');
      }).catch(function(err) {
        console.log('Error: ', err);
      });
    });
});

app.get('/itemList', function(req, res, next) {

  var eventName = url.parse(req.url).query.slice(10).split('_').join(' ');
  dbModels.EventTable.findOne({where: {name: eventName}})
    .then(function(event) {
      var eventId = event.id;
      dbModels.ItemListTable.findAll({where: {eventId: eventId}})
        .then(function(items) {
          utils.sendResponse(res, 200, 'application/json', items);
        });
    });
});

app.post('/reminders', function(req, res, next) {
  var eventName = url.parse(req.url).query.slice(10).split('_').join(' ');
  console.log(eventName);

  dbModels.EventTable.findOne({where: {name: eventName}})
    .then(function(event) {
      var eventId = event.id;
      dbModels.ReminderTable
      .create({
        phoneNumber: req.body.phoneNumber,
        msg: req.body.msg,
        when: req.body.when,
        eventId: eventId
      })
      .then(function(item) {
        utils.sendResponse(res, 201, 'text/html', 'reminder successfully posted');
      }).catch(function(err) {
        console.log('Error: ', err);
      });
    });
});

app.get('/reminders', function(req, res, next) {
  var eventName = url.parse(req.url).query.slice(10).split('_').join(' ');
  dbModels.EventTable.findOne({where: {name: eventName}})
    .then(function(event) {
      var eventId = event.id;
      dbModels.ReminderTable.findAll({where: {eventId: eventId}})
        .then(function(reminders) {
          utils.sendResponse(res, 200, 'application/json', reminders);
        });
    });
});


app.post('/uploadImage', function(req, res) {
 console.log('hits uploadImage in server');
 var form = new multiparty.Form();
 form.parse(req, function(err, fields, files) {
   console.log('fields: ', fields);
   console.log('files: ', files);
   console.log('file:', files.imageFile[0].path);

   cloudinary.uploader.upload(files.imageFile[0].path, function(result) {
     console.log('cloudinary resulttt: ', result);
     dbModels.PhotosTable.create({url: result.url})
       .then(function(event) {
         console.log('successfully added url to db!!!');
       })
       .catch(function(err) {
         console.log('photosTable db entry error: ', err);
       });
   });

 });
 res.send();
});

app.get('/displayImages', function(req, res) {
 console.log('hits displayimages in server');
 dbModels.PhotosTable.findAll()
 .then(function(data) {
   for(var pair in data.entries()) {
     console.log(pair);
   }
   res.send(data);
 });
});

app.post('/createAccount', function (req, res) {
  dbModels.UsersTable.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
  })
   .then(function(event) {
     console.log('successfully added user to db!!!');
   })
   .catch(function(err) {
     console.log('UsersTable db entry error: ', err);
   });
  res.sendStatus(201)
})

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '..', '/public/homepage.html'));
})

app.on('stormpath.ready', function () {
  app.listen(3000, function() {
    console.log('Server is listening on port 3000');
  });
})

module.exports = app;