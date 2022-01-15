const Song = require("../models/Song");

exports.list = async (req, res) => {
  try {
    console.log(req.query)
    const message = req.query.message;
    const songs = await Song.find({});
    res.render("songs", { songs: songs, message: message });
  } catch (e) {
    res.status(404).send({ message: "could not list songs" });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;

  try {

    await Song.findByIdAndRemove(id);
    res.redirect("/songs");
  } catch (e) {
    res.status(404).send({
      message: `could not delete  record ${id}.`,
    });
  }
};


exports.create = async (req, res) => {

  try {
    const song = new Song({ title: req.body.title, genre: req.body.genre, artist: req.body.artist, difficulty: req.body.difficulty, completion: req.body.completion });
    await song.save();
    res.redirect('/songs/?message=song has been created')
  } catch (e) {
    if (e.errors) {
      console.log(e.errors);
      res.render('create-song', { errors: e.errors })
      return;
    }
    return res.status(400).send({
      message: JSON.parse(e),
    });
  }
}

exports.edit = async (req, res) => {
  const id = req.params.id;
  try {
    const song = await Song.findById(id);
    res.render('update-song', { song: song, id: id });
  } catch (e) {
    res.status(404).send({
      message: `could find song ${id}.`,
    });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    const song = await Song.updateOne({ _id: id }, req.body);
    res.redirect('/songs/?message=song has been updated');
  } catch (e) {
    res.status(404).send({
      message: `could find taster ${id}.`,
    });
  }
};