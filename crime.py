import pandas as pd
import numpy as np

"""
Description:
    Interface for obtaining crime information based on dataset
    located in csv_file

Source:
    https://www.data.vic.gov.au/data/dataset/crime-by-location-data-table/resource/4f76aaf4-6d05-4fdb-9092-38fb46ee35c5
"""

GROUP_BY = ["sum", "mean", "median"]


class CrimeInfo:
    def __init__(self, csv_file):
        df = pd.read_csv(csv_file, low_memory=False)
        df.rename(
            columns={
                "Year ending September": "Year",
                "Suburb/Town Name": "Suburb",
                "Incidents Recorded": "Incidents",
            },
            inplace=True,
        )

        # Only consider 2017?
        dff = df[df["Year"] == 2017].copy()
        # Title all suburbs
        dff["Suburb"] = dff["Suburb"].apply(
            lambda x: " ".join(w.capitalize() for w in x.split())
        )
        # convert to incidents to int
        dff["Incidents"] = pd.to_numeric(dff["Incidents"].str.replace(",", ""))

        self.df = dff

    def get_suburb_list(self):
        return list(self.df["Suburb"].unique())

    # gb_type accepts 'sum, mean, median'
    def get_suburb_total_crimes(self, suburb, gb_type="sum"):
        if gb_type not in GROUP_BY:
            return None

        gb = self.df[self.df["Suburb"] == suburb].groupby("Suburb")["Incidents"]

        if gb_type == "sum":
            return gb.sum().values[0]
        elif gb_type == "mean":
            return gb.mean().values[0]
        elif gb_type == "median":
            return gb.median().values[0]


if __name__ == "__main__":
    ci = CrimeInfo( "data/crime.csv" )

    print(ci.get_suburb_total_crimes("Melbourne"))
