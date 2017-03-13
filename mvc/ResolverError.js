

/**
 * ResolverError
 * 
 * Indicates an exception happend while resolving action
 * In most cases it would mean 404
 */
class ResolverError extends Error
{
    constructor(message) {
        super(message);
    }
}

module.exports = ResolverError;