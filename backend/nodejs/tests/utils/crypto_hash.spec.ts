import assert from "assert";
import { crypto_hash } from "../../utils/crypto_hash";

describe("Test crypto_hash", () => {
  it("two hash should be same", () => {
    const args = ["one", 2, [3]];
    const h1 = crypto_hash(args);
    const h2 = crypto_hash(args);
    assert(h1 == h2);
  });
});
