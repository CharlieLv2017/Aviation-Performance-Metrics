import numpy as np
import pandas as pd
from flask_mysqldb import MySQL
from flask import Flask, render_template, request

app = Flask(__name__)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'hello123'
app.config['MYSQL_DB'] = 'flightdata'
db=MySQL(app)


	#01A
	#Airline delays (avg)
def AirLineArrDel(startDate, endDate):
	query = "SELECT FlightDate, IATA_Airline, ArrDelay FROM allflights_innodb WHERE `FlightDate` BETWEEN ('%s') AND ('%s')" % (startDate, endDate)
	#query = "SELECT IATA_Airline, DATE_FORMAT(FlightDate,'%%Y-%%m') as yearWithMon, AVG(ArrDelay) AS ArrDelay FROM AllFlights_innodb WHERE Cancelled=0 and Diverted=0 and ArrDelay>0 AND `FlightDate` BETWEEN ('%s') AND ('%s') GROUP BY IATA_Airline, yearWithMon" % (startDate, endDate)
	#SELECT IATA_Airline, DATE_FORMAT(FlightDate,'%Y-%m') as yearWithMon, avg(ArrDelay) FROM AllFlights_innodb WHERE Cancelled=0 and Diverted=0 and ArrDelay>0 GROUP BY IATA_Airline, yearWithMon;
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./wholeCSVs/AirlineArrDelay.csv", df, fmt='%s', delimiter=",")
	df2=pd.read_csv("./wholeCSVs/AirlineArrDelay.csv")
	df3=pd.pivot_table(df2,index=["IATA_Airline"],values=["ArrDelay"],aggfunc=np.mean)
	#df3=pd.pivot_table(df2,index=["IATA_Airline"],columns=["yearWithMon"], values=["ArrDelay"],aggfunc=np.mean)
	#df3.columns = df3.columns.droplevel(0)
	df3.to_csv("./wholeCSVs/AirlineArrDelay PT.csv")
	cur.close()


def AirLineDepDel(startDate, endDate):
	query = "SELECT FlightDate, IATA_Airline, DepDelay FROM allflights_innodb WHERE `FlightDate` BETWEEN ('%s') AND ('%s') " % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./WholeCSVs/AirlineDepDelay.csv", df, fmt='%s', delimiter=",")
	df2=pd.read_csv("./wholeCSVs/AirlineDepDelay.csv")
	df3=pd.pivot_table(df2,index=["IATA_Airline"],values=["DepDelay"],aggfunc=np.mean)
	df3.to_csv("./wholeCSVs/AirlineDepDelay PT.csv")
	cur.close()

def AirLineDel2(startDate, endDate):
	query = "SELECT FlightDate, IATA_Airline, avg(DepDelay) FROM allflights_innodb WHERE `FlightDate` BETWEEN ('%s') AND ('%s') GROUP BY IATA_Airline" % (startDate, endDate) 
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./WholeCSVs/AirlineDelay PT2.csv", df, fmt='%s', delimiter=",")
	cur.close()

	#01B
	#Airport with most delay (avg)
def AirPortDepDelay(startDate, endDate):
	query = "SELECT FlightDate, Origin, DepDelay FROM allflights_innodb WHERE `FlightDate` BETWEEN ('%s') AND ('%s') " % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./wholeCSVs/AirPortDepDelay.csv", df, fmt='%s', delimiter=",")
	df2=pd.read_csv("./wholeCSVs/AirPortDepDelay.csv")
	df3=pd.pivot_table(df2,index=["Origin"],values=["DepDelay"],aggfunc=np.mean)
	df3.to_csv("./wholeCSVs/AirPortDepDelay PT.csv")
	cur.close()

def AirPortArrDelay(startDate, endDate):
	query = "SELECT FlightDate, Dest, ArrDelay FROM allflights_myisam WHERE `FlightDate` BETWEEN ('%s') AND ('%s') " % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./wholeCSVs/AirPortArrDelay.csv", df, fmt='%s', delimiter=",")
	df2=pd.read_csv("./wholeCSVs/AirPortArrDelay.csv")
	df3=pd.pivot_table(df2,index=["Dest"],values=["ArrDelay"],aggfunc=np.mean)
	df3.to_csv("./wholeCSVs/AirPortArrDelay.csv")
	cur.close()
	

	#02
	#Year Month MonthName Day DayName
