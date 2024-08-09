const appDb = db.getSiblingDB("app");
//appDb.createCollection('users');
appDb.users.insertOne({
  username: "root",
  password: "$2b$10$As3m.mkxjLiwQc4GTOcteu/65UxlXp.MnCQlKYthzFszGy19Kc3Tq",
  email: "root@change.me",
});
// default user root with password changeme
console.log("mongo-init.js: init root user!");
