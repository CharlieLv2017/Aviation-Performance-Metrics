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
	query = "SELECT IATA_Airline, DATE_FORMAT(FlightDate,'%%Y-%%m') as yearWithMon, AVG(ArrDelay) AS ArrDelay FROM AllFlights_innodb WHERE Cancelled=0 and Diverted=0 and ArrDelay>0 AND `FlightDate` BETWEEN ('%s') AND ('%s') GROUP BY IATA_Airline, yearWithMon" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./MonthlyCSVs/AirlineArrDelay.csv", df, fmt='%s', delimiter=",")
	df2=pd.read_csv("./MonthlyCSVs/AirlineArrDelay.csv")
	df3=pd.pivot_table(df2,index=["IATA_Airline"],columns=["yearWithMon"], values=["ArrDelay"],aggfunc=np.mean)
	df3.columns = df3.columns.droplevel(0)
	df3.to_csv("./MonthlyCSVs/AirlineArrDelay.csv")
	cur.close()


def AirLineDepDel(startDate, endDate):
	query = "SELECT IATA_Airline, DATE_FORMAT(FlightDate,'%%Y-%%m') as yearWithMon, AVG(DepDelay) AS DepDelay FROM AllFlights_innodb WHERE Cancelled=0 and Diverted=0 and DepDelay>0 AND `FlightDate` BETWEEN ('%s') AND ('%s') GROUP BY IATA_Airline, yearWithMon" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./MonthlyCSVs/AirlineDepDelay.csv", df, fmt='%s', delimiter=",")
	df2=pd.read_csv("./MonthlyCSVs/AirlineDepDelay.csv")
	df3=pd.pivot_table(df2,index=["IATA_Airline"],columns=["yearWithMon"], values=["DepDelay"],aggfunc=np.mean)
	df3.columns = df3.columns.droplevel(0)
	df3.to_csv("./MonthlyCSVs/AirlineDepDelay.csv")
	cur.close()

	#01B
	#Airport with most delay (avg)
def AirPortDepDelay(startDate, endDate):
	query = "SELECT Origin, DATE_FORMAT(FlightDate,'%%Y-%%m') as yearWithMon, AVG(DepDelay) AS DepDelay FROM AllFlights_innodb WHERE Cancelled=0 and Diverted=0 and DepDelay>0 AND `FlightDate` BETWEEN ('%s') AND ('%s') GROUP BY Origin, yearWithMon" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./MonthlyCSVs/AirPortDepDelay.csv", df, fmt='%s', delimiter=",")
	df2=pd.read_csv("./MonthlyCSVs/AirPortDepDelay.csv")
	df3=pd.pivot_table(df2,index=["Origin"],columns=["yearWithMon"], values=["DepDelay"],aggfunc=np.mean)
	df3.columns = df3.columns.droplevel(0)
	df3.to_csv("./MonthlyCSVs/AirPortDepDelay.csv")
	cur.close()

def AirPortArrDelay(startDate, endDate):
	query = "SELECT Dest, DATE_FORMAT(FlightDate,'%%Y-%%m') as yearWithMon, AVG(DepDelay) AS DepDelay FROM AllFlights_innodb WHERE Cancelled=0 and Diverted=0 and DepDelay>0 AND `FlightDate` BETWEEN ('%s') AND ('%s') GROUP BY Dest, yearWithMon" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./MonthlyCSVs/AirPortArrDelay.csv", df, fmt='%s', delimiter=",")
	df2=pd.read_csv("./MonthlyCSVs/AirPortArrDelay.csv")
	df3=pd.pivot_table(df2,index=["Dest"],columns=["yearWithMon"], values=["DepDelay"],aggfunc=np.mean)
	df3.columns = df3.columns.droplevel(0)
	df3.to_csv("./MonthlyCSVs/AirPortArrDelay.csv")
	cur.close()
	



	#03
	#dg.StateDepOrigin, StateArrDest, CityDepOrigin, CityArrDest
def StateDepOrigin(startDate, endDate):
	query = "SELECT ap.state, DATE_FORMAT(f.FlightDate,'%%Y-%%m') AS yearWithMon, AVG(f.depdelay) AS DepDelay from (SELECT origin, FlightDate, depdelay FROM allflights_innodb AS a WHERE diverted=0 AND cancelled=0 AND DepDelay>0 AND `FlightDate` BETWEEN ('%s') AND ('%s')) as f INNER JOIN airport_lookup AS ap ON f.origin=ap.IATA_Code GROUP BY ap.state, yearWithMon" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./MonthlyCSVs/StateDepOrigin.csv", df, fmt='%s', delimiter=",")
	
	df2=pd.read_csv("./MonthlyCSVs/StateDepOrigin.csv")
	df3=pd.pivot_table(df2,index=["state"],columns=["yearWithMon"], values=["DepDelay"],aggfunc=np.mean)
	df3.columns = df3.columns.droplevel(0)
	df3.to_csv("./MonthlyCSVs/StateDepOrigin.csv")
	cur.close()

def StateArrDest(startDate, endDate):
	query = "SELECT ap.state, DATE_FORMAT(f.FlightDate,'%%Y-%%m') AS yearWithMon, AVG(f.arrdelay) AS ArrDelay from (SELECT dest, FlightDate, arrdelay FROM allflights_innodb AS a WHERE diverted=0 AND cancelled=0 AND ArrDelay>0 AND `FlightDate` BETWEEN ('%s') AND ('%s')) as f INNER JOIN airport_lookup AS ap ON f.dest=ap.IATA_Code GROUP BY ap.state, yearWithMon" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./MonthlyCSVs/StateArrDest.csv", df, fmt='%s', delimiter=",")
	
	df2=pd.read_csv("./MonthlyCSVs/StateArrDest.csv")
	df3=pd.pivot_table(df2,index=["state"],columns=["yearWithMon"], values=["ArrDelay"],aggfunc=np.mean)
	df3.columns = df3.columns.droplevel(0)
	df3.to_csv("./MonthlyCSVs/StateArrDest.csv")
	cur.close()

