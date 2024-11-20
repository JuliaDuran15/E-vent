const User = require('./User');
const Event = require('./Event');
const EventParticipants = require('./EventParticipants');

// Associação User <-> Event através de EventParticipants
User.belongsToMany(Event, { through: EventParticipants, foreignKey: 'userId' });
Event.belongsToMany(User, { through: EventParticipants, foreignKey: 'eventId' });

module.exports = { User, Event, EventParticipants };
