class SystemConst {
    static DOMAIN = 'https://localhost:7283/api';
    static DOMAIN_HOST = 'https://localhost:7283';
    //local port
    // static DOMAIN = 'http://localhost:5256/api';
    // static DOMAIN_HOST = 'http://localhost:5256';
    // local lifetech port
    // static DOMAIN = 'http://192.168.31.23:8080/api';
    // static DOMAIN_HOST = 'http://192.168.31.23:8080';
    static STATUS_CODE = {
        SUCCESS: 200,
        BAD_REQUEST: 400,
        FORBIDDEN_REQUEST: 403,
        UNAUTHORIZED_REQUEST: 401,
        // not found
        NOT_FOUND: 404,
        CONFLICT: 409,
        INTERNAL_SERVER: 500,
    };
}
export default SystemConst;
