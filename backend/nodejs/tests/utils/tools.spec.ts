import assert from "assert";
import { padding, sleep } from "../../utils/tools";
describe("Test tools", () => {
  it("test padding", () => {
    let value: number | string;
    value = 12;
    let rslt = padding(5, value);
    assert(rslt === "000" + value);
    rslt = padding(5, value, "r");
    assert(rslt === value + "000", "padding right: " + rslt);
    rslt = padding(5, value, "l", "x");
    assert(rslt === "xxx" + value);
    rslt = padding(5, value, "r", "x");
    assert(rslt === value + "xxx");

    value = "12";
    rslt = padding(5, value);
    assert(rslt === "000" + value);
    rslt = padding(5, value, "r");
    assert(rslt === value + "000", "padding right: " + rslt);
    rslt = padding(5, value, "l", "x");
    assert(rslt === "xxx" + value);
    rslt = padding(5, value, "r", "x");
    assert(rslt === value + "xxx");
  });
  it("test sleep", async function () {
    const start = Date.now();
    await sleep(1000);
    assert(Date.now() - start > 900);
  });
});
