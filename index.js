const express = require("express");
const app = (exports.app = express());
const compression = require("compression");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const { hash, compare } = require("./bc");
const db = require("./db");
const cryptoRandomString = require("crypto-random-string");
const ses = require("./ses");

////////////////////// MIDDLEWARE //////////////////////
app.use(
    cookieSession({
        secret: `we need more cowbell!`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

// app.use(
//     express.urlencoded({
//         extended: false,
//     })
// );

app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    res.set("x-frame-options", "DENY");
    next();
});

app.use(compression());

app.use(express.json());

app.use(express.static("public"));

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

////////////////////// ROUTES //////////////////////
app.get("/welcome", (req, res) => {
    const { userId } = req.session;
    if (userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("*", function (req, res) {
    const { userId } = req.session;
    if (!userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/register", (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    if (firstname && lastname && email && password) {
        hash(password)
            .then((hashedPw) => {
                db.createUser(firstname, lastname, email, hashedPw)
                    .then((results) => {
                        //set cookie
                        req.session.userId = results.rows[0].id;
                        console.log("a new user was added!");
                        res.json({ success: true });
                    }) //end of createUser()
                    .catch((err) => {
                        if (err.constraint == "users_email_key") {
                            console.log("error! email has been already used");
                            res.json({
                                success: false,
                                message: "this email is already in use",
                            });
                        } else {
                            console.log(
                                "error in POST /register createUser()",
                                err
                            );
                        }
                    });
            }) //end of hash()
            .catch((err) => {
                console.log("error is POST /register hash()", err);
            });
        //end of hash block
    } else {
        //of if block (firstname, lastname, email, password)
        console.log("error! empty fields!");
        res.json({
            success: false,
            message: "make sure your form is complete!",
        });
    }
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        db.getUserDataByEmail(email)
            .then((results) => {
                const hashedPw = results.rows[0].password;
                console.log("from getUserDataByEmail > hashedPw: ", hashedPw);
                compare(password, hashedPw)
                    .then((match) => {
                        console.log(
                            "user input password matches the hash? ",
                            match
                        );
                        if (match) {
                            //set cookie
                            req.session.userId = results.rows[0].id;
                            console.log("successful log in!");
                            res.json({ success: true });
                        } else {
                            console.log("error! no match passwords");
                            res.json({
                                success: false,
                                message: "Uh oh! you have failed to log in...",
                            });
                        }
                    })
                    .catch((err) => {
                        console.log("error in POST /login compare():", err);
                        res.json({
                            success: false,
                            message: "server error",
                        });
                    });
            })
            .catch((err) => {
                console.log("error in POST /login getUserDataByEmail():", err);
                res.json({
                    success: false,
                    message: "Uh oh! you have failed to log in...",
                });
            });
    } else {
        console.log("error! empty fields!");
        res.json({
            success: false,
            message: "these two fields are mandatory!",
        });
    }
});

app.post("/password/reset/start", (req, res) => {
    const { email } = req.body;
    if (email) {
        db.getUserDataByEmail(email)
            .then((results) => {
                if (results.rows.length > 0) {
                    const secretCode = cryptoRandomString({
                        length: 6,
                    });
                    console.log("secretCode", secretCode);
                    db.storeCode(secretCode, email)
                        .then(() => {
                            console.log("code inserted into table");
                            const resetEmail = {
                                subject: "Your request to reset your password",
                                message: `Please use the code below as verification to reset your password:
                                ${secretCode}`,
                            };
                            ses.sendEmail(
                                email,
                                resetEmail.message,
                                resetEmail.subject
                            );
                            console.log(
                                "email, resetEmail.message, resetEmail.subject",
                                email,
                                resetEmail.message,
                                resetEmail.subject
                            );

                            //when email was sent successfully, send success only
                            res.json({ success: true });
                        })
                        .catch((err) => {
                            console.log(
                                "error in POST /password/reset/start storeCode()",
                                err
                            );
                            res.json({
                                success: false,
                                message: "server error. Please try again",
                            });
                        });
                } else {
                    res.json({
                        success: false,
                        message: "email address was not found, try again",
                    });
                }
            })
            .catch((err) => {
                console.log(
                    "error in POST /password/reset/start getUserDataByEmail():",
                    err
                );
                res.json({
                    success: false,
                    message: "server error",
                });
            });
    } else {
        console.log("error! empty field!");
        res.json({
            success: false,
            message: "please enter your email address",
        });
    }
});

if (require.main == module) {
    app.listen(process.env.PORT || 8080, () =>
        console.log("social network SERVER at 8080...")
    );
}
