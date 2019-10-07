const express = require('express');
const mongoose =  require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport'); 
const path = require('path');
const PORT = process.env.PORT || 3000;
const session = require('express-session');
 
 
var sess; 
const config = require('./config/db');
mongoose.set('useCreateIndex', true);

mongoose.connect(config.db, {
        useNewUrlParser: true
    })
    .then(() => {
        console.log(' Connecté à la base de donnés ' + config.db);
    }).catch(err => {
        console.log(err);
    });

    const app = express();
    
    app.use(cors({origin: 'http://localhost:4200'})); 
    app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(bodyParser.json());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(bodyParser.urlencoded({'extended':'false'}));
    mongoose.Promise = global.Promise;




    const checkUserType = function (req, res, next) {
    const userType = req.originalUrl.split('/')[2];

    require('./config/passport')(userType, passport);
    next();
};
 
app.use(checkUserType); 

const talents = require('./controllers/talents');
const document  = require('./controllers/document');
const admin = require('./controllers/admin');
const ChequeController = require("./controllers/ChequeController");
const PaiementController = require("./controllers/PaiementController");
const RendezVousControllers = require("./controllers/RendezVousController");
const offreControllers = require('./controllers/offreControllers.js');

app.use('/api/admin', admin);
app.use('/api/talents', talents);
app.use('/api/talents/document', document);
app.use("/imagesCheques", express.static("imagesCheques"));
app.use('/Cheque', ChequeController);
app.use('/paiement', PaiementController);
app.use('/restapi/rendez', RendezVousControllers);
app.use('/offres', offreControllers);
app.use('/', talents);
app.use('/', admin);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