def YearlyDepDelay(startDate, endDate):
	query = "SELECT YEAR(FlightDate), avg(DepDelay) FROM allflights_innodb WHERE `FlightDate` BETWEEN ('%s') AND ('%s') GROUP BY YEAR(FlightDate)" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./wholeCSVs/YearlyDepDelay.csv", df, fmt='%s', delimiter=",")
	cur.close()

def YearlyArrDelay(startDate, endDate):
	query = "SELECT YEAR(FlightDate), avg(ArrDelay) FROM allflights_innodb WHERE `FlightDate` BETWEEN ('%s') AND ('%s') GROUP BY YEAR(FlightDate)" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./wholeCSVs/YearlyArrDelay.csv", df, fmt='%s', delimiter=",")
	cur.close()

def MonthlyDepDelay(startDate, endDate):
	query = "SELECT MONTH(FlightDate), avg(DepDelay) FROM allflights_innodb WHERE `FlightDate` BETWEEN ('%s') AND ('%s') GROUP BY MONTH(FlightDate)" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./wholeCSVs/MonthlyDepDelay.csv", df, fmt='%s', delimiter=",")
	cur.close()

def MonthlyArrDelay(startDate, endDate):
	query = "SELECT MONTH(FlightDate), avg(ArrDelay) FROM allflights_innodb WHERE `FlightDate` BETWEEN ('%s') AND ('%s') GROUP BY MONTH(FlightDate)" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./wholeCSVs/MonthlyArrDelay.csv", df, fmt='%s', delimiter=",")
	cur.close()


def MonthNameDepDelay(startDate, endDate):
	query = "SELECT MONTHNAME(FlightDate), avg(DepDelay) FROM allflights_innodb WHERE `FlightDate` BETWEEN ('%s') AND ('%s') GROUP BY MONTHNAME(FlightDate)" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./wholeCSVs/MonthNameDepDelay.csv", df, fmt='%s', delimiter=",")
	cur.close()

def MonthNameArrDelay(startDate, endDate):
	query = "SELECT MONTHNAME(FlightDate), avg(ArrDelay) FROM allflights_innodb WHERE `FlightDate` BETWEEN ('%s') AND ('%s') GROUP BY MONTHNAME(FlightDate)" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./wholeCSVs/MonthNameArrDelay.csv", df, fmt='%s', delimiter=",")
	cur.close()

def DailyDepDelay(startDate, endDate):
	query = "SELECT DAY(FlightDate), avg(DepDelay) FROM allflights_innodb WHERE `FlightDate` BETWEEN ('%s') AND ('%s') GROUP BY DAY(FlightDate)" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./wholeCSVs/DailyDepDelay.csv", df, fmt='%s', delimiter=",")
	cur.close()

def DailyArrDelay(startDate, endDate):
	query = "SELECT DAY(FlightDate), avg(ArrDelay) FROM allflights_innodb WHERE `FlightDate` BETWEEN ('%s') AND ('%s') GROUP BY DAY(FlightDate)" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./wholeCSVs/DailyArrDelay.csv", df, fmt='%s', delimiter=",")
	cur.close()


def WeekdayDepDelay(startDate, endDate):
	query = "SELECT DAYNAME(FlightDate), avg(DepDelay) FROM allflights_innodb WHERE `FlightDate` BETWEEN ('%s') AND ('%s') GROUP BY DAYNAME(FlightDate)" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./wholeCSVs/DayNameDepDelay.csv", df, fmt='%s', delimiter=",")
	cur.close()

def WeekdayArrDelay(startDate, endDate):
	query = "SELECT DAYNAME(FlightDate), avg(ArrDelay) FROM allflights_innodb WHERE `FlightDate` BETWEEN ('%s') AND ('%s') GROUP BY DAYNAME(FlightDate)" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./wholeCSVs/DayNameArrDelay.csv", df, fmt='%s', delimiter=",")
	cur.close()

	#03
	#dg.StateDepOrigin, StateArrDest, CityDepOrigin, CityArrDest
