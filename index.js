const express = require("express");
const app = (exports.app = express());
const compression = require("compression");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const { hash, compare } = require("./bc");
const db = require("./db");
const cryptoRandomString = require("crypto-random-string");
const ses = require("./ses");
const s3 = require("./s3");
const { s3Url } = require("./config.json");

/////// MULTER ////////
// handles files and stores them in the "uploads" folder
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24)
            .then(function (uid) {
                callback(null, uid + path.extname(file.originalname));
            })
            .catch((err) => {
                console.log("error in multerdiskstorage: ", err);
            });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});
////////////////////////////////////////////

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
                        // console.log("a new user was added!");
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
                                "Error in POST /register createUser()",
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
                // console.log("from getUserDataByEmail > hashedPw: ", hashedPw);
                compare(password, hashedPw)
                    .then((match) => {
                        // console.log(
                        //     "user input password matches the hash? ",
                        //     match
                        // );
                        if (match) {
                            //set cookie
                            req.session.userId = results.rows[0].id;
                            // console.log("successful log in!");
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
                        console.log("Error in POST /login compare():", err);
                        res.json({
                            success: false,
                            message: "server error",
                        });
                    });
            })
            .catch((err) => {
                console.log("Error in POST /login getUserDataByEmail():", err);
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

app.post("/password/reset/old", (req, res) => {
    const { email } = req.body;
    if (email) {
        db.getUserDataByEmail(email)
            .then((results) => {
                if (results.rows.length > 0) {
                    const secretCode = cryptoRandomString({
                        length: 6,
                    });
                    db.storeCode(secretCode, email)
                        .then(() => {
                            const eSubject = "Your request to reset password";
                            const eMessage = `
                                Please use the code below as verification to reset your password:
                                ${secretCode}
                                note: this code expires after 10 minutes!
                                `;
                            ses.sendEmail(email, eMessage, eSubject)
                                .then(() => {
                                    console.log(
                                        "reset email got sent to: ",
                                        email
                                    );
                                    res.json({ success: true });
                                })
                                .catch((err) => {
                                    console.log("error in ses.sendEmail:", err);
                                    res.json({
                                        success: false,
                                        message:
                                            "server error. Please try again",
                                    });
                                });
                        })
                        .catch((err) => {
                            console.log(
                                "Error in POST /password/reset/start storeCode()",
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
                    "Error in POST /password/reset/start getUserDataByEmail():",
                    err
                );
                res.json({
                    success: false,
                    message: "server error. Please try again",
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

app.post("/password/reset/start", async (req, res) => {
    const { email } = req.body;
    if (email) {
        try {
            let checkEmail = await db.getUserDataByEmail(email);
            if (checkEmail.rows.length > 0) {
                const secretCode = cryptoRandomString({
                    length: 6,
                });
                console.log("secretCode: ", secretCode);
                await db.storeCode(secretCode, email);
                const first = checkEmail.rows[0].first;
                const eSubject = "Your request to reset the login password";
                const eMessage = `
                Hello, ${first}!
                Please use the verification code below to reset your password:
                ${secretCode}
                note: this code expires after 10 minutes!
                `;
                // await ses.sendEmail(email, eMessage, eSubject); ////////////////// NO SES!!!!
                res.json({ success: true });
            } else {
                res.json({
                    success: false,
                    message: "email address was not found, try again",
                });
            }
        } catch (err) {
            if (err.message.startsWith("Invalid domain name")) {
                console.log("error in ses.sendEmail(): ", err);
            } else {
                console.log(err);
            }
            res.json({
                success: false,
                message: "server error. Please try again",
            });
        }
    } else {
        console.log("error! empty field!");
        res.json({
            success: false,
            message: "please enter your email address",
        });
    }
});

app.post("/password/reset/verify", async (req, res) => {
    const { email, secretCode, password } = req.body;
    if (secretCode && password) {
        try {
            let checkCode = await db.checkCode(email);
            if (checkCode.rows.length > 0) {
                // console.log("most recent code is: ", checkCode.rows[0].code);
                if (checkCode.rows[0].code === secretCode) {
                    // console.log("exists and matches!");
                    let hashedPw = await hash(password);
                    // console.log("hashedPw", hashedPw);
                    await db.updatePw(hashedPw, email);
                    res.json({ success: true });
                } else {
                    console.log("code mismatch :(");
                    res.json({
                        success: false,
                        message:
                            "recovery code doesn't match or expired. Please try again or request a new code",
                    });
                }
            } else {
                console.log("code is expired :(");
                res.json({
                    success: false,
                    message:
                        "recovery code doesn't match or expired. Please try again or request a new code",
                });
            }
        } catch (err) {
            console.log(err);
            res.json({
                success: false,
                message: "server error. Please try again",
            });
        }
    } else {
        console.log("error! empty fields!");
        res.json({
            success: false,
            message: "these two fields are mandatory!",
        });
    }
});

app.post("/api/user", async (req, res) => {
    const { userId } = req.session;
    try {
        let userData = await db.getUserDataById(userId);
        let rows = userData.rows[0];
        res.json({ rows });
    } catch (err) {
        console.log("Error in POST api/user", err);
    }
});

app.post(
    "/upload/profilepic",
    uploader.single("file"),
    s3.upload,
    async (req, res) => {
        if (req.file) {
            // console.log("req.file", req.file);

            const { userId } = req.session;
            const url = `${s3Url}${req.file.filename}`;
            try {
                let results = await db.uploadPicture(url, userId);
                let returnedUrl = results.rows[0].avatar;
                res.json({ returnedUrl });
            } catch (err) {
                console.log("Error in POST upload/profilepic", err);
                res.json({
                    success: false,
                    message: "server error. Please try again",
                });
            }
        } else {
            console.log("error! no image selected in uploader");
            res.json({
                success: false,
                message: "no file was chosen",
            });
        }
    }
);

app.post("/upload/bio", async (req, res) => {
    const { userId } = req.session;
    const { biotext } = req.body;
    try {
        let results = await db.updateBio(biotext, userId);
        let returnedBio = results.rows[0].bio;
        res.json({ returnedBio });
    } catch (err) {
        console.log("Error in POST upload/bio", err);
        res.json({
            success: false,
            message: "server error. Please try again",
        });
    }
});

app.post("/user/:otherId", async (req, res) => {
    const { userId } = req.session;
    const { otherId } = req.params;
    if (otherId > 0) {
        try {
            let otherProfileData = await db.getUserDataById(otherId);
            let rows = otherProfileData.rows[0];
            if (otherId == userId) {
                res.json({
                    rows,
                    match: true,
                    ownId: userId,
                });
            } else {
                res.json({
                    rows,
                    match: false,
                });
            }
        } catch (err) {
            console.log("Error in POST user/:id", err);
        }
    } else {
        console.log("invalid user id: not a number or negative");
        res.json({ rows: null });
    }
});

app.post("/users", async (req, res) => {
    try {
        let { rows } = await db.getMostRecent();
        // let rows = results.rows[0];
        res.json(rows);
    } catch (err) {
        console.log("Error in POST users", err);
    }
});

if (require.main == module) {
    app.listen(process.env.PORT || 8080, () =>
        console.log("social network SERVER at 8080...")
    );
}
