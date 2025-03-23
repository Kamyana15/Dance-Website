const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 80;

// Database Connection
mongoose.connect("mongodb://localhost/contactDance", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("MongoDB connected successfully!"))
    .catch(err => console.error("MongoDB connection error:", err));

// Define Schema
const contactSchema = new mongoose.Schema({
    name: String,
    age: Number, 
    phone: String,
    email: String,
    address: String,
});

const Contact = mongoose.model("Contact", contactSchema);

// Middleware
app.use("/static", express.static("static"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.get("/", (req, res) => {
    res.status(200).render("home", { script: '', style: '/static/style.css' });
});

app.get("/contact", (req, res) => {
    res.status(200).render("contact", { script: '', style: '/static/styleContact.css' });
});

app.post("/contact", async (req, res) => {
    try {
        console.log("Received form data:", req.body); // Log the received data

        const myData = new Contact(req.body);
        await myData.save();
        console.log("Data saved successfully:", myData); // Log the saved data
        res.send("Form submitted successfully!");
    } catch (err) {
        console.error("Error saving data:", err.message); // Log the error message
        res.status(400).send("Error saving data");
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});