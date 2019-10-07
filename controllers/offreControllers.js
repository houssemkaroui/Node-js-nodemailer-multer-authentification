const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
var Offre = require('../models/offre');
var Postulation = require('../models/postulation');
var Group = require('../models/groupe');
var GroupOffre = require('../models/groupeDoffre');
var nodemailer = require('nodemailer');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
var Document = require('../models/document');

var router = express.Router();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var multer = require('multer');
var upload = multer({ dest: './uploads/' });


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user:'tsunamiittest@gmail.com',
    pass: 'tsunami123*'
  },

});
//postuler un groupe offre 

router.post('/offre/send/att',	async function(req, res, next) {
    var array=req.body;
  
   var TableauEmails= []
   var TableausURLS=[]
   var talent= new Document()
   talent= await Document.findById({_id:array['idDocuments'][0]})
   console.log(talent)
   idTalentt= talent['idTalent']
   console.log(idTalentt);
   for (var i = 0; i < array['idOffres'].length; i++){
    var offre= new Offre()   
    offre= await Offre.find({_id: array['idOffres'][i]});
              TableauEmails.push(offre[0]['email']);
              var post = new Postulation({
        
        
                idTalent: idTalentt,
                idOffre: array['idOffres'][i]
        
            });
            post.save();
   }
   for (var j = 0; j < array['idDocuments'].length; j++){
    var doc= new Document()  
    doc= await Document.find({_id: array['idDocuments'][j]});
        TableausURLS.push(doc[0]['image']);
        
   }
   var attachementList = [];
    for (var k = 0; k < TableausURLS.length; k++) {
      var nom = TableausURLS[k].substring(36,TableausURLS[k].length);
      console.log("nom"+nom);
      var str2  = TableausURLS[k].replace("http://localhost:3000",".");
      console.log("str2"+str2);
			attachementList.push({
				filename: nom,
				path: str2
			});
		}
console.log(attachementList)

		//console.log(attachementList);*/

		var mailOptions = {
		   from: 'tsunamiittest@gmail.com',
		 	bcc:  TableauEmails ,
           subject:  array['object'] ,
           html: array['message'],
	      attachments: attachementList,
		
		};

	//	console.log(mailOptions)

		// send mail with defined transport object
		transporter.sendMail(mailOptions, function(error, info){
		    if(error){
		        return console.log(error);
		    }
		    console.log('Message sent: ' + info.response);
		    res.json(info);
		});
   
	
});

