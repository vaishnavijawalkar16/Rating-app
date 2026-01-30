import bcrypt from "bcrypt";
import db from "./db.js";

const defaultAdmin = {
  name: "Admin1",
  email: "admin1@example.com",
  password: "Admin@123!",
  address: "Head Office 2"
};

bcrypt.hash(defaultAdmin.password, 10, (err, hash) => {
  if (err) throw err;
  db.query(
    "INSERT IGNORE INTO users (name,email,password,address,role) VALUES (?,?,?,?,?)",
    [defaultAdmin.name, defaultAdmin.email, hash, defaultAdmin.address, "ADMIN"],
    (err) => {
      if (err) console.log(err);
      else console.log("Default admin created");
    }
  );
});
