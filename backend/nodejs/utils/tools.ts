import { resolve } from "path";

//function leftPadZero(len: number, num: number): string {
function padding(
  len: number,
  value: number | string,
  padding_position: string = "l", // l: left, r: right
  padding_string: string = "0"
): string {
  if (padding_position === "l") {
    return (Array(len).join(padding_string) + value).slice(-len);
  } else {
    return (value + Array(len).join(padding_string)).slice(0, len);
  }
}

function sleep(milli_seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milli_seconds));
}
export { padding, sleep };
