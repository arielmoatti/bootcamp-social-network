let spicedPg = require("spiced-pg");
let db = spicedPg(
    process.env.DATABASE_URL || "postgres:postgres:postgres@localhost:5432/sn"
);

//////////////
/// SELECT ///
//////////////

exports.getUserDataByEmail = (userEmail) => {
    return db.query(
        `
        SELECT * 
        FROM users 
        WHERE email = $1;
        `,
        [userEmail]
    );
};

exports.getUserDataById = (userId) => {
    return db.query(
        `
        SELECT first, last, avatar, bio 
        FROM users 
        WHERE id = $1;
        `,
        [userId]
    );
};
exports.checkCode = (userEmail) => {
    return db.query(
        `
        SELECT code FROM reset_codes
        WHERE email = $1
        AND CURRENT_TIMESTAMP - timestamp < INTERVAL '10 minutes'
        ORDER BY timestamp DESC
        LIMIT 1;
        `,
        [userEmail]
    );
};

//////////////////////////////////
/// INSERT || UPDATE || UPSERT ///
//////////////////////////////////

exports.createUser = (firstname, lastname, email, hashedPw) => {
    return db.query(
        `
        INSERT INTO users (first, last, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id;
        `,
        [firstname, lastname, email, hashedPw]
    );
};

exports.storeCode = (secretCode, userEmail) => {
    return db.query(
        `
        INSERT INTO reset_codes (code, email)
        VALUES ($1, $2);
        `,
        [secretCode, userEmail]
    );
};

exports.updatePw = (hashedPw, userEmail) => {
    return db.query(
        `
        UPDATE users
        SET password = $1
        WHERE email = $2;
        `,
        [hashedPw, userEmail]
    );
};

exports.uploadPicture = (profilePicUrl, userId) => {
    return db.query(
        `
        UPDATE users
        SET avatar = $1
        WHERE id = $2
        RETURNING avatar;
        `,
        [profilePicUrl, userId]
    );
};

exports.updateBio = (bioText, userId) => {
    return db.query(
        `
        UPDATE users
        SET bio = $1
        WHERE id = $2
        RETURNING bio;
        `,
        [bioText, userId]
    );
};