def CityDepOrigin(startDate, endDate):
	query = "SELECT ap.CityName, DATE_FORMAT(f.FlightDate,'%%Y-%%m') AS yearWithMon, AVG(f.depdelay) AS DepDelay from (SELECT origin, FlightDate, depdelay FROM allflights_innodb AS a WHERE diverted=0 AND cancelled=0 AND DepDelay>0 AND `FlightDate` BETWEEN ('%s') AND ('%s')) as f INNER JOIN airport_lookup AS ap ON f.origin=ap.IATA_Code GROUP BY ap.CityName, yearWithMon" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./MonthlyCSVs/CityDepOrigin.csv", df, fmt='%s', delimiter=",")
	
	df2=pd.read_csv("./MonthlyCSVs/CityDepOrigin.csv")
	df3=pd.pivot_table(df2,index=["CityName"],columns=["yearWithMon"], values=["DepDelay"],aggfunc=np.mean)
	df3.columns = df3.columns.droplevel(0)
	df3.to_csv("./MonthlyCSVs/CityDepOrigin.csv")
	cur.close()

def CityArrDest(startDate, endDate):
	query = "SELECT ap.CityName, DATE_FORMAT(f.FlightDate,'%%Y-%%m') AS yearWithMon, AVG(f.arrdelay) AS ArrDelay from (SELECT dest, FlightDate, arrdelay FROM allflights_innodb AS a WHERE diverted=0 AND cancelled=0 AND ArrDelay>0 AND `FlightDate` BETWEEN ('%s') AND ('%s')) as f INNER JOIN airport_lookup AS ap ON f.dest=ap.IATA_Code GROUP BY ap.CityName, yearWithMon" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./MonthlyCSVs/StateArrDest.csv", df, fmt='%s', delimiter=",")
	
	df2=pd.read_csv("./MonthlyCSVs/StateArrDest.csv")
	df3=pd.pivot_table(df2,index=["CityName"],columns=["yearWithMon"], values=["ArrDelay"],aggfunc=np.mean)
	df3.columns = df3.columns.droplevel(0)
	df3.to_csv("./MonthlyCSVs/StateArrDest.csv")
	cur.close()


	#05
	#dg.Airline and Airport(Origin) Cancellations
def AirlineCancellations(startDate, endDate):
	query = "SELECT IATA_Airline, DATE_FORMAT(FlightDate,'%%Y-%%m') as yearWithMon, SUM(Cancelled) AS TotCancelled FROM allflights_innodb WHERE `FlightDate` BETWEEN ('%s') AND ('%s') GROUP BY IATA_Airline, yearWithMon" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./MonthlyCSVs/AirlineCancellations.csv", df, fmt='%s', delimiter=",")
	df2=pd.read_csv("./MonthlyCSVs/AirlineCancellations.csv")
	df3=pd.pivot_table(df2,index=["IATA_Airline"],columns=["yearWithMon"], values=["TotCancelled"],aggfunc=np.mean)
	df3.columns = df3.columns.droplevel(0)
	df3.to_csv("./MonthlyCSVs/AirlineCancellations.csv")
	cur.close()


def AirportCancellations(startDate, endDate):
	query = "SELECT Origin, DATE_FORMAT(FlightDate,'%%Y-%%m') as yearWithMon, SUM(Cancelled) AS TotCancelled FROM allflights_innodb WHERE `FlightDate` BETWEEN ('%s') AND ('%s') GROUP BY Origin, yearWithMon" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./MonthlyCSVs/AirportCancellations.csv", df, fmt='%s', delimiter=",")
	df2=pd.read_csv("./MonthlyCSVs/AirportCancellations.csv")
	df3=pd.pivot_table(df2,index=["Origin"],columns=["yearWithMon"], values=["TotCancelled"],aggfunc=np.mean)
	df3.columns = df3.columns.droplevel(0)
	df3.to_csv("./MonthlyCSVs/AirportCancellations.csv")
	cur.close()


	#07
	#Routes with most delay
def RouteDelay(startDate, endDate):
	query = "SELECT Origin, Dest, CONCAT(Origin, '-', Dest) AS OrigDest, DATE_FORMAT(FlightDate,'%%Y-%%m') as yearWithMon, AVG(DepDelay+ArrDelay) AS TotalDelay FROM allflights_innodb WHERE `FlightDate` BETWEEN ('%s') AND ('%s') GROUP BY Origin, Dest, yearWithMon" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./MonthlyCSVs/RouteDelay.csv", df, fmt='%s', delimiter=",")
	df2=pd.read_csv("./MonthlyCSVs/RouteDelay.csv")
	df3=pd.pivot_table(df2,index=["OrigDest"],columns=["yearWithMon"], values=["TotalDelay"],aggfunc=np.mean)
	df3.columns = df3.columns.droplevel(0)
	df3.to_csv("./MonthlyCSVs/RouteDelay.csv")
	cur.close()
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
	np.savetxt("./MonthlyCSVs/TailNumberTaxiOut.csv", df, fmt='%s', delimiter=",")
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
	np.savetxt("./MonthlyCSVs/TailNumberTaxiIn.csv", df, fmt='%s', delimiter=",")
	cur.close()
