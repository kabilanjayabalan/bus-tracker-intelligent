const Route = require("../models/Route");

exports.getRoutes = async (req,res)=>{
    try{
        const routes = await Route.find();
        res.json(routes);
    }catch(error){
        res.status(500).json({message:error.message});
    }
};