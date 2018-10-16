import requests, csv
from bs4 import BeautifulSoup

BASE_URL = "http://topscores.co/report.php?z=Vic&req=vce-school&year=2017&sortBy=name"
OUT_FILE = "school.csv"
csv_file = None
writer = None


def parsePage(URL):
    result = requests.get(URL)
    soup = BeautifulSoup(result.content, "html5lib")
    rows = soup.select("tbody > tr")
    for row in rows:
        cols = row.select("td")
        if len(cols) != 14:
            continue  # skip rows that have missing values
        # skip rows that have whitespace as values
        relevant_cols = [c.text for c in [cols[1], cols[2], cols[4], cols[5], cols[6], cols[7]]]
        if any( [ c.replace( u'\xa0', '' ) == '' for c in relevant_cols ] ):
            continue
        writer.writerow( relevant_cols )


def setupFile():
    global csv_file, writer
    csv_file = open(OUT_FILE, "w", newline="")
    writer = csv.writer(csv_file)
    writer.writerow(
        [
            "School_Name",
            "Suburb",
            "VCE_Students",
            "VCE_Completion%",
            "VCE_Median",
            "VCE_Over40%",
        ]
    )


def main():
    setupFile()
    result = requests.get(BASE_URL)
    soup = BeautifulSoup(result.content, "html5lib")

    maxPages = int(
        soup.select(".controlHeading > .pagerControlButton strong")[-1].text.replace(
            ".", ""
        )
    )

    for pg in range(1, maxPages + 1):
        URL = BASE_URL + "&pageno=" + str(pg)
        parsePage(URL)

    csv_file.close()


if __name__ == "__main__":
    main()
