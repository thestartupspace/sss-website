exclude_tasks = [:start, :restart, :stop, :cold, :migrate, :migrations, :upload, :finalize_update]

exclude_tasks.each do |name|
  deploy.task name do
  
  end
end

deploy.pending.task :default do

end

deploy.pending.task :diff do

end
