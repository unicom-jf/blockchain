from utils.hex_to_binary import hex_to_binary
def test_hex_to_binary():
  """
  num1 -> hex_str -> bin_str -> num2
  num2 should be the same as num1
  """

  org_num = 123
  str_hex = hex(org_num)[2:]
  str_bin = hex_to_binary(str_hex)

  assert org_num == int(str_bin, 2)