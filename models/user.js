var fs = require('fs')
var Tools = require('./tools')
var AddDb = require('./add_db')
var Check = require('./check')
const publicIp = require('public-ip');
var where = require('node-where');

let catchError = (error) => {
    console.error(error)
}

class User {

    static ChangeFirstName(userid, new_firstname) {
        return new Promise((resolve, reject) => {
            let sql = "UPDATE users SET name = ? WHERE id = ?;"
            connection.query(sql, [new_firstname, userid], (error, results) => {
                if (error)
                    reject(error)
                resolve(true)
            })
        })
    }

    static ChangeLastName(userid, new_lastname) {
        return new Promise((resolve, reject) => {
            let sql = "UPDATE users SET lastname = ? WHERE id = ?;"
            connection.query(sql, [new_lastname, userid], (error, results) => {
                if (error)
                    reject(error)
                resolve(true)
            })
        })
    }

    static ChangeEmail(userid, new_email) {
        return new Promise((resolve, reject) => {
            let sql = "UPDATE users SET email = ? WHERE id = ?;"
            connection.query(sql, [new_email, userid], (error, results) => {
                if (error)
                    reject(error)
                resolve(true)
            })
        })
    }

    static ChangeGender(userid, new_gender) {
        return new Promise((resolve, reject) => {
            let sql = "UPDATE users SET genre = ? WHERE id = ?;"
            connection.query(sql, [new_gender, userid], (error, results) => {
                if (error)
                    reject(error)
                resolve(true)
            })
        })
    }

    static ChangeDesire(userid, new_desire) {
        return new Promise((resolve, reject) => {
            let sql = "UPDATE users SET desire = ? WHERE id = ?;"
            connection.query(sql, [new_desire, userid], (error, results) => {
                if (error)
                    reject(error)
                resolve(true)
            })
        })
    }

    static ChangeBio(userid, new_bio) {
        return new Promise((resolve, reject) => {
            let sql = "UPDATE users SET bio = ? WHERE id = ?;"
            connection.query(sql, [new_bio, userid], (error, results) => {
                if (error)
                    reject(error)
                resolve(true)
            })
        })
    }

    static ChangePassword(userid, password){
        return new Promise((resolve, reject) => {
            Tools.HashPassword(password)
            .then((hash) => {
                let sql = "UPDATE users SET password = ? WHERE id = ?;"
                connection.query(sql, [hash, userid], (error, results) => {
                    if (error)
                        reject(error)
                    resolve(true)
                })
            })
        })
    }

    static ChangeAge(userid, new_age) {
        return new Promise((resolve, reject) => {
            let sql = "UPDATE users SET name = ? WHERE id = ?;"
            connection.query(sql, [new_age, userid], (error, results) => {
                if (error)
                    reject(error)
                resolve(true)
            })
        })
    }

    static ResetEmail(id, link){
        return new Promise((resolve, reject) => {
            var code = Tools.RandomString()
            Tools.CreateCode(id, code, 2)
            .then((status) => {
                if (status){
                    return User.GetAllById(id)
                }
                reject()
            }).then((user) => {
                Tools.SendMail(user['email'], "Matcha: password reset","Hi " + user['username'] + ",\nTo reset your password click this link :\n" + link + code)
                resolve(true)
            }).catch(catchError)
        })
    }

