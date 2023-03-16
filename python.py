import csv
import json


def main():
    # Read Test csv having 2 records
    with open("covid.csv") as csvfile:
        data = csv.reader(csvfile)
        result = [json.loads(record[0]) for record in data]

    # dump csv data to Test.json file
    with open("Test.json", "w") as jsonfile:
        json.dump(result, jsonfile)
    
    # read Test json file to validate data is dumped correctly or not
    with open("Test.json", "r") as jsonfile:
        data = json.loads(jsonfile.read())
        for record in data:
            print(record)
            
main()