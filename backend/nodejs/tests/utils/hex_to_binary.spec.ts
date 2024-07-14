import assert from "assert";
import { hex_to_binary } from "../../utils/hex_to_binary";
describe("Test hex_to_binary", function () {
  it("1e ==> 00011110", function () {
    const bin_str = hex_to_binary("1e");
    //expect(bin_str).toEqual("00011110");
    assert(bin_str, "00011110");
  });
});
