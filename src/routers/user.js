const express = require("express");
const { route } = require("express/lib/application");
const router = new express.Router();
require("../db/mongoose");
const User = require("../model/user");
const auth = require("../middleware/auth");
const sharp = require("sharp");
const multer = require("multer");
const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg|JPG|JPEG|PNG)$/)) {
      return cb(new Error("Avatar should be an image file"));
    }
    cb(undefined, true);
  },
});

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  const user2 = await User.findOne({ email: req.body.email });
  if (user2) {
    return res.status(404).send("Email already in use!");
  }
  try {
    await user.save();
    const token = await user.genauthToken();

    res.status(200).send({ user: user.getPublicProfile(user), token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.genauthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(404).send(e);
  }
});
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, hieght: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.status(200).send();
  },
  (err, req, res, next) => {
    res.status(400).send({ Error: err.message });
  }
);

router.delete(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.status(200).send();
  },
  (err, req, res, next) => {
    res.status(400).send({ Error: err.message });
  }
);
router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(400).send("Error");
  }
});
router.post("/users/logoutall", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return 0;
    });
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(400).send("Error");
  }
});

router.patch("/users/me", auth, async (req, res) => {
  const update = Object.keys(req.body);
  const allowedupdate = ["name", "email", "password", "age"];
  const isvalid = update.every((upd) => allowedupdate.includes(upd));
  if (!isvalid) {
    return res.status(404).send("Invalid Update");
  }
  try {
    const user = req.user;
    update.forEach((upd) => {
      user[upd] = req.body[upd];
    });
    await user.save();

    res.status(200).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});
router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.status(200).send("Deleted Successfully");
  } catch (e) {
    res.status(404).send(e);
  }
});
module.exports = router;
