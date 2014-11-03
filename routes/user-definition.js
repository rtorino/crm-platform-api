'use strict';

var User   = require( '../models' ).User;

module.exports = [
	{
		'method' : 'POST',
		'path'   : '/users',
		'config' : {
			'handler' : function ( request, reply ) {
				User.create( request.payload ).then( function ( user ) {
					var baseUrl = request.server.info.uri;
					var path    = request.path;
					var userId  = user.dataValues.id;

					reply().created( baseUrl + path + '/' + userId );
				} ).catch( function ( error ) {
					reply( error );
				} );
			}
		}
	},

	{
		'method' : 'GET',
		'path'   : '/users',
		'config' : {
			'handler' : function ( request, reply ) {
				var options = {
					'limit'      : 20,
					'attributes' : [ 'id', 'name' ]
				};

				User.findAll( options ).then( function ( users ) {
					reply( users );
				} ).catch( function ( error ) {
					reply( error );
				} );
			}
		}
	},

	{
		'method' : 'GET',
		'path'   : '/users/{id}',
		'config' : {
			'handler' : function ( request, reply ) {
				var options = {
					'id' : request.params.id
				};

				User.find( options ).then( function ( user ) {
					reply( user );
				} ).catch( function ( error ) {
					reply( error );
				} );
			}
		}
	}
];
