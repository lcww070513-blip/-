
a_count = 0
b_count = 0
c_count = 0
d_count = 0

for _ in range(3):
    symptom, temperature = input().split()
    temperature = int(temperature)

    if symptom == "Y" and temperature >= 37:
        a_count+=1
    elif symptom == "N" and temperature >= 37:
        b_count+=1       
    elif symptom == "Y" and temperature < 37:
        c_count+=1       
    else:
        d_count+=1
print(a_count, b_count, c_count, d_count, end=" ")
if a_count >= 2:
    print("E")     

  
    
