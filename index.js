const express = require("express");
const app = (exports.app = express());
//setup for sockets
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });
// const io = require("socket.io")(server, { origins: "localhost:8080 https://more-cowbell.heruko.com:*" });
////////////////////
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
// app.use(
//     cookieSession({
//         secret: `we need more cowbell!`,
//         maxAge: 1000 * 60 * 60 * 24 * 14,
//     })
// );

const cookieSessionMiddleware = cookieSession({
    secret: `we need more cowbell!`,
    maxAge: 1000 * 60 * 60 * 24 * 14,
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
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
                compare(password, hashedPw)
                    .then((match) => {
                        if (match) {
                            req.session.userId = results.rows[0].id; //set cookie
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
                await ses.sendEmail(email, eMessage, eSubject); ////////////////// TOGGLE SES!!!!
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

app.get("/api/user", async (req, res) => {
    const { userId } = req.session;
    try {
        let userData = await db.getUserDataById(userId);
        let rows = userData.rows[0];
        res.json({ rows });
    } catch (err) {
        console.log("Error in GET api/user", err);
    }
});

app.post(
    "/upload/profilepic",
    uploader.single("file"),
    s3.upload,
    async (req, res) => {
        if (req.file) {
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

app.get("/api/user/:otherId", async (req, res) => {
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
            console.log("Error in GET user/:id", err);
        }
    } else {
        console.log("invalid user id: not a number or negative");
        res.json({ rows: null });
    }
});

app.get("/api/users", async (req, res) => {
    try {
        let { rows } = await db.getMostRecent();
        res.json(rows);
    } catch (err) {
        console.log("Error in app GET /users: ", err);
    }
});

app.get("/api/users/:search", async (req, res) => {
    const { search } = req.params;
    try {
        let { rows } = await db.searchUser(search);
        res.json(rows);
    } catch (err) {
        console.log("Error in GET users/:id", err);
    }
});

app.get("/api/checkFriendStatus/:otherId", async (req, res) => {
    const { userId } = req.session;
    const { otherId } = req.params;
    try {
        let { rows } = await db.getFriendshipStatus(userId, otherId);
        rows.length == 0
            ? res.json({ btnText: "Send Friend Request" })
            : rows[0].accepted
            ? res.json({ btnText: "Unfriend" })
            : rows[0].sender_id == userId
            ? res.json({ btnText: "Cancel Friend Request" })
            : res.json({ btnText: "Accept Friend Request" });
    } catch (err) {
        console.log("Error in app GET checkFriendStatus/:otherId", err);
    }
});

app.post("/api/setFriendship/:otherId", async (req, res) => {
    const { userId } = req.session;
    const { otherId } = req.params;
    const { action } = req.body;

    try {
        let { rows } = await db.getFriendshipStatus(userId, otherId);
        rows.length == 0
            ? await db.sendFriendship(userId, otherId)
            : rows[0].accepted ||
              (!rows[0].accepted && rows[0].sender_id == userId) ||
              action === "reject"
            ? await db.deleteFriendship(userId, otherId)
            : await db.acceptFriendship(userId, otherId);
        res.json({ success: true });
    } catch (err) {
        console.log("Error in app POST setFriendship/:otherId", err);
    }
});

app.get("/api/getFriends", async (req, res) => {
    const { userId } = req.session;
    try {
        let myRequests = new Array(),
            friendsWannabes = new Array();
        let { rows } = await db.getFriendsAndWannabes(userId);
        rows.forEach((row) => {
            !row.accepted && row.sender_id == userId
                ? myRequests.push(row)
                : friendsWannabes.push(row);
        });
        res.json({ myRequests, friendsWannabes });
    } catch (err) {
        console.log("Error in app GET getFriends", err);
    }
});

app.get("/api/logout", (req, res) => {
    req.session = null;
    res.redirect("*");
});

///////////////////// MUST BE LAST GET ROUTE //////////////
app.get("*", function (req, res) {
    const { userId } = req.session;
    if (!userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});
//////////////////////////////////////////////////////////
if (require.main == module) {
    server.listen(process.env.PORT || 8080, () =>
        console.log("social network SERVER at 8080...")
    );
}
//////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////
////////////////// SOCKETS GO HERE ///////////////////////
//////////////////////////////////////////////////////////

io.on("connection", async (socket) => {
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    } // we are technically adding a double layer of protection, and just making sure
    //that only users with the right cookie are recognised as connected sockets

    const { userId } = socket.request.session;
    console.log(`connected socket id (${socket.id}) / userId (${userId})`);

    ///////////////// retrieving our messages history

    try {
        let data = await db.getMsgBrdHistory();
        let payload = data.rows.reverse();
        io.emit("mbdbHistory", payload);
    } catch (err) {
        console.log("Error in SOCKET io.emit mbdbHistory", err);
    }

    // receiving a new message from a connected socket

    socket.on("newMsgFromClient", async (newMsg) => {
        console.log(`userId ${userId} just added this message: ${newMsg}`);
        try {
            await db.addBoardMessage(userId, newMsg);
            let data = await db.getMsgBrdHistory();
            let payload = data.rows.reverse();
            io.emit("mbdbHistory", payload);
        } catch (err) {
            console.log("Error in SOCKET io.emit newMsgFromClient", err);
        }

        // we need to add this msg to the chat table
        // we also want to retrieve the information of the author of the msg specifically first, maybe last (?), and IMAGE url from our users table
        // compose an msg object containing the user info and the new message that
        // got send make sure it structurally matches with what your message
        // objects in the chat history look like
        // io.sockets.emit("mbdbNewEntry", newMsg);
    });

    /*
    
    //sends ONLY the one client

    socket.emit("welcome", {
        name: "Ariel",
    });

    //io.emit takes 2 arguments: the name of the message, 2nd is the data sent to the client
    //will send to EVERY logged in USERS

    io.emit("messageWithIoEmit", {
        id: socket.id,
    });

    //broadcast.emit
    //sends a message to ALL USERS except the client who just connected

    socket.broadcast.emit("broadcastEmitTest", {
        id: socket.id,
    });

    //here we listen to events emitted by the client

    socket.on("messageFromClient", (data) => {
        console.log("data from client through sockets: ", data);
    });
    */

    //user leave or logged out?
    //reserved string or EVENT for disconnect
    socket.on("disconnect", () => {
        console.log(`disconnected! (${socket.id}) / userId (${userId})`);
    });
});
