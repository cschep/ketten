# KETTEN

This is the backend that powers the baby ketten song search. On the website and in the app. Written in Rails, recently updated to 6.

## Ansible

So you want your very own karaoke songbook service? Or.. more likely it could be useful to poke around and see how things are setup, deployed, etc. Either way, you've come to the right place! There is a long version of this [here](https://schepman.org/2020/07/30/putting-rails-into-production-with-ansible) if you're interested.

Here are the step-by-step instructions to use this Ansible setup to deploy this (or your) Rails app.

#### Step 0.

Install Ansible, copy the `ansible` folder from this repo to wherever you want. Put it at the root of your project. Put it somewhere else. Leave it where it is. I really don't mind.

#### Step 1.

Open `app-vars.yml` and update the settings for your App. The name, the git repo, node version, ssl, etc. Poke around and see what looks good.

#### Step 2.

Open `provision.yml` and make sure the roles you need are active. For instance, this app doesn't use Redis so it's commented out by default.

#### Step 3.

Create a vault with some secrets in it!

 There are two we need. The Rails master key and the postgresql password. If you have `vault_password_file` set in `ansible.cfg` it will use the contents of that file as your key. The `ansible.cfg` included with this project has it set. If you don't have that set you will be asked to specify a password when creating or editing the vault.

`ansible-vault create group_vars/all/vault.yml`

Then toss in the required secrets. I generated a strong password with 1Password, made a secure note to store it, then tossed it in the vault. Your file should look something like this:

```
vault_postgresql_db_password: "AStrongPasswordYouGeneratedRandomlyRight?"
vault_rails_master_key: "The string from the master.key file you definitely didn't check into source control, right?"
```

If you didn't nail it the first time you can edit it like so.

`ansible-vault edit group_vars/all/vault.yml`

#### Step 4.

Provision a Linux machine somewhere somehow. I love [Linode](https://linode.com). Get its IP address, and copy it in `inventories/preprovision.ini` and `inventories/production.ini`.

#### Step 5.

You don't NEED to have a separate preprovion step but I like it because it lets you run specify root as the user for this, but then use the deploy user for the actual provisioning.

From the ansible directory, run `ansible-playbook -i inventories/preprovision.ini preprovision.yml`

#### Step 6.

From the ansible directory, run `ansible-playbook -i inventories/production.ini provision.yml`

#### Step 7.

The final, and repeatable step is to deploy.

From the ansible directory, run `ansible-playbook -i inventories/production.ini deploy.yml`


Now you have a box with

### Thanks

Major thanks to https://github.com/EmailThis/ansible-rails for getting me pointed in the right direction and https://github.com/noahgibbs/ansible-codefolio for having a fork with a working example!
