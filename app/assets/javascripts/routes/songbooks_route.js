Ketten.SongbooksRoute = Ember.Route.extend({
  model: function() {
    return Ketten.Songbook.find();
  }
});
