require './globalize'
fs = require 'fs'
{resolve} = require 'path'
{db} = require lib + 'db'

query = (sql) ->
  db.query sql
    .then (data) -> console.log "Result: #{data}"
    .then null, (err) -> throw err if err

raw = (file) -> fs.access file, fs.constants.R_OK, (err) ->
  throw err if err
  fs.readFile file, encoding: 'utf8', (err, data) ->
    throw err if err
    console.log "Applying migration..."
    query data

migrate = (action = 'up', table, fields) -> switch action
  when 'up' or 'create'
    sql = "create table if not exists #{table} ("
    sql += "#{field}," for field in fields[..-1]
    sql += fields[-1..] #last field without comma
    sql += ");"
    query sql
  when 'down' or 'drop'
    sql = "drop table #{table}"
    query sql
  #when 'seed' or 'fixture'
  #TODO: allow insert seed

scaffold = (name, type = 'cson') ->
  file = "#{migrations}#{name}.#{type}"
  save = -> fs.writeFile file, data, (err) ->
    throw err if err
    console.log "New migration: #{name}.#{type}"
  obj =
    table: name
    fields: [
      'id int(11) not null default primary key'
    ]
  data = CSON.stringify obj, null, '  '
  question = "Migration #{name} exists, overwrite? [y/n]: "
  fs.access file, fs.F_OK, (err) -> # check if exists
    #wait = yes
    if err then save()
    else
      readline = require 'readline'
      rl = readline.createInterface
        input: process.stdin, output: process.stdout
      rl.question question, (ans) ->
        test = /^(y|Y)(es|ES)?$/.test ans.trim()
        if test then save() #wait = no
        else
          console.log 'Okay! :-)'
          process.exit 0
        rl.close()
    #while not wait then save()

ext = '.sql'
migration = migrations + process.argv[2]
file = migration + ext

if /^(create|generate|scaffold)$/.test process.argv[2]
  scaffold process.argv[3]
else fs.access file, fs.F_OK, (err) ->
  if not err then raw file
  else
    #file = file.replace /\.sql$/, ''
    {action, table, fields} = require migration# + '.coffee'
    action or= process.argv[3]

    # Throw exception if migration doesn't have props
    if not table?
      err = new Error 'Undefined .table'
    else if not fields?
      err = new Error 'Undefined .fields'
    else if not fields?
      err = new Error 'Undefined action, must be up or down'

    if err?
      console.error err
      #process.exit 1
    else
      migrate action, table, fields
