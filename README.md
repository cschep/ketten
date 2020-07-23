# KETTEN

This is the backend that powers the baby ketten song search. On the website and in the app.

It is rails. Recently updated to 6!

It is deployed with Ansible.

More? Here we go.

## Getting started

So you want your very own karaoke songbook service? Or.. more likely it could be useful to poke around and see how things are setup, deployed, etc. You've come to the right place!

I had a few hurdles and chores when it came to the deploy so I'd like to document them and perhaps that will help someone.


### Notes to self

#### Postgres

Using an SSH tunnel to connect to the production postgres:

`ssh -L 5433:localhost:5432 deployer@bkk.schepman.org`

Migrating data from one server to another:

``

### Thanks

https://github.com/EmailThis/ansible-rails

Major thanks to https://github.com/noahgibbs/ansible-codefolio for having a working example!
