var express = require('express')
var router = express()
var User = require('../models/user.js')

let catchError = (error) => {
    console.error(error)
}

router.get('/', (req, res) => {
    let username = undefined
    if (!req.session.connected){
        req.session.connected = {'state': false, 'id': undefined}
    }
    if (req.session.connected.state !== false) {
        User.GetAllById(req.session.connected.id)
        .then((user_info) => {
            username = user_info['username'].toUpperCase()
            res.render('pages/error', {session :req.session, username: username})
        }).catch(catchError)
    }
    else 
        res.render('pages/error', {session :req.session, username: username})
    
})

module.exports = router