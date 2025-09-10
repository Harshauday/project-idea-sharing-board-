const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const User = require("../models/User");
const auth = require("../middleware/auth")();

// create project
router.post("/", auth, async (req, res) => {
  try {
    const data = req.body;
    data.author = req.user.id;
    const p = await Project.create(data);
    // increment user points
    await User.findByIdAndUpdate(req.user.id, { $inc: { points: 10 } });
    res.json(p);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server" });
  }
});

// get recent projects
router.get("/recent", async (req, res) => {
  try {
    const projects = await Project.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("author", "name"); // Fetch 10 most recent projects
    res.json(projects);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server" });
  }
});

// get projects with basic search & filters
router.get("/", async (req, res) => {
  try {
    const { q, tag, tech, category, page = 1, limit = 12 } = req.query;
    const filter = {};
    if (tag) filter.tags = tag;
    if (tech) filter.techStack = tech;
    if (category) filter.category = category;
    if (q)
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { shortDesc: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
      ];
    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("author", "name")
      .select("+domain +moreInfo");
    res.json(projects);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server" });
  }
});

// like/unlike
router.post("/:id/like", auth, async (req, res) => {
  try {
    const p = await Project.findById(req.params.id);
    if (!p) return res.status(404).json({ error: "not found" });
    const idx = p.likes.findIndex((x) => x.toString() === req.user.id);
    if (idx === -1) {
      p.likes.push(req.user.id);
      await p.save();
      return res.json({ liked: true });
    }
    p.likes.splice(idx, 1);
    await p.save();
    res.json({ liked: false });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server" });
  }
});

// follow
router.post("/:id/follow", auth, async (req, res) => {
  try {
    const p = await Project.findById(req.params.id);
    if (!p) return res.status(404).json({ error: "not found" });
    const idx = p.followers.findIndex((x) => x.toString() === req.user.id);
    if (idx === -1) {
      p.followers.push(req.user.id);
      await p.save();
      return res.json({ following: true });
    }
    p.followers.splice(idx, 1);
    await p.save();
    res.json({ following: false });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server" });
  }
});

// comment
router.post("/:id/comment", auth, async (req, res) => {
  try {
    const { text } = req.body;
    const p = await Project.findById(req.params.id);
    if (!p) return res.status(404).json({ error: "not found" });
    p.comments.push({ user: req.user.id, text });
    await p.save();
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server" });
  }
});

// add version
router.post("/:id/version", auth, async (req, res) => {
  try {
    const { versionName, changelog, assets } = req.body;
    const p = await Project.findById(req.params.id);
    if (!p) return res.status(404).json({ error: "not found" });
    p.versions.push({ versionName, changelog, assets });
    await p.save();
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server" });
  }
});

// get projects by user id
router.get("/user/:userId", async (req, res) => {
  try {
    const projects = await Project.find({ author: req.params.userId })
      .sort({ createdAt: -1 })
      .populate("author", "name");
    res.json(projects);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server" });
  }
});

// detail
router.get("/:id", async (req, res) => {
  try {
    const p = await Project.findById(req.params.id).populate(
      "author",
      "name skills"
    );
    if (!p) return res.status(404).json({ error: "not found" });
    p.views = (p.views || 0) + 1;
    await p.save();
    res.json(p);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server" });
  }
});

// delete project
router.delete("/:id", auth, async (req, res) => {
  try {
    console.log(`Attempting to delete project with ID: ${req.params.id}`);
    const p = await Project.findById(req.params.id);
    if (!p) {
      console.log(`Project with ID: ${req.params.id} not found.`);
      return res.status(404).json({ error: "not found" });
    }
    console.log(
      `Project found. Author: ${p.author.toString()}, User: ${req.user.id}`
    );
    if (p.author.toString() !== req.user.id) {
      console.log(
        `Unauthorized attempt to delete project ${req.params.id} by user ${req.user.id}.`
      );
      return res.status(403).json({ error: "unauthorized" });
    }
    await p.deleteOne();
    console.log(`Project ${req.params.id} deleted successfully.`);
    res.json({ ok: true });
  } catch (e) {
    console.error(`Error deleting project ${req.params.id}:`, e);
    res.status(500).json({ error: "server" });
  }
});

// search projects
router.get("/search", async (req, res) => {
  console.log("Search route hit!"); // DEBUG
  try {
    const searchTerm = req.query.term;

    if (!searchTerm) {
      return res.status(400).json({ message: "Search term cannot be empty" });
    }

    let authorIds = [];
    if (searchTerm) {
      // Only attempt to search by ObjectId if the searchTerm is a valid ObjectId format
      if (mongoose.Types.ObjectId.isValid(searchTerm)) {
        console.log("Attempting to find user by ObjectId:", searchTerm); // DEBUG
        const userById = await User.findById(searchTerm);
        if (userById) {
          authorIds.push(userById._id);
          console.log("Found user by ObjectId, authorIds:", authorIds); // DEBUG
        }
      }
      // Always search by username for string terms
      console.log("Attempting to find users by username regex:", searchTerm); // DEBUG
      const usersByUsername = await User.find({
        username: { $regex: searchTerm, $options: "i" },
      });
      authorIds = authorIds.concat(usersByUsername.map((user) => user._id));
      console.log("Found users by username, authorIds:", authorIds); // DEBUG
    }

    console.log("Final authorIds before query:", authorIds, "Type:", typeof authorIds, "Array length:", authorIds.length); // DEBUG

    const query = {
      $or: [
        { title: { $regex: searchTerm, $options: "i" } },
        { shortDesc: { $regex: searchTerm, $options: "i" } },
        { domain: { $regex: searchTerm, $options: "i" } },
      ],
    };

    if (authorIds.length > 0) {
      query.$or.push({ author: { $in: authorIds } });
      console.log("Query with authorIds:", JSON.stringify(query, null, 2)); // DEBUG
    } else {
      console.log("Query without authorIds (no author filter applied):", JSON.stringify(query, null, 2)); // DEBUG
    }
    console.log("Type of authorIds elements:", authorIds.map(id => typeof id)); // DEBUG
    console.log("Sample authorId:", authorIds[0], "Is ObjectId:", mongoose.Types.ObjectId.isValid(authorIds[0])); // DEBUG (if authorIds is not empty)


    const projects = await Project.find(query)
      .populate("author", "username")
      .sort({ createdAt: -1 }); // Sort by creation date, newest first

    res.json(projects);
  } catch (error) {
    console.error("Search route error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = router;
