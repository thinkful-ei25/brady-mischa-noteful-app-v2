# noteful-app-v2

**DB**

//--DB --- // add tags table AND add junction table notes_tags // -- tags has id AND name // -- notes_tags has two columns ==> tags_id AND notes_id

--tags router-- // create routes/tags.js -- set up -- express -- router = express.Router() -- knex --export.modules = router

--update server.js -- -- initialize tagRouter -- mount tagRouter (app.use)

in tags.js --> -- implement CRUD operations -- get, get id, post, put id, delete id

## Get Tags

1. The url will be '/' and we will pass the req, res, next forward.
2. Build a query with Knex:

- From tags
- select ()
- pass the result forward

3. .then > that if there is a result we => res.json(result) else => next()
4. catch an err (next(err))

## Get Tags by Id

1. get request with the url '/:id' and we will pass the req, res, next/
2. Need to access the req id and set it to id. const id = req.params.id
3. Build the query with Knex:
   -From 'tags'
   -select()
   -where 'id',id param
4. .then > that if there is a result we => res.json(result) else => next()
5. catch an err (next(err))

## Post/Create a Tag

1. Post request with the url '/' and we will pass the req, res, next
   1.5 Check if the name exists. If it doesn't then throw new Error ('missing)
   -err.status(400)
   -return next\*errr
2. Need to create a new object with the tag name
3. Knex ('tags)

- .insert(new object)
- .return the id of the newly inserted tag.
- .then if there is a result( aka an id) then res.location(req.url/ID).status(201).json(new object)
  - res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);

4. catch an err
