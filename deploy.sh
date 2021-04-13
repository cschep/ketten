# you're gonna need this:
# ansible-galaxy install ansistrano.deploy ansistrano.rollback
cd ansible; ansible-playbook -i inventories/production.ini deploy.yml
