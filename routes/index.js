var express = require('express')
var router = express()
var User = require('../models/user.js')

let catchError = (error) => {
    console.error(error)
}

// router.get('/:data', (req, res) => {
//     if (req.session.connected !== false) {
//         console.log(req.params)
//         // let data = JSON.parse(req.params.data)
//         // res.render('pages/index')
//     }
// })

router.get('/', (req, res) => {
    let username = undefined

    if (!req.session.connected){
        req.session.connected = {'state': false, 'id': undefined}
    }
    if (req.session.connected.state !== false) {
        User.GetAllById(req.session.connected.id)
        .then((user_info) => {
            username = user_info['username'].toUpperCase()
            res.render('pages/index', {session :req.session, username: username})
        }).catch(catchError)
    }
    else 
        res.render('pages/index', {session :req.session, username: username})      
})

module.exports = router