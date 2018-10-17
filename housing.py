import pandas as pd, numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn import linear_model
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
import math

"""
    Predicts a house price,

    expects arguments:
    Type: H=House, U=Unit, T=Townhouse
    Suburb
    Postcode
    Date,
    Bedrooms
    Bathrooms
    CarSlots (1 = fits 1 car)
    Landsize (m^2)
    BuildingArea (m^2)
    Longitude
    Latitude
"""

S_ARGS = [
    "Suburb",
    "Type",
    "Postcode",
    "Bedroom2",
    "Bathroom",
    "Car",
    "Landsize",
    "BuildingArea",
    "Lattitude",
    "Longtitude",
    "year",
    "month",
    "day",
]


def rmse(x, y):
    return math.sqrt(((x - y) ** 2).mean())


# from courses.fast-ai.com
def print_score(m, x_train, y_train, x_test, y_test):
    res = [
        rmse(m.predict(x_train), y_train),
        rmse(m.predict(x_test), y_test),
        m.score(x_train, y_train),
        m.score(x_test, y_test),
    ]
    if hasattr(m, "oob_score_"):
        res.append(m.oob_score_)
    print(res)


class HousePrices:
    def __init__(self, csv_file):
        df_raw = pd.read_csv(csv_file, low_memory=False, parse_dates=["Date"])
        self.df_raw = df_raw.copy( )
        # First we replace 0 with NaNs, then we want to set landsize to the mean of their suburb
        # Then drop any rows still Nan/infinite landsize
        df_raw["Landsize"] = df_raw["Landsize"].replace(0, np.nan)
        df_raw["Landsize"] = df_raw["Landsize"].fillna(
            df_raw.groupby("Suburb")["Landsize"].transform("mean")
        )
        df_raw = df_raw.dropna(subset=["Landsize"])

        # drop unneeded columns
        df_raw.drop(
            columns=[
                "Address",
                "Method",
                "SellerG",
                "Propertycount",
                "YearBuilt",
                "CouncilArea",
                "Regionname",
                "Distance",
                "Rooms",
            ],
            inplace=True,
        )

        # Remove any rows with NaN values
        df = df_raw.dropna(how="any", axis=0).copy()

        # Set year,month,day individual columns and remove the date column.
        (df["year"], df["month"], df["day"]) = (
            df.Date.dt.year,
            df.Date.dt.month,
            df.Date.dt.day,
        )
        df.drop(columns="Date", inplace=True)

        # convert category into their codes, storing their mappings
        self.typeCat = dict(
            [
                (category, code)
                for code, category in enumerate(
                    df["Type"].astype("category").cat.categories
                )
            ]
        )
        self.suburbCat = dict(
            [
                (category, code)
                for code, category in enumerate(
                    df["Suburb"].astype("category").cat.categories
                )
            ]
        )

        df["Type"] = df["Type"].astype("category").cat.codes
        df["Suburb"] = df["Suburb"].astype("category").cat.codes

        # Split into training and validation sets
        df["Price"] = np.log(df["Price"])
        y = df.pop("Price").to_frame()
        x = df

        x_train, x_test, y_train, y_test = train_test_split(x.index, y, test_size=0.2)
        # --
        x_train = df.loc[x_train]
        x_test = df.loc[x_test]
        y_train = y_train.values.ravel()
        y_test = y_test.values.ravel()

        mdl = RandomForestRegressor(
            n_jobs=1, min_samples_leaf=3, n_estimators=150, oob_score=True
        )
        mdl.fit(x_train, y_train)

        print("Scores: ", end=None)
        print_score(mdl, x_train, y_train, x_test, y_test)
        self.mdl = mdl

    def predict(self, args):
        vals = []
        for a in S_ARGS:
            if a not in args:
                print("Didn't expect " + a)
                print("Required arguments not specified")
                return -1
            if a == "Suburb":
                vals.append(self.suburbCat[args[a]])
            elif a == "Type":
                vals.append(self.typeCat[args[a]])
            else:
                vals.append(args[a])
        # convert data into a Series
        series = pd.Series(vals, index=S_ARGS)
        logPrice = self.mdl.predict([series])
        return math.e ** logPrice[0]

    def predict_existing( self, address ):
        s = self.df_raw[ self.df_raw[ 'Address' ] == address ]
        zz = { }
        for arg in S_ARGS:
            if arg == 'year':
                zz[ arg ] = float( pd.to_datetime( s[ 'Date' ].values[ 0 ] ).year )
                continue
            elif arg == 'month':
                zz[ arg ] = float( pd.to_datetime( s[ 'Date' ].values[ 0 ] ).month )
                continue
            elif arg == 'day':
                zz[ arg ] = float( pd.to_datetime( s[ 'Date' ].values[ 0 ] ).day )
                continue
            zz[ arg ] = s[ arg ].values[ 0 ]
        return self.predict( zz )

    def heatmap( self, suburb ):
        df = self.df_raw.dropna( ).copy( )
        mn = df[ df[ 'Suburb' ] == suburb ][ 'Price' ].min( )
        mx = df[ df[ 'Suburb' ] == suburb ][ 'Price' ].min( )
        res = [ ]
        for row in df.values:
            res.append( {
                'price': row[ 4 ],
                'lng': row[ 18 ],
                'lat': row[ 17 ]
            } )
        return (mn, mx, res)

# Example of usage!
if __name__ == "__main__":
    hp = HousePrices("data/prices.csv")

    # entry 24
    zz = {
        "Suburb": "Abbotsford",
        "Type": "h",
        "Postcode": 3067.0,
        "Bedroom2": 3.0,
        "Bathroom": 2.0,
        "Car": 2.0,
        "Landsize": 214.0,
        "BuildingArea": 190.0,
        "Lattitude": -37.80850,
        "Longtitude": 144.99640,
        "year": 2016.0,
        "month": 12.0,
        "day": 11.0,
    }
    print(hp.predict(zz))
    print(hp.predict_existing('48 Abbotsford St'))
    print(hp.heatmap('Abbotsford'))
