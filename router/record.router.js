const router = require('express').Router();
const multer = require('multer');
const fs = require('fs');
const { Record } = require('../models/record.models');


const multerStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/assets');
    },
    filename: (req, file, callback) => {
        const ext = file.mimetype.split('/')[1];
        const filename = file.originalname.split('.')[0];
        callback(null, `record-${filename}-${Date.now()}.${ext}`)
    }
});

const upload = multer({
    storage: multerStorage,
    dest: 'public/assets'
});

const uploadPhoto = upload.single('image');


router.get("/", async (req, res) => {
    const record = await Record.find();

    if (record.length > 0) {
        return res.render("index", { records: record })
    } else {
        return res.render("index", { records: undefined })
    }
});

router.get("/create", (req, res) => {
    return res.render("add_file")
})

router.get("/edit/:id", async (req, res) => {
    const id = req.params.id;
    const record = await Record.findById({ _id: id })
    return res.render("edit_file", { record })
})


router.post("/create", uploadPhoto, async (req, res) => {
    const record = new Record({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        image: req.file.filename,
        itemForSale: req.body.itemforsale,
        itemPrice: req.body.itemprice != 'null' ? req.body.itemprice : null,
        accepted: true
    });

    await record.save();
    return res.redirect('/');
})

router.post("/edit/:id", uploadPhoto, async (req, res) => {
    const id = req.params.id;

    const oldData = await Record.findById({ _id: id });
    fs.unlink(`public/assets/${oldData.image}`, async (err) => {
        if (err) {
            console.log(err);
        } else {
            const updatedData = await Record.findByIdAndUpdate({ _id: id }, {
                title: req.body.title,
                description: req.body.description,
                category: req.body.category,
                image: req.file.filename,
                itemForSale: req.body.itemforsale,
                itemPrice: req.body.itemprice != 'null' ? req.body.itemprice : null,
                accepted: true
            });
            res.redirect('/');
        }
    })
})

router.get("/delete/:id", async (req, res) => {
    const oldData = await Record.findById({ _id: req.params.id });
    fs.unlink(`public/assets/${oldData.image}`, async (err) => {
        if (err) {
            console.log(err);
        } else {
            const deletedData = await Record.findByIdAndDelete({ _id: req.params.id });
            res.redirect('/');
        }
    })
})

module.exports = router;