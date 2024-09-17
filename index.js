const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const tmodel = require("./model");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/getdb", async (req, res) => {
  try {
    const result = await tmodel.find({});
    console.log(result);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error", error: error.message });
  }
});

app.post("/postdb", async (req, res) => {
  try {
    const t = req.body.t;
    const newData = {
      t: t,
    };
    const data = await tmodel.create(newData);
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error", error: error.message });
  }
});

app.delete("/deletedb", async (req, res) => {
  try {
    const itemsToDelete = req.body;
    if (!Array.isArray(itemsToDelete) || itemsToDelete.length === 0) {
      return res
        .status(400)
        .send({ message: "No items provided for deletion" });
    }
    const deletionResult = await tmodel.deleteMany({
      _id: { $in: itemsToDelete },
    });
    res.send({ success: true, deletedCount: deletionResult.deletedCount });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error", error: error.message });
  }
});

app.put("/updatedb", async (req, res) => {
  try {
    const updates = req.body;
    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).send({ message: "Invalid data for update" });
    }
    const updatePromises = updates.map((item) =>
      tmodel.updateOne({ _id: item._id }, { t: item.t })
    );
    const results = await Promise.all(updatePromises);
    res.send({ success: true, results });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error", error: error.message });
  }
});

app.delete("/deleteall", async (req, res) => {
  try {
    const deletionResult = await tmodel.deleteMany({});
    res.send({ success: true, deletedCount: deletionResult.deletedCount });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error", error: error.message });
  }
});

mongoose
  .connect(
    "mongodb+srv://oghogare89:AtyUb8joWIsZxG54@demo.oakzb.mongodb.net/?retryWrites=true&w=majority&appName=DEMO",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen(5000, () => {
      console.log("Server running on port 5000 and connected to MongoDB");
    });
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message);
  });
