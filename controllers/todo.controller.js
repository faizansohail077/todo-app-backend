const { ObjectID } = require('bson')

const { todoSchema, boardSchema } = require('../model')

exports.getTodos = async (req, res) => {
    try {
        const getTodo = await todoSchema.find({})
        res.send(getTodo)
    } catch (e) {
        res.status(400).send({ failure: true, message: e.message })
    }
}

exports.getTodo = async (req, res) => {
    let { n } = req.params
    let userId = req.userId
    try {

        const getTodo = await todoSchema.aggregate([{ $match: { userId: ObjectID(req.userId), title: "tod2" } }, {
            $facet: {
                metadata: [
                    {
                        $group: {
                            _id: null,
                            total: { $sum: 1 }
                        }
                    },
                ],
                data: [
                    { $skip: Number(n) },
                    { $limit: 1 },
                ]
            }
        }])
        res.send(getTodo)
    } catch (e) {
        res.status(400).send({ failure: true, message: e.message })
    }
}

exports.getTodoById = async (req, res) => {
    try {
        const getTodo = await todoSchema.findById({ _id: req.params.id })
        res.send(getTodo)
    } catch (e) {
        res.send({ failure: true, message: e.message })
    }
}

exports.addTodo = async (req, res) => {
    const { title, description, importance, isCompleted, boardId } = req.body
    let userId = req.userId
    if (!title || !description || !importance) {
        return res.status(411).send({ failure: true, message: "fields are required" })
    }
    else {
        try {
            const postTodo = new todoSchema({ title, description, importance, isCompleted, userId })
            postTodo.save().then(async (data) => {
                const updateTodo = await boardSchema.findOneAndUpdate({ _id: boardId }, {
                    '$push': { todos: data._id }
                }, { new: true })
                res.send(data)
            })
        } catch (e) {
            res.status(406).send({ failure: true, message: e.message })
        }
    }
}

exports.updateById = async (req, res) => {
    let userId = req.userId
    const { title, description, importance, isCompleted } = req.body
    if (!title || !description || !importance) {
        return res.status(411).send({ failure: true, message: "fields are required" })
    }
    try {
        const findTodo = await todoSchema.findOne({ userId, _id: req.params.id })
        if (!findTodo) {
            return res.status(404).send({ failure: true, message: "user not found" })
        }
        const updateTodo = await todoSchema.findByIdAndUpdate({ _id: req.params.id }, {
            title, description, importance, isCompleted
        }, { new: true })
        res.send(updateTodo)
    }
    catch (e) {
        res.status(406).send({ failure: true, message: e.message })
    }
}

exports.deleteById = async (req, res) => {
    try {
        const deleteTodo = await todoSchema.findByIdAndDelete({ _id: req.params.id })
        const updateTodo = await boardSchema.update({ _id: req.params.boardId }, {
            '$pull': { todos: req.params.id }
        })
        res.send(deleteTodo)
    } catch (e) {
        res.status(400).send({ failure: true, message: e.message })
    }
}
