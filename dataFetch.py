import pandas as pd

def AirlineArrDelay(IATA_Airline,SM,SY,EM,EY):
	df=pd.read_csv("./MonthlyCSVs/AirlineArrDelay.csv",index_col=0)
	start=SY+'-'+SM
	end=EY+'-'+EM
	s=df.loc[IATA_Airline,start:end]
	print(s)