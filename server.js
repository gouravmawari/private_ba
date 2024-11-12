    const mongoose = require("mongoose");
    const express = require("express");
    const app = express();
    const rateLimit = require("express-rate-limit");
    const helmet = require('helmet');
    const cors = require("cors"); 
    const { body, validationResult } = require('express-validator');
    const DB = require("./model");
    app.use(express.json());
    app.use(helmet());
    app.use(cors());

    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100
    });
    app.use(limiter);

    const postValidationRules = [
        body('Text').trim().notEmpty(),
    ];
    const validatePost = (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        return res.status(400).json({ errors: errors.array() });
    }

    app.post("/post", postValidationRules, validatePost, async (req, res) => {
        const { Text } = req.body;
        const number = Math.floor(Math.random() * (999999 - 99999 + 1)) + 99999;
        try {
            const user = new DB({ Text, number });
            await user.save();
            setTimeout(async function () {
                await DB.findOneAndDelete({ number });
            }, 600000)
            console.log(user.number);
            return res.status(200).json(user.number);
        }
        catch (error) {
            console.log(error);
            return res.status(400).json(error);
        }
    })

    app.get("/get", async (req, res) => {
        const { number } = req.query;
        if (isNaN(number)) {
            console.log("Invalid number");
            return res.status(400).json({ message: "Number is invalid" });
        }
    
        try {
            const find = await DB.findOne({ number });
            if (!find) {
                console.log("Wrong number");
                return res.status(404).json({ message: "Number is incorrect" });
            }
            console.log("Text sent");
            res.status(200).json(find.Text);
            await DB.findOneAndDelete({ number });
        } catch (error) {
            console.log(error);
            return res.status(400).json(error);
        }
    });

    const dbURI =  "mongodb+srv://guddu:guddu@cluster1.ved7bni.mongodb.net/yes?retryWrites=true&w=majority";
    mongoose.connect(dbURI ,{useNewUrlParser : true , useUnifiedTopology: true})
    .then((result)=>{const PORT = process.env.PORT || 8888;
        app.listen(PORT, ()=>{
            console.log("server is created")
        })})
    .catch((err)=>console.log(err))  