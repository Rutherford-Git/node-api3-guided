const hubs = require('./hubs-model');

async function checklist(req, res, next){
    try{
        const hub = await hubs.findById(req.params.id)
        if (hub){
            req.hub = hub;
            next()
        }else{
            next({
                status: 404, 
                message: `Hub ${req.params.id} not found`
            })
        }
    }catch (err){
        next(err);
    }
}

function checkHub(req, res, next){
    const { name } = req.body;
    if (
        name !== undefined &&
        typeof name === 'string ' && 
        name.length &&
        name.trim().length
    ){
        next();
    }else{
        next({status: 422,
            message: 'hubs needs a name'
        })
    }
}

module.exports = {checklist, checkHub}