Ketten.Songbook = DS.Model.extend({
  name: DS.attr('string'),
  createdAt: DS.attr('date')
});

Ketten.Songbook.FIXTURES = [{
  id: 1,
  name: 'Awesome songbook',
  createdAt: new Date('12-27-2012')
}, {
  id: 2,
  name: 'Radical songbook',
  createdAt: new Date('3-3-2013')
}];
