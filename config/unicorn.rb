# root = "/home/deployer/apps/ketten/current"
# pid "/home/cschep/code/ruby/ketten/tmp/pids/unicorn.pid"
# stderr_path "/home/cschep/code/ruby/ketten/unicorn/unicorn.log"
# stdout_path "/home/cschep/code/ruby/ketten/unicorn/unicorn.log"

# listen "/tmp/unicorn.todo.sock"
# worker_processes 2
# timeout 30

root = "/home/deployer/apps/ketten/current"
working_directory root
pid "#{root}/tmp/pids/unicorn.pid"
stderr_path "#{root}/log/unicorn.log"
stdout_path "#{root}/log/unicorn.log"

listen "/tmp/unicorn.ketten.sock"
worker_processes 2
timeout 30
