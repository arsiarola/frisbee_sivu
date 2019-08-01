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
    # if i == 27:
    #     break

# go to course link and get google maps link
i = 0
for lista in list:
    rata = requests.get(lista["website"])
    ratasoup = BeautifulSoup(rata.text, 'html.parser')
    for li in ratasoup.findAll("li", {"class": "course_info_right"}):
        for a in li.find_all('a', href=True):
            lista.update(coordinates = a['href'])
    print(i, ": ", lista["name"], "done", sep="")
    i += 1

# function to check if openstreet antaa coordinaatit
def wrongCoords(data):
    if len(data) < 1:
        return True
    if "lat" not in data[0] or "lon" not in data[0]:
        return True
    lat = re.search(r"[0-9]{1,2}\.*[0-9]*", data[0]['lat'])
    lon = re.search(r"[0-9]{1,2}\.*[0-9]*", data[0]['lon'])
    if lat != None and lon != None:
        return False
    return True

# check if google maps link invalid E.g NULL, NULL
# if correct link extract lat and lon
# append all the data to a new list of dictionarys (one dictionary =
# one course with all it's data)
i, j = 0, 0
result = []
corrupted = []
for lista in list:
    x = re.search(r"[0-9]{1,2}\.*[0-9]*,[0-9]{1,2}\.*[0-9]*", lista["coordinates"])
    if x != None:
        coordinates = x.group().split(",")
        lat = coordinates[0]
        lon = coordinates[1]
        result.append({})
        result[i].update(name = lista["name"])
        result[i].update(website = lista["website"])
        if lat < lon:
            result[i].update(latitude = lon)
            result[i].update(longitude = lat)
        else:
            result[i].update(latitude = lat)
            result[i].update(longitude = lon)
        i += 1
    else:
        split_str = lista["coordinates"].split('=')
        address = split_str[1]
        response = requests.get("https://nominatim.openstreetmap.org/search/" + address + "?format=json&addressdetails=1&limit=1&polygon_svg=1")
        data = response.json()
        if "NULL" in address or wrongCoords(data):
            print(lista["name"], "(invalid link, added to corrupted.js)")
            corrupted.append({})
            corrupted[j].update(name = lista["name"])
            corrupted[j].update(website = lista["website"])
            corrupted[j].update(corruptedLink = lista["coordinates"])
            j += 1
        else:
            lat = data[0]['lat']
            lon = data[0]['lon']
            result.append({})
            result[i].update(name = lista["name"])
            result[i].update(website = lista["website"])
            if lat < lon:
                result[i].update(latitude = lon)
                result[i].update(longitude = lat)
            else:
                result[i].update(latitude = lat)
                result[i].update(longitude = lon)
            i += 1

string = "var markers = "
json_result = json.dumps(result, indent=2)
with open('data.js', 'w') as outfile:
    outfile.write(re.sub(r'"(.*?)"(?=:)', r'\1', string))
    outfile.write(json_result)

json_corrupted = json.dumps(corrupted, indent=2)
with open('corrupted.js', 'w') as outfile:
        outfile.write(json_corrupted)
