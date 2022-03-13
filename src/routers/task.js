const express = require("express");
const router = new express.Router();
require("../db/mongoose");
const Task = require("../model/task");
const auth = require("../middleware/auth");
router.post("/tasks",auth, async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            owner:req.user._id
        });
        const saved = await task.save();
        res.status(200).send(saved);
    } catch (e) {
        res.status(400).send(e);
    }
});

//sorted ,paginated data tasks
router.get("/tasks",auth, async (req, res) => {
    const match ={}
    const sort={}
    if(req.query.completed){
        match.completed=(req.query.completed==='true')
    }
    if(req.query.sortBy){
        const parts=req.query.sortBy.split(':');
        sort[parts[0]]=(parts[0]=='desc')?-1:1;
      
    }
    try {
        await req.user.populate({
            path:'tasks',
           match,
           options:{
               limit:parseInt(req.query.limit),
               skip:parseInt(req.query.skip),
                sort,
           }
        }).execPopulate();
        res.status(200).send(req.user.tasks);
    } catch (e) {
        res.status(400).send(e);
    }
});
router.get("/tasks/:id",auth, async (req, res) => {
    try {
        const _id = req.params.id;
        const task = await Task.findOne({_id,owner:req.user._id});
        console.log(_id);
        console.log(req.user._id)
        if(!task)return res.status(404).send();
        res.status(200).send(task);
    } catch (e) { 
        res.status(400).send(e);
    }
});
router.patch("/tasks/:id",auth, async (req, res) => {
    try {
        const update = Object.keys(req.body);
        const allowedupdate = ["task", "important", "completed"];
        const isvalid = update.every((upd) => allowedupdate.includes(upd));
        if (!isvalid) return res.status(404).send('Invalid Error');
        const _id = req.params.id;

        const task = await Task.findOne({_id,owner:req.user._id});
        update.forEach((upd) => {
            task[upd] = req.body[upd];
        })
        await task.save();
        if (!task) {
            return res.status(400).send();
        }
        res.status(200).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});
router.delete("/tasks/:id",auth, async (req, res) => {
    try {
        const _id = req.params.id;
        const task = await Task.findOneAndDelete({_id,owner:req.user._id});
        if (!task) return res.send("User doesn't exist");
        res.status(200).send("Deleted Successfully");
    } catch (e) {
        res.status(404).send(e);
    }
});
module.exports = router;