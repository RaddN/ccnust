const User = require("../models/userModel");
const jsonwebtoken = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const registerUser = async (req, res) => {
  // const { email, password, name, phone, bio, photo } = req.body;
  User.findOne({ email: req.body.email } || { email: req.body.phone }).then(
    (data) => {
      if (!data) {
        if (
          !req.body.email ||
          !req.body.name ||
          !req.body.password ||
          !req.body.phone
        )
          res.send("Enter required value correctly");
        else {
          const createUser = User(req.body);
          createUser.save().then(() => {
            var storedEmail = req.body.email;
            const token = jsonwebtoken.sign(
              { storedEmail },
              process.env.JSONWEBTOKEN_SECRET
              // {
              //   expiresIn: "1D",
              // }
            );
            //send cookie to client site
            res
              .cookie(
                "token",
                token
                // {
                // path: "/",
                // httpOnly: true,
                // expires: Date(Date.now() + 1000 * 86400), // 1 day
                // sameSite: "none",
                // secure: true,
                // }
              )
              .json({ alert: `Successfully Register` });
          });
        }
      } else res.json({ alert: "User exists" });
    }
  );
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  //validate information
  if (!email || !password) {
    res.json({ alert: "Put email and password" });
  } else {
    //check email isRag or Not
    User.findOne({ email: email } || { phone: email }).then(async (data) => {
      if (!data) {
        res.json({ alert: "Email address not found please sign up" });
      } else {
        //check password is correct or not
        const isPasswordCorrect = await bcrypt.compare(password, data.password);
        if (isPasswordCorrect) {
          const token = jsonwebtoken.sign(
            { email },
            process.env.JSONWEBTOKEN_SECRET
            // {
            //   expiresIn: "1D",
            // }
          );
          //send cookie to client site
          res
            .cookie("token", token, {
              path: "/",
              httpOnly: true,
              maxAge: 24 * 60 * 60 * 1000, //24 hours
              sameSite: "none",
              // secure: true,
            })
            .json({ alert: "Successfully logged in", token: token });
        } else {
          res.json({ alert: `Wrong Password` });
        }
      }
    });
  }
};

const GetUserData = (req, res) => {
  const myCookie = req.cookies.token || req.body.token;
  if (!myCookie) res.json({ alert: "Please login first" });
  else {
    const cookieTokenToData = jsonwebtoken.verify(
      myCookie,
      process.env.JSONWEBTOKEN_SECRET
    ); //It will give me email address and iat number(expires time).
    User.findOne(
      { email: cookieTokenToData.email } || { phone: cookieTokenToData.phone }
    ).then((data) => {
      if (!data) {
        res.send("User not found");
      } else {
        res.send(data);
      }
    });
  }
};
const Getbuslocations = (req, res) => {
  const myCookie = req.cookies.token || req.body.token;
  if (!myCookie) res.json({ alert: "Please login first" });
  else {
    const cookieTokenToData = jsonwebtoken.verify(
      myCookie,
      process.env.JSONWEBTOKEN_SECRET
    ); //It will give me email address and iat number(expires time).
    User.find()
      .where("catagory")
      .all(["driver"])
      .then((data) => {
        if (!data) {
          res.send("User not found");
        } else {
          res.send(data);
        }
      });
  }
};
const updateLocation = (req, res) => {
  const myCookie = req.cookies.token || req.body.token;
  const cookieTokenToData = jsonwebtoken.verify(
    myCookie,
    process.env.JSONWEBTOKEN_SECRET
  );
  if (!myCookie) res.json({ alert: "Please login first" });
  else {
    User.updateOne(
      { email: cookieTokenToData.email },
      {
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        lastupdatetime: req.body.lastupdatetime,
      }
    ).then(() => res.json({ alert: "location changed" }));
  }
};

const Logout = (req, res) => {
  res
    .cookie("token", "", {
      path: "/",
      httpOnly: true,
      maxAge: 0,
      sameSite: "none",
      // secure: true,
    })
    .send(`Successfully logged Out`);
};

module.exports = {
  registerUser,
  loginUser,
  Logout,
  GetUserData,
  updateLocation,
  Getbuslocations,
};
