export const handlers = {

    AUDIT_LOG : (e, keys) => {

        console.log(keys);
        alert("Audit")
    },
    DB_LOG : (e, keys) => {

        console.log(keys);
        alert("DB log")
    },
    HOT_KEYS : (e) => {
       
        console.log("HOT_KEYS");
        alert("HOT_KEYS")
    }
}