const express = require("express");
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const verifyToken = require("../middleware/verifyToken");

const login = require("../controllers/login");

const checkToken = require("../controllers/checkToken");

const getStops = require("../controllers/getStops");
const addFlight = require("../controllers/addFlight");
const removeFlight = require("../controllers/removeFlight");
const adminViewBooking = require("../controllers/adminViewBooking");

const signup = require("../controllers/signup");
const searchFlight = require("../controllers/searchFlight");
const addPassenger = require("../controllers/addPassenger");
const bookTicket = require("../controllers/bookTicket");
const userViewBooking = require("../controllers/userViewBooking");

router.post("/login", login);

router.post("/check-token", checkToken);

router.get("/get-stops", verifyToken, getStops);
router.post("/add-flight", verifyToken, addFlight);
router.post("/remove-flight", verifyToken, removeFlight);
router.get("/admin-view-booking", verifyToken, adminViewBooking);

router.post("/signup", signup);
router.get("/search-flight", verifyToken, searchFlight);
router.post("/add-passenger", verifyToken, addPassenger);
router.post("/book-ticket", verifyToken, bookTicket);
router.get("/user-view-booking", verifyToken, userViewBooking);

router.get("/", (req, res) => {
  res.send("Home page");
});

module.exports = router;
