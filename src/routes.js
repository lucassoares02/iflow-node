const router = require("express").Router();
const Project = require("@controller/Project");
const ProjectString = require("@controller/ProjectString");

// Methods User
// getUsuarios.php
// router.get("/projects", Project.findAll);
// router.delete("/project/:id", Project.delete);
// router.get("/project/:id", Project.find);
// router.post("/project", Project.createOne);
// router.patch("/project/:id", Project.update);

router.get("/projects", ProjectString.findAll);
router.get("/project/:id", ProjectString.find);
router.post("/project", ProjectString.createOne);
router.patch("/project/:id", ProjectString.update);
router.delete("/project/:id", Project.delete);


module.exports = router;
