import re
import requests
import json
from bs4 import BeautifulSoup

data = requests.get('https://frisbeegolfradat.fi/radat/')
soup = BeautifulSoup(data.text, 'html.parser')
list = []

# get link to course and the name of it
i = 0
for td in soup.findAll("td", {"class": "rataCol"}):
    for a in td.find_all('a', href=True):
        list.append({})
        list[i].update(website = a['href'])
        list[i].update(name = a.text)
        i += 1

# go to course link and get google maps link
i = 0
for lista in list:
    rata = requests.get(lista["website"])
    ratasoup = BeautifulSoup(rata.text, 'html.parser')
    for li in ratasoup.findAll("li", {"class": "course_info_right"}):
        for a in li.find_all('a', href=True):
            lista.update(coordinates = a['href'])
    print(i, " :", lista["coordinates"], sep="")
    i += 1

# check if google maps link invalid E.g NULL, NULL or 01720, Vihti, vihdinkuja
# if correct link extract latitude and longitude
# append all the data to a new list of dictionarys (one dictionary, one course
# with all it's data)
i, j = 0, 0
result = []
corrupted = []
for lista in list:
    x = re.search(r"[0-9]{1,2}\.*[0-9]*,[0-9]{1,2}\.*[0-9]*", lista["coordinates"])
    if x != None:
        coordinates = x.group().split(",")
        latitude = coordinates[0]
        longitude = coordinates[1]
        result.append({})
        result[i].update(name = lista["name"])
        result[i].update(website = lista["website"])
        if latitude < longitude:
            result[i].update(latitude = longitude)
            result[i].update(longitude = latitude)
        else:
            result[i].update(latitude = latitude)
            result[i].update(longitude = longitude)
        i += 1
    else:
        corrupted.append({})
        corrupted[j].update(name = lista["name"])
        corrupted[j].update(website = lista["website"])
        corrupted[j].update(corruptedLink = lista["coordinates"])
        j += 1

string = "var markers = "
json_result = json.dumps(result, indent=2)
with open('data.js', 'w') as outfile:
    outfile.write(re.sub(r'"(.*?)"(?=:)', r'\1', string))
    outfile.write(json_result)

json_corrupted = json.dumps(corrupted, indent=2)
with open('corrupted.js', 'w') as outfile:
        outfile.write(json_corrupted)
