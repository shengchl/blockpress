# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

Sub.create(name: 'general', description: 'General discussion and sharing', uid: SecureRandom.uuid)
Sub.create(name: 'bitcoin', description: 'Share and discuss all things related to bitcoin',  uid: SecureRandom.uuid)
Sub.create(name: 'crypto', description: 'Share and discuss cryptocurrency ideas and news',  uid: SecureRandom.uuid)
Sub.create(name: 'art', description: 'Share and discuss art of all shapes and forms', uid: SecureRandom.uuid)
Sub.create(name: 'news', description: 'Share and discuss recent newsworthy events', uid: SecureRandom.uuid)
Sub.create(name: 'fiction', description: 'Share and discuss the latest in the realm of fiction and storytelling', uid: SecureRandom.uuid)
Sub.create(name: 'science', description: 'Share and discuss all things science and wonders of the world', uid: SecureRandom.uuid)
Sub.create(name: 'design', description: 'Share and discuss design ideas and inspirations', uid: SecureRandom.uuid)
Sub.create(name: 'photos', description: 'Share amazing and beautiful photography from all over the world', uid: SecureRandom.uuid)
Sub.create(name: 'music', description: 'Share and discuss what\'s happening in the world of music', uid: SecureRandom.uuid)
Sub.create(name: 'nsfw', description: 'Share the naughty bits (behave yourselves)', uid: SecureRandom.uuid)
Sub.create(name: 'funny', description: 'Share the best jokes, stories, and comedy routines',uid: SecureRandom.uuid)
