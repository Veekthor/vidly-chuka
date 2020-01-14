
module.exports = (err, req, res, next)=>{
    //Log exception
    res.status(500).send('Something failed');
};