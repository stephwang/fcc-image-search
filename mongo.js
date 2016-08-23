var mongo = require('mongodb').MongoClient;
var mongodb_uri = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/img_search';

module.exports = {
    
    insertSearch: function(q, time){
        mongo.connect(mongodb_uri, function(err, db) { 
            if (err) throw err;
            db.collection('searches').insert({
                query: q,
                when: time
            }, function(err, data){
                if(err) throw err;

                db.close();
            });
        });
    },
    
    getSearches: function(next){
        mongo.connect(mongodb_uri, function(err, db) { 
            if (err) throw err;

            db.collection('searches')
            .find(
                {},
                { _id: 0}
            )
            .sort( { when: -1 } )
            .limit(5)
            .toArray(function(err, find) {
                if (err) throw err;
                db.close();

                next(find);
            });
        });
    }
};