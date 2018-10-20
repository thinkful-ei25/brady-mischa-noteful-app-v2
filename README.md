# noteful-app-v2

**Connecting Notes with Tags**
##Get all Notes

1. left join notes_tags WHERE note_id = id
2. left join tags WHERE tags.id = tag_id
3. use queryBuilder TO search for tags 
  - modify if(tagId) querybuider.
4. add hydration 

##Get note by id 

1. 


##ADD POST ! MOVE ON NOW

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

## Update a tag PUT 
1. Put request with url '/:id' and will pass the req, res, next 
2. const {name} = req.body  || name === 'new tag2'
3. knex('tags')
  .update({name: name})
  .where('id',req.params.id)
  .returning(['id', 'name'])
  .then(([result]) => res.json(result))







const updateObj = { name: req.body.name, id : req.params.id}

2. const newName = {name : req.body.name}, const id = req.params.id
3. validate input ==> !newName  new Error ('you forgot to put in a name!')
  - err.status(404)
  - return next(err)
4. knex('tags).update(newName)
    .where(id, id)



## Delete a Tag
1. Delete request with the url '/:id' and will pass the req, res, next 
2. store req.params.id in const id
3. knex('tags') where id is id and then .del()
4. res.status(204).end()
5. catch an err
