import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "20600326",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items  ORDER BY id ASC");
    const items = result.rows;
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try {
    const result = await db.query("INSERT INTO items (title, creation_date) VALUES ($1, NOW())", [item])
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.post("/edit", async (req, res) => {
  const updatedTitle = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;
  try {
    const result = await db.query("UPDATE items SET title = $1 WHERE id=$2", [updatedTitle, id]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.post("/delete", async (req, res) => {
  const deleteId = req.body.deleteItemId;
  try{
  const result = await db.query("DELETE FROM items WHERE id = $1", [deleteId]);
  res.redirect("/");
  } catch (error){
    console.log(error);
  }
 });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
