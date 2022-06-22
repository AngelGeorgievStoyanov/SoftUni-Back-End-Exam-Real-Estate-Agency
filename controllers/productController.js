const { Router } = require('express');
const { isAuth, isOwner, isUser } = require('../middlewares/guards');
const { preloadHouse } = require('../middlewares/preload');
const { parseMongooseError } = require('../util/parse');

const router = Router();


router.get('/', async (req, res) => {
    const houses = await req.storage.getAll(req.query);


    const lastTreeHouse = houses.reverse().slice(0, 3)

    const ctx = {
        title: 'House',
        houses,
        lastTreeHouse
    };
    res.render('index', ctx);
});

router.get('/create', isAuth(), (req, res) => {
    res.render('create', { title: 'Create House' });
});

router.post('/create', isAuth(), async (req, res) => {

    const house = {
        name: req.body.name,
        type: req.body.type,
        year: req.body.year,
        city: req.body.city,
        imageUrl: req.body.imageUrl,
        description: req.body.description,
        rooms: Number(req.body.rooms),
        creator: req.user._id
    };


    try {
        await req.storage.create(house);

        res.redirect('/');
    } catch (err) {

        const ctx = {
            title: 'Create House',
            error: err.message,
            house
        };

        if (err.name == 'ValidationError') {
            ctx.error = parseMongooseError(err);
        } else {
            ctx.error = [err.message];
        }
        res.render('create', ctx);
    }
});

router.get('/details/:id', preloadHouse(), async (req, res) => {
    let isowner = false
    const house = req.data.house;
    if (house == undefined) {
        res.redirect('/404');
    } else {
        const isuser = req.user;
        let userBooked = false;
        let userIdd;
        let bookers;
        if (req.user) {
            if (req.data.house.creator._id == req.user._id) {
                isowner = true;
            }

            userIdd = req.user._id;
            bookers = house.bookeds;

            for (const book of bookers) {


                if (book == userIdd) {
                    userBooked = true;

                    break;
                }
            }


        }



        let arr = house.bookeds;

        const userRented = await Promise.all(
            arr.map(async (element) => {
                let a = req.storage.getUsersById(element);

                return a;
            })
        )

        const allUsers = userRented.map((x) => { return x.name }).join(', ')



        const ctx = {
            title: 'House',
            house,
            isuser,
            userBooked,
            bookers,
            userIdd,
            userRented,
            isowner,
            allUsers



        };
        res.render('details', ctx);
    }
});

router.get('/edit/:id', preloadHouse(), isOwner(), async (req, res) => {
    const house = req.data.house;

    if (!house) {
        res.redirect('/404');
    } else {
        const ctx = {
            title: 'Edit house',
            house
        };
        res.render('edit', ctx);
    }
})
router.post('/edit/:id', async (req, res) => {
    const house = {
        name: req.body.name,
        type: req.body.type,
        year: req.body.year,
        city: req.body.city,
        imageUrl: req.body.imageUrl,
        description: req.body.description,
        rooms: Number(req.body.rooms),

    };
    try {

        await req.storage.edit(req.params.id, house);
        res.redirect('/');
    } catch (err) {
        const ctx = {
            title: 'Edit House',
            error: err.message,
            house
        };

        res.render('edit', ctx);
    }
});
router.get('/delete/:id', preloadHouse(), isOwner(), async (req, res) => {
    const house = req.data.house;
    if (!house) {
        res.redirect('/404');
    } else {

        await req.storage.deleteOne(req.params.id)
        res.redirect('/')
    }

})


router.get('/search', (req, res) => {
    res.render('search')
})


router.post('/search', async (req, res) => {

    const houses = await req.storage.getHotelByName(req.body.name)

    const ctx = {
        title: 'Houses',
        houses
    };

    res.render('search', ctx)

})




router.get('/forrent', async (req, res) => {
    const houses = await req.storage.getAll(req.query);

    const ctx = {
        title: 'House',
        houses
    };

    res.render('forrent', ctx);
});

router.get('/book/:id', preloadHouse(), async (req, res) => {

    const house = req.data.house;

    house.rooms--;

    const userId = req.user._id;

    house.bookeds.push(userId)
    const ctx = {
        title: 'House',
        house,
    }

    try {
        await req.storage.attachBooked(house._id, house)
    } catch (err) {

        error = err.message

    }

    res.redirect(`/products/details/${house._id}`)
})



module.exports = router;