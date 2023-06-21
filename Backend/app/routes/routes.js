const express = require("express");
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const login = require("../controllers/login");

const addFlight = require("../controllers/addFlight");
const removeFlight = require("../controllers/removeFlight");
const adminViewBooking = require("../controllers/adminViewBooking");

const signup = require("../controllers/signup");
const searchFlight = require("../controllers/searchFlight");
const addPassenger = require("../controllers/addPassenger");
const bookTicket = require("../controllers/bookTicket");
const userViewBooking = require("../controllers/userViewBooking");


router.get("/login", login);

router.post("/add-flight", addFlight);
router.delete("/remove-flight", removeFlight);
router.get("/admin-view-booking", adminViewBooking);

router.post("/signup", signup);
router.get("/search-flight", searchFlight);
router.post("/add-passenger", addPassenger);
router.post("/book-ticket", bookTicket);
router.get("/user-view-booking", userViewBooking);

router.get("/", (req, res) => {
    res.send("Home page");
})

module.exports = router;