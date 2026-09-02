s1,t1=input().split()
s2,t2=input().split()
s3,t3=input().split()

if s1=='Y':
    if int(t1)>=37:
        h1='A'
    else:
        h1='C'
else:
    if int(t1)>=37:
        h1='B'
    else:
        h1='D'

if s2=='Y':
    if int(t2)>=37:
        h2='A'
    else:
        h2='C'
else:
    if int(t2)>=37:
        h2='B'
    else:
        h2='D'

if s3=='Y':
    if int(t3)>=37:
        h3='A'
    else:
        h3='C'
else:
    if int(t3)>=37:
        h3='B'
    else:
        h3='D'

if [h1,h2,h3].count('A')>=2:
    print('E')
else:
    print('N')
