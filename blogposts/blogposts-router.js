const router = require("express").Router();

const Blogs = require("../data/db.js");

router.get("/", (req, res) => {
  Blogs.find(req.query)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "The posts information could not be retrieved.",
      });
    });
});

router.get("/:id", (req, res) => {
  Blogs.findById(req.params.id)
    .then((posts) => {
      if (posts) {
        res.status(200).json(posts);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "The post information could not be retrieved.",
      });
    });
});

router.get("/:id/comments", (req, res) => {
  Blogs.findCommentById(req.params.id)
    .then((comment) => {
      if (comment === undefined || comment.length === 0) {
        res.status(404).json({
          message: "The post with the specified ID does not exist.",
        });
      } else {
        res.status(200).json(comment);
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "The comments information could not be retrieved.",
      });
    });
});

router.post("/", (req, res) => {
  const NewPost = req.body;

  Blogs.insert(NewPost)
    .then((post) => {
      if (
        NewPost.title === undefined ||
        NewPost.contents === undefined ||
        NewPost.title === "" ||
        NewPost.contents === ""
      ) {
        res
          .status(400)
          .json({ Error: "Please provide title and contents for the post." });
      } else if (!NewPost) {
        res.status(500).json({
          Error: "There was an error while saving the post to the database",
        });
      } else {
        res.status(201).json(post);
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error adding the post",
      });
    });
});

router.post("/:id/comments", (req, res) => {
  const text = req.body.text;
  const post_id = req.params.id;

  if (!text) {
    res
      .status(400)
      .json({ errorMessage: "Please provide text for the comment." });
  }
  Blogs.insertComment({ post_id, text })
    .then(({ id: comment_id }) => {
      Blogs.findCommentById(comment_id).then(([comment]) => {
        if (comment) {
          res.status(200).json(comment);
        } else {
          res.status(404).json({
            message: "The post with the specified ID does not exist.",
          });
        }
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: "There was an error while saving the comment to the database",
      });
    });
});

router.delete("/:id", (req, res) => {
  Blogs.remove(req.params.id)
    .then((posts) => {
      console.log(posts);
      if (posts) {
        res.status(200).json(posts);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "The post could not be removed.",
      });
    });
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const post = req.body;
  Blogs.update(id, post)
    .then((posts) => {
      if (posts === undefined || posts.length === 0 || !posts) {
        res.status(404).json({
          message: "The post with the specified ID does not exist.",
        });
      } else if (
        post.title === undefined ||
        post.title === "" ||
        post.contents === undefined ||
        post.contents === ""
      ) {
        res.status(400).json({
          error: "Please provide title and contents for the post.",
        });
      } else {
        res.status(200).json(posts);
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "Please provide title and contents for the post.",
      });
    });
});

module.exports = router;

// PostWComment.text === undefined || PostWComment.text === "") {
//                 res.status(400).json({ error: "Please provide text for the comment." }

//   Blogs.findPostComments(id)
//     .then((comment) => {
//       const [commentArray] = comment;

//       if (commentArray) {
//         if (PostWComment.text && typeof PostWComment.text === "string") {
//           Blogs.insertComment(PostWComment)
//             .then((newId) => {
//               const NewCommentId = newId.id;
//               return NewCommentId;
//             })
//             .then((NewCommentId) => {
//               Blogs.findCommentById(NewCommentId)
//                 .then((comment) => {
//                   res.status(201).json(comment);
//                 })
//                 .catch((err) => {
//                   console.log(err);
//                   res.status(201).json({
//                     error: "Couldn't find comment",
//                   });
//                 });
//             })
//             .catch((err) => {
//               console.log(err);
//               res.status(500).json({
//                 error:
//                   "There was an error while saving the comment to the database",
//               });
//             });
//         } else {
//           res.status(400).json({
//             message: "Please provide text for the comment.",
//           });
//         }
//       } else {
//         res.status(404).json({
//           message: "The post with the specified ID does not exist.",
//         });
//       }
//     })
//     .catch((error) => {
//       console.log(error);
//       res.status(500).json({
//         message: "Error retrieving the posts.",
//       });
//     });
