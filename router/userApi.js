const express = require('express')
const router = express.Router();
const lodash=require('lodash')
const userSchema = require('../models/user.js')

const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
// async function func(){
//     var user = await userSchema.find()
//     console.log(user)

// }
// func()
router.post('/', async (req, res) => {
   
   
    try {
        var user = await userSchema .findOne({ login: req.body.login })

         
        if (user) {
            console.log(admin,12);
           const  test = await bcrypt.compare(req.body.password, user.password)
                console.log(test ,5)
            if (test) {
                var token = jwt.sign({ _id: user._id }, 'privateKey', { expiresIn: '1d' })

                // console.log(admin);
                // res.send({token: token})  pour envoyer comme objet  json 
                res.header('Authorization', token).send({ 
                    message: true , 
                    user: user._id,
                   // role:admin.role,
                      token: token })
            }
            else { //res.status(201).send("mots de passe incorrect")
                return res.send({ message: false })
            }

        }
        else {
            return /*res.status(401).send("email ou mots ded passe incorrect").*/res.send({ message: false })
        }

    } catch (error) {
        res.send(error.message)
    }

});

console.log("declarer super user")
router.get('/', async (req, res) => {
  
    var users = await userSchema.find()
    
        res.send(users)
})

router.get('/:id', async (req, res) => {
    var user=  await userSchema.findById(req.params.id).populate('Listejoueurs').populate('users');
    res.send(user)
})

router.post('/adduser', async (req, res) => {
    try{
        var user = await userSchema.findOne({login:req.body.login});


    if(!user)
       
   { 
    var user =  await  userSchema.create(req.body)
    await userSchema.findByIdAndUpdate(user._id,{hist:[],resultatRoulette:0}, { new: true })
    const saltRounds = 10;
    const salt = bcrypt.genSalt(saltRounds)
   user.password = await bcrypt.hash(user.password, saltRounds);// pour crypter password

   await  user.save();
   if(user.role=="user"){

   
   await userSchema.findByIdAndUpdate({ _id:req.body.superuser }, { $push: { users: user._id } })
   }
   return res.send({
       message: true,
       id: user._id
    })
    }
    else{
        return res.send({message:false})
    }
   
 /*var  user  =new userSchema({
           nom:req.params.nom,
         age:req.params.age     //tu peut creer d'apres les parametres /:nom/:age en api de poste
      
   })    
    /*  user = await userSchema.create(user);*/
   
        
    
    }catch(error){
        res.send(error.message)   
    }
    
});
router.put('/:id', async (req, res) => {
    try{
        var  user = await userSchema.findByIdAndUpdate(req.params.id, req.body, { new: true })
 
        res.send({message:true})
   
        
    
    }catch(error){
        res.send(error.message)   
    }
    
});
router.delete('/:id', async (req, res) => {
    try{
        const userDelete = await userSchema.deleteOne({ _id: req.params.id }).then(async (group) => {
            var users = await   userSchema.find();
            res.send(users)
          })
        
   
        
    
    }catch(error){
        res.send(error.message)   
    }
    
});


module.exports = router;
