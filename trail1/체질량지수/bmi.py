h,w =map(int,input().split())
if 10000 * w / h**2 >= 25:
    print(f"{10000 * w // h**2}")
    print("Obesity")
elif  10000 * w / h**2 < 25:
    print(10000 * w // h**2)