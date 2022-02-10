// Create express app
var express = require("express");
var app = express();
var db = require('./database');
var bodyParser = require("body-parser");

// Server port
var HTTP_PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.setHeader("Content-Type", "application/json");
    next();
});

// Start server
app.listen(HTTP_PORT, function () {
    console.log("Server is runing in port %PORT%...".replace("%PORT%", HTTP_PORT));
});


// Root endpoint
app.get("/", function (req, res, next) {
    res.status(200).json({ "message": "ok" });
});

// Get all employees
app.get("/employees", function (req, res, next) {
    var sql = "select * from employees";
    var params = [];
    db.all(sql, params, function (err, rows) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

// Get a single employee
app.get("/employees/:id", function (req, res, next) {
    var sql = "select * from employees where id = ?";
    var params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": row
        });
    });

});

// Update a single employee
app.patch("/employees/:id", function (req, res, next) {
    // console.error(req.body);
    // console.error(req.params);
    // next();
    // return;
    var data = {
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        active: req.body.active
    };
    db.run(`UPDATE employees SET
        fname = COALESCE(?, fname),
        lname = COALESCE(?, lname),
        email = COALESCE(?, email),
        active = COALESCE(?, active)
        WHERE id = ?`,
        [data.fname, data.lname, data.email, data.active, req.params.id],
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            });
        });
});

// Create a single employee
app.post("/employees", function (req, res, next) {
    var errors = [];
    if (!req.body.fname)
        errors.push("No fname specified.");
    if (!req.body.lname)
        errors.push("No lname specified.");

    if (errors.length) {
        res.status(400).json({ "error": errors.join(",") });
        return;
    }
    var data = {
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        active: req.body.active
    };
    var sql = "INSERT INTO employees (fname, lname, email, active) VALUES (?, ?, ?, ?)";
    var params = [data.fname, data.lname, data.email, data.active];
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id": this.lastID
        });
    });
});

// Remove a single employee
app.delete("/employees/:id", function (req, res, next) {
    console.info(`Deleting the employee ${req.params.id}...`);
    db.run('DELETE FROM employees WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "deleted",
                "changes": this.changes
            });
        }
    );
});