//--------------------------------------
router.post('/group/send/att',	async function(req, res, next) {
    var array=req.body;
   var idOffres=[];
   var TableauEmails= []
   var TableausURLS=[]
   var talent= new Document()
   talent= await Document.findById({_id:array['idDocuments'][0]});
   //console.log(talent)
   idTalentt= talent['idTalent']
   //console.log(idTalentt);
   for (var i = 0; i < array['idGroupes'].length; i++){
    var grou= new GroupOffre()   
    grou= await GroupOffre.find({idGroupe: array['idGroupes'][i]});
    var n=grou.length; 
    //console.log(n)
    for(var j=0; j<n ;j++){
        console.log(n)
     idOffres.push(grou[j]['idOffre'])
    }     
    }

    for(var x=0;x<idOffres.length;x++){
    var offre= new Offre()   
    offre= await Offre.find({_id: idOffres[x]});
              TableauEmails.push(offre[0]['email']);
              var post = new Postulation({
        
        
                idTalent: idTalentt,
                idOffre: idOffres[x]
        
            });
            post.save();
        }  
       
   for (var j = 0; j < array['idDocuments'].length; j++){
    var doc= new Document()  
    doc= await Document.find({_id: array['idDocuments'][j]});
        TableausURLS.push(doc[0]['image']);
        
   }
   var attachementList = [];
    for (var k = 0; k < TableausURLS.length; k++) {
      var nom = TableausURLS[k].substring(36,TableausURLS[k].length);
      //console.log("nom"+nom);
      var str2  = TableausURLS[k].replace("http://localhost:3000",".");
      //console.log("str2"+str2);
			attachementList.push({
				filename: nom,
				path: str2
			});
		}
console.log(attachementList)
console.log("emails    "+TableauEmails);

		//console.log(attachementList);*/

		var mailOptions = {
		   from: 'tsunamiittest@gmail.com',
		 	bcc:  TableauEmails ,
           subject:  array['object'] ,
           html: array['message'],
	      attachments: attachementList,
		
		};

	//	console.log(mailOptions)

		// send mail with defined transport object
		transporter.sendMail(mailOptions, function(error, info){
		    if(error){
		        return console.log(error);
		    }
		    console.log('Message sent: ' + info.response);
		    res.json(info);
		});
   
	
});
//le systéme permet l'administrateur de consulter une offre by id
router.get('/:id/offre', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Offre.findById(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retriving Offre :' + JSON.stringify(err, undefined, 2)); }
    });
 
});
//post groupe
router.post('/groupe', (req, res) => {
    var off = new Group({
        nom: req.body.nom,
    });
    off.save((err, doc) => {
        if (!err) { res.send(doc); }
        else { res.send('Error in Offre Save :' + JSON.stringify(err, undefined, 2)); }
    });
});
//get groupe id
router.get('/:id/group', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Group.findById(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retriving Offre :' + JSON.stringify(err, undefined, 2)); }
    });
 
});
//get all groupe
router.get('/allgroupe', (req, res) => {
    Group.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in Retriving Produit :' + JSON.stringify(err, undefined, 2)); }
    });
});
//deleate offre
/*router.delete('/:id/offredelate',(req,res)=>{
    a = req.body
    for (var i =0; i < body["idOffres"].length;i++) {
        gg= new GroupOffre({
            idOffre:body["idOffres"][i]

        });
        gg.remove();
    }
    res.send('idOffres est suppr');
});*/
//post groupeDoffre 
router.post('/groupDoffre',async function(req, res) {

    body = req.body
    var j=0 ;
    var k = body["idOffres"].length ;
    for (var i =0; i < body["idOffres"].length;i++) {
        group= new GroupOffre({
            idGroupe:body["idGroupe"],
            idOffre:body["idOffres"][i]

        });
        var g= new GroupOffre()
        g= await GroupOffre.find({ $and : [
            {idOffre:body["idOffres"][i] } , {idGroupe : body["idGroupe"] } ]
        });
        //console.log(g.length)
        if(!g.length )
            {group.save() ;
            j++ ;} 
        else if((g.length>0) && (body["idOffres"].length== 1))
            res.status(404).send(body["idOffres"][i] +" "+ "deja saved");

    };
    var n=k-j;
    console.log(n)
    if(j==0)
    {
        res.status(520).send("Nothing was Saved Sadly")
    }
    else if(n==0)
    {
        res.status(200).send("All saved")
    }
    else
        res.send(j +" "+ "offres saved and "+n +" offres not saved")

});
//get all groupeDoffres
router.get('/allgroupeDoffre', (req, res) => {
    GroupOffre.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in Retriving Produit :' + JSON.stringify(err, undefined, 2)); }
    });
});

//consulter tous les offresActtive
router.get('/offreActive', (req, res) => {
    Offre.find({"statut": "Active"},(err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in Retriving Offre :' + JSON.stringify(err, undefined, 2)); }
    });
});
//consulter les offresDesacti
router.get('/offreDesactiver', (req, res) => {
    Offre.find({"statut": "Desactive"},(err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in Retriving talent :' + JSON.stringify(err, undefined, 2)); }
    });
});

//consulter un groupe d'offre by id
router.get('/:id/groupoff', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Group.findById({_id:req.params.id}, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retriving Offre :' + JSON.stringify(err, undefined, 2)); }
    });

});

//le systeme permet l'administrateur de céer une offre
router.post('/', (req, res) => {
    var off = new Offre({
        description: req.body.description,
        domaine: req.body.domaine,
        motCle: req.body.motCle,
        systeme: req.body.systeme,
        numero :req.body.numero,
        statut: req.body.statut,
        email: req.body.email,

    });
    off.save((err, doc) => {
        if (!err) { res.send(doc); }
        else { res.send('Error in Offre Save :' + JSON.stringify(err, undefined, 2)); }
    });
});
//le systeme permet l'administrateur de modifier  une offre
router.put('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    var off = {
        description: req.body.description,
        domaine: req.body.domaine,
        motCle: req.body.motCle,
        systeme: req.body.systeme,
        numero :req.body.numero,
        statut: req.body.statut,
        email:req.body.email,
        
    };
    Offre.findByIdAndUpdate(req.params.id, { $set: off }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Offre Update :' + JSON.stringify(err, undefined, 2)); }
    });
});


//le systéme permet l'administrateur de désactiver une offre
router.put('/off/:id', (req, res ) => {
    
    Offre.updateOne({ _id: req.params.id },{$set:{"statut":"Desactive"}} ,(err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in Retriving Offre :' + JSON.stringify(err, undefined, 2)); }
    });
});
//le systéme permet l'administrateur de consulter de sts selon des criter
router.get('/sts', (eq, res) => {
    Offre.distinct('domaine' ,(err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in Retriving Offre :' + JSON.stringify(err, undefined, 2)); }
    });
});

module.exports = router;







