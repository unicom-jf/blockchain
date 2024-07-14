import crypto from "crypto";
const SECRET = "ASDFSxzcbfdghdr345@@";
function crypto_hash(...args: any[]): string {
  let s = "";
  args.forEach((e) => {
    s = s + e.toString();
  });
  //console.log("args to string:", s);
  return crypto.createHmac("sha256", SECRET).update(s).digest("hex");
}

export { crypto_hash };
//console.log("hash is: ", crypto_hash("one", 2, [3]));