def StateDepOrigin(startDate, endDate):
	#query = "SELECT  ap.State, AVG(f.DepDelay) FROM allflights_innodb f INNER JOIN airport_lookup ap ON f.Origin = ap.IATA_Code WHERE f.Diverted=0 AND `FlightDate` BETWEEN ('%s') AND ('%s') GROUP BY ap.State" % (startDate, endDate)
	query = "SELECT ap.state, AVG(f.depdelay) from (SELECT origin,depdelay FROM allflights_innodb AS a WHERE diverted=0 AND cancelled=0 AND DepDelay>0 AND `FlightDate` BETWEEN ('%s') AND ('%s')) as f INNER JOIN airport_lookup AS ap ON f.origin=ap.IATA_Code GROUP BY ap.state" % (startDate, endDate)
	#select b.state, avg(c.depdelay) from (select origin,depdelay from allflights_innodb as a where diverted=0 and cancelled=0 and DepDelay>0) as c inner join airport_lookup as b on c.origin=b.IATA_Code group by b.state;
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./wholeCSVs/StateDepOrigin.csv", df, fmt='%s', delimiter=",")
	cur.close()

def StateArrDest(startDate, endDate):
	query = "SELECT ap.state, AVG(f.ArrDelay) from (SELECT Dest, ArrDelay FROM allflights_innodb AS a WHERE diverted=0 AND cancelled=0 AND ArrDelay>0 AND `FlightDate` BETWEEN ('%s') AND ('%s')) as f INNER JOIN airport_lookup AS ap ON f.Dest=ap.IATA_Code GROUP BY ap.state" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./wholeCSVs/StateArrDest.csv", df, fmt='%s', delimiter=",")
	cur.close()

def CityDepOrigin(startDate, endDate):
	query = "SELECT ap.CityName, AVG(f.DepDelay) from (SELECT origin, DepDelay FROM allflights_innodb AS a WHERE diverted=0 AND cancelled=0 AND DepDelay>0 AND `FlightDate` BETWEEN ('%s') AND ('%s')) as f INNER JOIN airport_lookup AS ap ON f.origin=ap.IATA_Code GROUP BY ap.CityName" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./wholeCSVs/CityDepOrigin.csv", df, fmt='%s', delimiter=",")
	cur.close()

def CityArrDest(startDate, endDate):
	query = "SELECT ap.CityName, AVG(f.ArrDelay) from (SELECT Dest, ArrDelay FROM allflights_innodb AS a WHERE diverted=0 AND cancelled=0 AND ArrDelay>0 AND `FlightDate` BETWEEN ('%s') AND ('%s')) as f INNER JOIN airport_lookup AS ap ON f.Dest=ap.IATA_Code GROUP BY ap.CityName" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./wholeCSVs/CityArrDest.csv", df, fmt='%s', delimiter=",")
	cur.close()


	#04
	#Factors behind delayed departures/arrivals
def AirlineDelayType(startDate, endDate):
	query = "SELECT IATA_Airline, AVG(CarrierDelay), AVG(WeatherDelay), AVG(NASDelay), AVG(SecurityDelay), AVG(LateAircraftDelay), COUNT(IF(carrierDelay>0,1,NULL)) AS `COUNT(carrierDelay)`, COUNT(IF(WeatherDelay>0,1,NULL)) AS `COUNT(WeatherDelay)`, COUNT(IF(NASDelay>0,1,NULL)) AS `COUNT(NASDelay)`, COUNT(IF(SecurityDelay>0,1,NULL)) AS `COUNT(SecurityDelay)`, COUNT(IF(LateAircraftDelay>0,1,NULL)) AS `COUNT(LateAircraftDelay)` FROM allflights_innodb WHERE `FlightDate` BETWEEN ('%s') AND ('%s') GROUP BY IATA_Airline" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./wholeCSVs/AirlineDelayType.csv", df, fmt='%s', delimiter=",")
	cur.close()

