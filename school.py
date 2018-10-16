import pandas as pd, numpy as np

"""
    Interface for obtaining school information based on dataset
    located in csv_file
"""
class SchoolInfo:
    def __init__( self, csv_file ):
        self.df = pd.read_csv( csv_file )

    def get_columns( self ):
        return list( self.df.columns )

    def search( self, suburb=None ):
        result = None
        if not suburb:
            result = self.df
        else:
            result = self.df[ self.df[ 'Suburb' ] == suburb ]
        res = [ ]
        for row in result.values:
            res.append( list( row ) )
        return res
        

if __name__ == '__main__':
    si = SchoolInfo( 'data/school.csv' )
    print( si.get_columns( ) )
    print( si.search( 'Melbourne' ) )
    print( si.search( ) )
