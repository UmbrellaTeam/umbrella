var Error = require('error');

module.exports = {

    index: function(req, res) {
        res.error(
            new Error(
                'Not found',
                null,
                Error.CODE_NOT_FOUND
            )
        );
    }
};