def AirportOriginDelayType(startDate, endDate):
	query = "SELECT Origin, AVG(CarrierDelay), AVG(WeatherDelay), AVG(NASDelay), AVG(SecurityDelay), AVG(LateAircraftDelay), COUNT(IF(carrierDelay>0,1,NULL)) AS `COUNT(carrierDelay)`, COUNT(IF(WeatherDelay>0,1,NULL)) AS `COUNT(WeatherDelay)`, COUNT(IF(NASDelay>0,1,NULL)) AS `COUNT(NASDelay)`, COUNT(IF(SecurityDelay>0,1,NULL)) AS `COUNT(SecurityDelay)`, COUNT(IF(LateAircraftDelay>0,1,NULL)) AS `COUNT(LateAircraftDelay)` FROM allflights_innodb WHERE `FlightDate` BETWEEN ('%s') AND ('%s') GROUP BY Origin" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./wholeCSVs/AirportOriginDelayType.csv", df, fmt='%s', delimiter=",")
	cur.close()

def AirportDestDelayType(startDate, endDate):
	query = "SELECT Dest, AVG(CarrierDelay), AVG(WeatherDelay), AVG(NASDelay), AVG(SecurityDelay), AVG(LateAircraftDelay), COUNT(IF(carrierDelay>0,1,NULL)) AS `COUNT(carrierDelay)`, COUNT(IF(WeatherDelay>0,1,NULL)) AS `COUNT(WeatherDelay)`, COUNT(IF(NASDelay>0,1,NULL)) AS `COUNT(NASDelay)`, COUNT(IF(SecurityDelay>0,1,NULL)) AS `COUNT(SecurityDelay)`, COUNT(IF(LateAircraftDelay>0,1,NULL)) AS `COUNT(LateAircraftDelay)` FROM allflights_innodb WHERE `FlightDate` BETWEEN ('%s') AND ('%s') GROUP BY Dest" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./wholeCSVs/AirportDestDelayType.csv", df, fmt='%s', delimiter=",")
	cur.close()


	#05
	#dg.Airline and Airport(Origin) Cancellations
def AirlineCancellations(startDate, endDate):
	query = "SELECT IATA_Airline, SUM(Cancelled) FROM allflights_innodb WHERE `FlightDate` BETWEEN ('%s') AND ('%s') GROUP BY IATA_Airline" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./wholeCSVs/AirlineCancellations.csv", df, fmt='%s', delimiter=",")
	cur.close()


def AirportCancellations(startDate, endDate):
	query = "SELECT Origin, SUM(Cancelled) FROM allflights_innodb WHERE `FlightDate` BETWEEN ('%s') AND ('%s') GROUP BY Origin" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./wholeCSVs/AirportCancellations.csv", df, fmt='%s', delimiter=",")
	cur.close()


	#06 
	#AL, AP Cancel Dist
def AirlineCancelDist(startDate, endDate):
	query = "SELECT f.IATA_Airline, c.Description, count(c.Description) from (SELECT IATA_Airline, CancellationCode FROM allflights_innodb AS a WHERE `FlightDate` BETWEEN ('%s') AND ('%s')) AS f INNER JOIN cancel_lookup AS c ON f.CancellationCode=c.Code GROUP BY f.IATA_Airline, c.Description" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./wholeCSVs/AirlineCancelDist.csv", df, fmt='%s', delimiter=",")
	df2=pd.read_csv("./wholeCSVs/AirlineCancelDist.csv")
	df3=pd.pivot_table(df2,index=["IATA_Airline"], columns=["Description"], values=["count(c.Description)"],aggfunc=np.mean)
	#print(df3.iloc[1][0],df3.iloc[2][0])
	#df3[1][0]=df3[2][0]
	df3.columns = df3.columns.droplevel(0)
	df3.to_csv("./wholeCSVs/AirlineCancelDist PT.csv")
	cur.close()


