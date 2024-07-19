const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
const methodOverride = require('method-override');

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public/css")));
app.use(express.static(path.join(__dirname, "/public/js")));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'lecture5',
    password: "King@7585"
});

let getRandomUser = () => {
    return [
        faker.string.uuid()
    ];
}

//Home Route
app.get("/", (req, res) => {
    let q = `SELECT count(*) FROM user`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            // console.log(result[0]["count(*)"]);
            // res.send(`Total Number of user is ${result[0]["count(*)"]}.`);

            let count = result[0]["count(*)"];
            res.render("home.ejs", { count });
        });
    } catch (err) {
        res.send("Some error in Database");
    }
    // res.send("Welcome to Homapage");
});

//Show User Route
app.get("/user", (req, res) => {
    let q = `SELECT * FROM user`;
    try {
        connection.query(q, (err, users) => {
            if (err) throw err;
            // console.log(users);
            res.render("showusers.ejs", { users });
        });
    } catch (err) {
        res.send("Some error in Database");
    }
});

//Edit Route
app.get("/user/:id/edit", (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM user WHERE id = '${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];
            res.render("edit.ejs", { user });
        });
    } catch (err) {
        res.send("Some error in Database")
    }
});

//Update Route (DB)
app.patch("/user/:id", (req, res) => {
    let { id } = req.params;
    let { password: formPass, username: newUser } = req.body;
    let q = `SELECT * FROM user WHERE id = '${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];
            if (formPass != user.password) {
                res.send("Password is not correct");
            } else {
                let q2 = `UPDATE user SET username='${newUser}' WHERE id = '${id}'`;
                connection.query(q2, (err, result) => {
                    if (err) throw err;
                    res.redirect('/user');
                });
            }
        });
    } catch (err) {
        res.send("Some error in Database")
    }
});

//add user route
app.get("/user/add", (req, res) => {
    let userid = getRandomUser();
    let defalutId = userid[0];
    res.render("adduser.ejs", { defalutId });
});

app.post("/user", (req, res) => {
    let { id, username, email, password } = req.body;
    let q = `INSERT INTO user (id,email,username,password) VALUES ('${id}','${email}','${username}','${password}')`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            res.redirect('/user');
        });
    } catch (err) {
        res.send("Some error in Database")
    }

});

//Delete 
app.get("/user/:id/delete", (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM user WHERE id = '${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];
            res.render("delete.ejs", { user });
        });
    } catch (err) {
        res.send("Some error in Database")
    }
});

app.delete("/user/:id", (req, res) => {
    let { id } = req.params;
    let { password: formPass, username: formUser } = req.body;
    let q = `SELECT * FROM user WHERE id = '${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];
            if ((formPass == user.password)&&(formUser = user.username)) {
                let q = `DELETE FROM user WHERE id = '${id}'`;
                connection.query(q, (err, result) => {
                    if (err) throw err;
                    res.redirect('/user');
                });
            } else {
                res.send("Credentials Invalid..<br>Please check username and password.");
            }
        });
    } catch (err) {
        res.send("Some error in Database")
    }
});

app.listen(port, () => {
    console.log(`Server is listening to port ${port}`);
});

// try {
//     connection.query(q, [data], (err, result) => {
//         if (err) throw err;
//         console.log(result);
//     });
// } catch (err) {
//     console.log(err);
// }

// connection.end();