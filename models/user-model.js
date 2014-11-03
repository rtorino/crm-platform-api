'use strict';

// Load config file
var config = require( 'config' );

// Load third party modules
var bcrypt = require( 'bcryptjs' );

module.exports = function( sequelize, DataTypes ) {
	var User = sequelize.define( 'User', {
		'id': {
			'type': DataTypes.UUID,
			'primaryKey': true,
			'defaultValue': DataTypes.UUIDV4
		},

		'name': {
			'type': DataTypes.STRING,
			'allowNull': false
		},

		'username': {
			'type': DataTypes.STRING,
			'allowNull': false
		},

		'password': {
			'type': DataTypes.STRING,
			'allowNull': false
		},

		'email': {
			'type': DataTypes.STRING,
			'allowNull': false
		},

		'createdAt': DataTypes.DATE,
		'updatedAt': DataTypes.DATE,
		'deletedAt': DataTypes.DATE
	}, {
		'paranoid': true,

		'instanceMethods': {
			'verifyPassword': function( password, done ) {
				bcrypt.compare( ( password + config.salt ), this.password, function( error, response ) {
					done( error, response );
				} );
			}
		}
	} );

	User.beforeCreate( function( user ) {
		var promisifiedBcrypt = sequelize.Promise.promisifyAll( bcrypt );

		return promisifiedBcrypt.genSaltAsync( config.hashRounds ).then( function ( salt, error ) {
			return promisifiedBcrypt.hashAsync( ( user.password + config.salt ), hash, error );
		} );
	} );

	return User;
};