def AirportOriginCancelDist(startDate, endDate):
	query = "SELECT f.Origin, c.Description, count(c.Description) from (SELECT Origin, CancellationCode FROM allflights_innodb AS a WHERE `FlightDate` BETWEEN ('%s') AND ('%s')) AS f INNER JOIN cancel_lookup AS c ON f.CancellationCode=c.Code GROUP BY f.Origin, c.Description" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./wholeCSVs/AirportOriginCancelDist.csv", df, fmt='%s', delimiter=",")
	df2=pd.read_csv("./wholeCSVs/AirportOriginCancelDist.csv")
	df3=pd.pivot_table(df2,index=["Origin"], columns=["Description"], values=["count(c.Description)"],aggfunc=np.mean)
	df3.columns = df3.columns.droplevel(0)
	df3.to_csv("./wholeCSVs/AirportOriginCancelDist PT.csv")
	cur.close()

def AirportDestCancelDist(startDate, endDate):
	query = "SELECT f.Dest, c.Description, count(c.Description) from (SELECT Dest, CancellationCode FROM allflights_innodb AS a WHERE `FlightDate` BETWEEN ('%s') AND ('%s')) AS f INNER JOIN cancel_lookup AS c ON f.CancellationCode=c.Code GROUP BY f.Dest, c.Description" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./wholeCSVs/AirportDestCancelDist.csv", df, fmt='%s', delimiter=",")
	df2=pd.read_csv("./wholeCSVs/AirportDestCancelDist.csv")
	df3=pd.pivot_table(df2,index=["Dest"], columns=["Description"], values=["count(c.Description)"],aggfunc=np.mean)
	df3.columns = df3.columns.droplevel(0)
	df3.to_csv("./wholeCSVs/AirportDestCancelDist PT.csv")
	cur.close()


	#07
	#Routes with most delay
def RouteDelay(startDate, endDate):
	#query = "SELECT Origin, Dest, CONCAT(Origin, '-', Dest) AS OrigDest, AVG(DepDelay+ArrDelay) AS TotalDelay FROM allflights_innodb WHERE `FlightDate` BETWEEN ('%s') AND ('%s') GROUP BY Origin, Dest" % (startDate, endDate)
	query = "SELECT Origin, Dest, AVG(DepDelay+ArrDelay) AS AverageDelay, count(Dest) AS numOfFlights FROM allflights_myisam WHERE count(Dest)>=(%s) AND `FlightDate` BETWEEN ('%s') AND ('%s') GROUP BY Origin, Dest" % (5000, startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./wholeCSVs/RouteDelay.csv", df, fmt='%s', delimiter=",")
	cur.close()

	#08
	#dg.Tail Number Taxi Out/In
def TailNumberTaxiOut(startDate, endDate):
	query = "SELECT Tail_Number, AVG(TaxiOut) FROM allflights_innodb WHERE `FlightDate` BETWEEN ('%s') AND ('%s') GROUP BY Tail_Number" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./wholeCSVs/TailNumberTaxiOut.csv", df, fmt='%s', delimiter=",")
	cur.close()

def TailNumberTaxiIn(startDate, endDate):
	query = "SELECT Tail_Number, AVG(TaxiIn) FROM allflights_innodb WHERE `FlightDate` BETWEEN ('%s') AND ('%s') GROUP BY Tail_Number" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./wholeCSVs/TailNumberTaxiIn.csv", df, fmt='%s', delimiter=",")
	cur.close()


#09 AirlineCount
def AirlineCount(startDate, endDate):
	query = "SELECT Origin AS Airport, COUNT(Origin) AS Outbound FROM AllFlights_innodb WHERE `FlightDate` BETWEEN ('%s') AND ('%s') GROUP BY Origin" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./wholeCSVs/AirlineCount.csv", df, fmt='%s', delimiter=",")
	df2=pd.read_csv("./wholeCSVs/AirlineCount.csv")
	df2=df2.sort_values('Outbound',ascending=False)
	rec=df2.shape[0]
	df2['Tag']=""
	#df2['index']=""
	cnt=0
	for index, row in df2.iterrows():
		#cnt+=1
		if(cnt<rec/3):
			df2.loc[index,'Tag']=2
			#df2.loc[index,'index']=cnt
		elif(cnt<2*rec/3):
			df2.loc[index,'Tag']=1
			#df2.loc[index,'index']=cnt
		else:
			df2.loc[index,'Tag']=0
			#df2.loc[index,'index']=cnt
		cnt+=1
	
	df2.to_csv("./wholeCSVs/AirlineCount.csv",index=0)
	cur.close()