    static IdExists(id) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM users WHERE id = ?"
            connection.query(sql, id, (error, results) => {
                if (error)
                    reject(error)
                else if (results[0])
                    resolve(true)
                else
                    resolve(false)
            })
        })
    }

    static GetAllById(id){
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM users WHERE id = ?"
            connection.query(sql, id, (error, results) => {
                if (error)
                    reject(error)
                else if (results[0]) {
                    resolve(results[0])
                }
                resolve(undefined)
            })
        })
    }

    static GetIdByEmail(email){
        return new Promise((resolve, reject) => {
            let sql = "SELECT id FROM users WHERE email = ?"
            connection.query(sql, email, (error, results) => {
                if (error)
                    reject(error)
                else if (results[0])
                    resolve(results[0]['id'])
                resolve(undefined)
            })
        })
    }

    static GetIdByUsername(username){
        return new Promise((resolve, reject) => {
            let sql = "SELECT id FROM users WHERE username = ?"
            connection.query(sql, [username], (error, results) => {
                if (error)
                    reject(error)
                else if (results[0])
                    resolve(results[0]['id'])
                resolve(undefined)
            })
        })
    }

    static GetTags(id){
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM tags WHERE userid = ?"
            connection.query(sql, [id], (error, results) => {
                if (error)
                    reject(error)
                else if (results[0])
                    resolve(results)
                resolve(undefined)
            })
        })
    }

    static HasTag(userid, tag_name){
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM tags WHERE userid = ? AND tag_name = ?"
            connection.query(sql, [userid, tag_name], (error, results) => {
                if (error)
                    reject(error)
                else if (results[0])
                    resolve(true)
                resolve(false)
            })
        })
    }

    static AddTag(new_tag, userid){
        return new Promise((resolve, reject) => {
            this.HasTag(userid, new_tag)
            .then((has_tag) => {
                if (has_tag === false) {
                    let sql = "INSERT INTO tags VALUES(null, ?, ?);"
                    connection.query(sql, [userid, new_tag], (error, results) => {
                        if (error)
                        reject(error)
                        else {
                            AddDb.NewTagListIfNotExists(new_tag)
                            .then((new_tag_in_list) => {
                                if (new_tag_in_list)
                                    resolve([true, 'new_list'])
                                else
                                    resolve([true, 'same_list'])
                            }).catch(catchError)
                        }
                    })
                }
                else 
                    resolve([false, ''])
            }).catch(catchError)
            
        })
    }

    static DelTag(tag_name, userid){
        return new Promise((resolve, reject) => {
            this.HasTag(userid, tag_name)
            .then((has_tag) => {
                if (has_tag === true) {
                    let sql = "DELETE FROM tags WHERE userid = ? AND tag_name = ?;"
                    connection.query(sql, [userid, tag_name], (error, results) => {
                        if (error)
                        reject(error)
                        else                         
                            resolve([true, tag_name])
                    })
                }
                else 
                    resolve([false, ''])
            }).catch(catchError)
        })
    }

    static GetAllPictures(userid) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM pictures WHERE userid = ? ORDER BY position;"
            connection.query(sql, [userid], (error, results) => {
                if (error)
                reject(error)
                else                         
                    resolve(results)
            })
        })
    }
    
    static AddPicture(userid, filename){
        return new Promise((resolve, reject) => {
            this.GetAllPictures(userid)
            .then((results) => {
                let position = results.length + 1;
                if (position > 5) {
                    fs.unlink(__dirname.replace('models', 'public/pictures/') + filename, function(error){
                        if (error) throw error
                    })
                    return resolve([false, "Already 5 pictures"])
                }
                else {
                    let sql = "INSERT INTO pictures VALUES(null, ?, ?, ?);"
                    connection.query(sql, [userid, filename, position], (error, results) => {
                        if (error)
                            reject(error)
                        else                         
                            resolve([true, position])
                    })
                }
                console.log(results)
            }).catch(catchError)
        })
    }

    static RemovePicture(userid, position) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM pictures WHERE position = ? AND userid = ?;"
            connection.query(sql, [position, userid], (error, pic) => {
                if (error)
                    reject(error)
                else if (pic[0]){  
                    let sql = "DELETE FROM pictures WHERE position = ? AND userid = ?;"
                    connection.query(sql, [position, userid], (error, results) => {
                        if (error)
                            reject(error)
                        else {                         
                            fs.unlink(__dirname.replace('models', 'public/pictures/') + pic[0]['picture_name'], function(error){
                                if (error) throw error
                            })
                            for(var i = position; i <= 5; i++) {
                                console.log('i = '+i+'\n')
                                let sql = "UPDATE pictures SET position = ? WHERE position = ? AND userid = ?;"
                                connection.query(sql, [i - 1, i, userid], (error, results) => {
                                    if (error)
                                        reject(error)
                                })
                            }
                            resolve(true)
                        }
                    })
                }
                else
                    reject()
            })
        })
    }

    static SetProfilPicture(userid, position) {
        return new Promise((resolve, reject) => {
            console.log(position)
            Check.PictureExists(userid, position)
            .then((exists) => {
                if (!exists)
                    return resolve([false, null])
                let sql = "UPDATE pictures SET position = 10 WHERE position = 1 AND userid = ?;"
                connection.query(sql, [userid], (error, pic) => {
                    if (error)
                        reject(error)
                    else {
                        let sql = "UPDATE pictures SET position = 1 WHERE position = ? AND userid = ?;"
                        connection.query(sql, [position, userid], (error, pic) => {
                            if (error)
                                reject(error)
                            else {
                                let sql = "UPDATE pictures SET position = ? WHERE position = 10 AND userid = ?;"
                                connection.query(sql, [position, userid], (error, pic) => {
                                    if (error)
                                        reject(error)
                                    else
                                        resolve([true, null])        
                                })
                            }
                        })  
                    }
                })
            }).catch(catchError)
        })
    }

    static SetPosByIp(userid) {
        return new Promise((resolve, reject) => {
            publicIp.v4()
            .then(ip => {
                where.is(ip, function(err, result) {
                    if (result) {
                      console.log('Lat: ' + result.get('lat'));
                      console.log('Lng: ' + result.get('lng'));
                      let lat = result.get('lat')                      
                      let lng = result.get('lng')
                      let sql = "UPDATE users SET lat = ?, lng = ? WHERE id = ?;"
                      connection.query(sql, [lat, lng, userid], (error, pic) => {
                          if (error)
                              reject(error)
                          else {
                              resolve(true);
                          }
                      })
                    }
                  });
            }).catch(catchError)
        })
    }

    static SetPosByCoord(userid, lat, lng) {
        return new Promise((resolve, reject) => {
            let sql = "UPDATE users SET lat = ?, lng = ? WHERE id = ?;"
            connection.query(sql, [lat, lng, userid], (error, pic) => {
                if (error)
                    reject(error)
                else {
                    resolve(true);
                }
            })
        })
    }

    static ResetTimer(userid) {
        if (userid) {
            let time = (new Date).getTime();
            let sql = "UPDATE logged SET time = ?, logout = 0 WHERE userid = ?;"
            connection.query(sql, [time, userid], (error, pic) => {
                if (error) throw error
            })            
        }
    }

    static IsBlocked(uid, uid_target) {
        return new Promise((resolve, reject) => {
            if (uid && uid_target) {
                let sql = "SELECT * FROM blocked WHERE uid = ? AND uid_target = ?;"
                connection.query(sql, [uid, uid_target], (error, result) => {
                    if (error) throw error
                    if (result[0])
                        resolve(true)
                    else
                        resolve(false)
                })            
                    
            }
        })
    }

    static GetTime(uid) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM logged WHERE userid = ?;"
            connection.query(sql, [uid], (error, result) => {
                if (error) throw error
                if (result && result[0])
                    resolve(result)
                else
                    resolve(undefined)
            })            
        })
    }

    static ReportBlock(uid, uid_target, type) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM " + type + " WHERE uid = ? AND uid_target = ?;"
            connection.query(sql, [ uid, uid_target], (error, result) => {
                if (error) throw error
                if (result[0])
                    return resolve([false, 'User already ' + type])
                let sql = "INSERT INTO " + type +" VALUES(NULL, ?, ?);"
                connection.query(sql, [uid, uid_target], (error, result) => {
                    if (error) throw error
                    resolve([true, undefined])
                })         
            })
        })
    }

    static IsLiking(uid, uid_target) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM likes WHERE uid = ? AND uid_target = ?;"
            connection.query(sql, [uid, uid_target], (error, result) => {
                if (error) throw error
                if (result[0])
                    resolve(true)
                else
                    resolve(false)
            })
        })
        
    }

    static IsMatching(uid, uid_target) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT COUNT(*) FROM likes WHERE (uid = ? AND uid_target = ?) OR (uid = ? AND uid_target = ?);"
            connection.query(sql, [uid, uid_target, uid_target, uid], (error, result) => {
                if (error) throw error
                if (result && result[0] && result[0]['COUNT(*)'] === 2)
                    resolve(true)
                else
                    resolve(false)
            })
        })
        
    }

    static Like(uid, uid_target) {
        return new Promise((resolve, reject) => {
            let ret = undefined
            let sql = "SELECT * FROM pictures WHERE userid = ? AND position = 1;"                    
            connection.query(sql, [uid], (error, result) => {
                console.log(result)
                if (!result[0])
                    return resolve('You have no profile picture')
                this.IsLiking(uid, uid_target)
                .then((liking) => {
                let sql = undefined
                if (liking) {
                    sql = "DELETE FROM likes WHERE uid = ? AND uid_target = ?;"                    
                    ret = [true, 'User already']
                    return [sql, ret]                            
                }
                else {
                    sql = "INSERT INTO likes VALUES(NULL, ?, ?);"                    
                    ret = [false, 'User already']
                    return [sql, ret]                                    
                }
                }).then((ret) => {
                    connection.query(ret[0], [uid, uid_target], (error, result) => {
                        if (error) throw error
                        resolve(ret[1])
                })         
                }).catch(catchError)
            })
        })
    }


    static getAroundMe(ulat, ulng, gRange) {
        return new Promise((res,rej) => {
            let delta = gRange / (111.1 / Math.cos(ulat * 180 / Math.PI))
            const lngMax = ulng - delta
            const lngMin = ulng + delta
            const dist = gRange / 111.1
            const latMin = ulat - dist
            const latMax = ulat + dist
            const geoArray = [lngMin, lngMax, latMin, latMax]
            res(geoArray) 
        })
    }

    static getMyTarget(genre, desire) { //I dont want to do it but im forced please help me
        console.log("getMyTarget") 
        console.log(genre + ' ' + desire)
        return new Promise (
            (res, rej) => {
                let target = undefined
                if (genre === 'M' && desire === 'M')
                    target = "(genre = 'M' AND (desire = 'M' OR desire = 'B'))"
                else if (genre === 'M' && desire === 'F')
                    target = "(genre = 'F' AND  (desire = 'M' OR desire = 'B'))"
                else if (genre === 'M' && desire === 'B')
                    target = "((genre = 'M' AND (desire = 'M' OR desire = 'B')) OR (genre = 'F' AND  (desire = 'M' OR desire = 'B')))"
                else if (genre === 'F' && desire === 'M')
                    target = "(genre = 'M' AND (desire = 'F' OR desire = 'B'))"
                else if (genre === 'F' && desire === 'F')
                    target = "(genre = 'F' AND (desire = 'F' OR desire = 'B'))"
                else if (genre === 'F' && desire === 'B')
                    target = "((genre = 'F' AND (desire = 'F' OR desire = 'B')) OR (genre = 'M' AND (desire = 'F' OR desire = 'B')))"
                console.log(target)
                res(target)
            })
        }

    static theBigSearch(params, uid) {
        return new Promise((res, rej) => {
            this.GetAllById(uid)
            .then(user_info => {
                const ulat = user_info['lat']
                const ulng = user_info['lng']
                const age = JSON.parse(params.ageRange)
                const pop = JSON.parse(params.popRange)
                this.getAroundMe(ulat, ulng, params.geoRange)
            }).then(geoArray => {
                this.getMyTarget(user_info['genre'], user_info['desire'])
            }).then(sql2 => {
                let sql = "SELECT name, lastname, age, bio, genre, id, pop, desire, (6371 * acos(cos(radians(?)) * cos(radians(lat) ) * cos(radians(lng) - radians(?)) + sin(radians(?)) * sin(radians(lat)))) AS distance FROM users WHERE lat BETWEEN ? AND ? AND lng BETWEEN ? AND ? AND id != ? AND "
                let sql3 = "  AND age BETWEEN ? AND ? AND pop BETWEEN ? AND ? HAVING distance < ? ORDER BY pop;"
                console.log("SELECT name, lastname, age, bio, genre, id, pop, desire, (6371 * acos(cos(radians("+ulat+")) * cos(radians(lat) ) * cos(radians(lng) - radians("+ulng+")) + sin(radians("+ulat+")) * sin(radians(lat)))) AS distance FROM users WHERE lat BETWEEN "+geoArray[2]+" AND "+geoArray[3]+" AND lng BETWEEN "+geoArray[0]+" AND "+geoArray[1]+" AND id != "+uid+" AND "+sql2+"  AND age BETWEEN "+age[0]+" AND "+age[1]+" AND pop BETWEEN "+pop[0]+" AND "+pop[1]+" HAVING distance < "+params.geoRange+" ORDER BY pop;" + "\n")
                console.log(sql + sql2 + sql3 + "\n")
                connection.query(sql + sql2 + sql3, [ulat, ulng, ulat, geoArray[2], geoArray[3], geoArray[0], geoArray[1], uid, age[0], age[1], pop[0], pop[1], params.geoRange], (error, results) => {
                    if (error)
                        rej(error)
                    else if (results) {
                        console.log(results[0])
                        res(results)
                    }
                })
            }).catch(catchError)
        })
    }

    static GetPopularity(uid) {
        console.log("getPopu")
        return new Promise((resolve, reject) => {
            this.GetAllById(uid).then(user_info => {
                return this.getMyTarget(user_info['genre'], user_info['desire'])
            }).then(sql2 => {
                let sql = "SELECT A.field/B.field AS pop FROM (SELECT count(*) AS field FROM likes WHERE uid_target = ?) AS A, (SELECT count(*) AS field FROM users WHERE "
                if (sql2 != undefined) {
                    connection.query(sql + sql2 + ") AS B", [uid], (error, result) => {
                        if (error) throw error
                        console.log(result[0].pop)
                        resolve(result[0].pop)
                    })
                } else
                    resolve("You Must select a genre")
            }).catch(catchError)
        })
    }

    static GetNotif(uid) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM notif WHERE uid = ?"
            connection.query(sql, [uid], (error, results) => {
                if (error)
                    reject(error)
                else if (results)
                    resolve(results)
                resolve(undefined)
            })
        })
    }

    static NotifShown(uid) {
        return new Promise((resolve, reject) => {
            console.log('showzn : ' + uid)
            let sql = "UPDATE notif SET shown = 1 WHERE uid = ? AND shown = 0"
            connection.query(sql, [uid], (error, results) => {
                if (error)
                    reject(error)
                else
                    resolve()
                resolve(undefined)
            })
        })
    }

    static SetSessionID(session_id, uid) {
        let sql = "UPDATE sockets SET session_id = ? WHERE uid = ?"
        connection.query(sql, [session_id, uid], (error, results) => {
            if (error) throw error
        })
    }

    static SetSocketID(socket_id, session_id) {
        let sql = "UPDATE sockets SET socket_id = ? WHERE session_id = ?"
        connection.query(sql, [socket_id, session_id], (error, results) => {
            if (error) throw error
        })
    }

    static GetSocketID(uid) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT socket_id FROM sockets WHERE uid = ?"
            connection.query(sql, [uid], (error, results) => {
                if (error) throw error
                else
                    resolve(results[0]['socket_id'])
            })
        })
    }

    static NewVisit(data) {
        let sql = "INSERT INTO history VALUES(null, ?, ?)"
        connection.query(sql, [data.uid_target, data.uid], (error, results) => {
            if (error) throw error
        })
        sql = "INSERT INTO notif VALUES(null, ?, ?, 1, null, 0)"
        connection.query(sql, [data.uid_target, data.uid], (error, results) => {
            if (error) throw error
        })
    }

    static NewNotifLike(uid, uid_target, type) {
        var sql = "INSERT INTO notif VALUES(null, ?, ?, 2, ?, 0)"
        connection.query(sql, [uid_target, uid, type], (error, results) => {
            if (error) throw error
        })
    }
}

module.exports = User