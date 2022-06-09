
const House = require('../models/House');
const User = require('../models/User');


async function getAll(query) {

    const options = {};


    if (query.search) {
        options.name = { $regex: query.search, $options: 'i' };
    }

    const houses = House.find(options).lean();



    return await houses;
}

async function getById(id) {
    const house = await House
        .findById(id)
        .populate('creator')
        .lean();
    if (house) {

        const viewModel = {
            _id: house._id,
            name: house.name,
            type: house.type,
            year: house.year,
            city: house.city,
            description: house.description,
            rooms: house.rooms,
            imageUrl: house.imageUrl,
            creator: house.creator,
            bookeds: house.bookeds,
        };
        return viewModel;
    } else {
        return undefined;
    }
}

async function create(house) {
    const record = new House(house);


    await record.save();
    return record;

}
async function edit(id, house) {
    const existing = await House.findById(id);
    if (!existing) {
        throw new ReferenceError('No such ID in database');
    }

    Object.assign(existing, house);
    return existing.save();

}


function deleteOne(houseId) {
    return House.deleteOne({ _id: houseId });
}

function getDelete(req, res) {
    const houseId = req.params.id;
    houseModel.findById(houseId).remove().then(() => {
        res.redirect(`/`);
    });
}

async function attachBooked(id, house) {

    const existing = await House.findById(id);
    if (!existing) {
        throw new ReferenceError('No such ID in database');
    }

    Object.assign(existing, house);
    return existing.save();



}

async function getHotelByName(name) {


    let houses = House.find({ "name": `${name}` }).lean()

    return await houses;
}

async function getUsersById(x) {
  

    const user =await User.findById(x).lean()
  
   return   user

  
}

module.exports = {
    getAll,
    getById,
    create,
    edit,
    deleteOne,
    getDelete,
    attachBooked,
    getHotelByName,
    getUsersById
};