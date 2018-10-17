import pandas as pd, numpy as np

"""
Description:
    Interface for obtaining school information based on dataset
    located in csv_file

Fields:
    School_Name - self-explanatory
    Suburb - self-explanatory
    VCE_Students - Number of students enrolled in at least one VCE 
        subject
    VCE_Completion% - Percentage of students that completed VCE
    VCE_Median - Median of VCE score
    VCE_Over40% - Percentage that scored over 40

Notes:
    VCE scores are in the range of [0,50]

Source: 
    http://topscores.co/report.php?z=Vic&req=vce-school
"""
class SchoolInfo:
    def __init__( self, csv_file ):
        self.df = pd.read_csv( csv_file )

    def get_columns( self ):
        return list( self.df.columns )

    def get_suburb_list( self ):
        return list( self.df[ 'Suburb' ].unique( ) )

    def search( self, suburb=None, sort=None, asc=True ):
        result = None
        if not suburb:
            result = self.df.copy( )
        else:
            result = self.df[ self.df[ 'Suburb' ] == suburb ].copy( )
        
        if sort == 0:
            result.sort_values( by=[ 'VCE_Students' ], inplace=True, ascending=asc )
        elif sort == 1:
            result.sort_values( by=[ 'VCE_Completion%' ], inplace=True, ascending=asc )
        elif sort == 2:
            result.sort_values( by=[ 'VCE_Median' ], inplace=True, ascending=asc )
        elif sort == 3:
            result.sort_values( by=[ 'VCE_Over40%' ], inplace=True, ascending=asc )
        elif sort == None and asc == False:
            result.sort_values( by=[ 'School_Name' ], inplace=True, ascending=asc )

        res = [ ]
        for row in result.values:
            res.append( list( row ) )
        return res
        

if __name__ == '__main__':
    si = SchoolInfo( 'data/school.csv' )
    print( si.get_columns( ) )
    print( si.search( 'Melbourne' ) )
    print( si.search( ) )
