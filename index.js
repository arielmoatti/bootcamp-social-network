const express = require("express");
const app = (exports.app = express());
const compression = require("compression");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const { hash, compare } = require("./bc");
const db = require("./db");

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

// app.use(csurf());

// app.use(function (req, res, next) {
//     res.locals.csrfToken = req.csrfToken();
//     res.set("x-frame-options", "DENY");
//     next();
// });

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
    // console.log("Hit the post register route");
    // console.log("req.body", req.body);
    if (
        // firstname !== "" &&
        // lastname !== "" &&
        // email !== "" &&
        // password !== ""
        firstname &&
        lastname &&
        email &&
        password
    ) {
        //existing email validation
        db.getUserDataByEmail(email)
            .then((results) => {
                if (results.rows.length == 0) {
                    console.log("email is good to use!");
                    //email not existing
                    hash(password)
                        .then((hashedPw) => {
                            // console.log("hashedPw", hashedPw);
                            db.createUser(firstname, lastname, email, hashedPw)
                                .then((results) => {
                                    //set cookie
                                    req.session.userId = results.rows[0].id;
                                    console.log("a new user was added!");
                                    res.json({ success: true });
                                }) //end of createUser()
                                .catch((err) => {
                                    console.log(
                                        "error in POST /register createUser()",
                                        err
                                    );
                                });
                        }) //end of hash()
                        .catch((err) => {
                            console.log("error is POST /register hash()", err);
                        });
                } else {
                    //of if block (email)
                    console.log("error! email has been already used");
                    res.json({
                        success: false,
                        message: "this email is already in use",
                    });
                }
            }) //end of getUserDataByEmail()
            .catch((err) => {
                console.log("error is POST /register checkEmail()", err);
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

if (require.main == module) {
    app.listen(process.env.PORT || 8080, () =>
        console.log("social network SERVER at 8080...")
    );
}
