import pandas as pd
import numpy as np
import re
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
        # remove 'A', 'B', 'C' in offence division
        dff[ 'Offence Division' ] = dff[ 'Offence Division' ].apply( lambda x: re.sub( r'^[A-Z]\s', r'', x ) )
        self.df = dff

    def get_suburb_list(self):
        return list(self.df["Suburb"].unique())

    # gb_type accepts 'sum, mean, median'
    def get_suburb_crimes(self, suburb, gb_type=0):
        if gb_type < 0 or gb_type > 2:
            return None

        gb = self.df[self.df["Suburb"] == suburb].groupby(['Suburb', 'Offence Division'])["Incidents"]
        gb_cont = None
        if gb_type == 0:
            gb_cont = gb.sum()
        elif gb_type == 1:
            gb_cont = gb.mean()
        elif gb_type == 2:
            gb_cont = gb.median()

        results = []
        for row in gb_cont.reset_index( ).values:
            results.append( {
                'category': row[ 1 ],
                'incidents': row[ 2 ]
            })
        return results


if __name__ == "__main__":
    ci = CrimeInfo( "data/crime.csv" )

    print(ci.get_suburb_crimes("Melbourne"))
