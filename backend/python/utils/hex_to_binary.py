def hex_to_binary(hex):
  rslt = ''
  for i in hex:
    rslt += '{:0>4d}'.format(
      int(
        format(int('0x' + i, 16), 'b')
        , 10)
    )
  return rslt

def main():
  print(f"hex_to_binary('12'): {hex_to_binary('12')}")
  print(f"hex_to_binary('1e'): {hex_to_binary('1e')}")

if __name__ == '__main__':
  main()