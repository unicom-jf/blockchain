import { padding } from "./tools";
/*
function leftPadZero(len: number, num: number): string {
  return (Array(len).join("0") + num).slice(-len);
}
*/
function hex_to_binary(src: string): string {
  let s = "";
  src.split("").forEach((e) => {
    const num = parseInt(parseInt("0x" + e, 16).toString(2), 10);
    //console.log(leftPadZero(4, num));
    //s = s + leftPadZero(4, num);
    s = s + padding(4, num);
  });
  return s;
}

export { hex_to_binary };
//hex_to_binary("1e");
