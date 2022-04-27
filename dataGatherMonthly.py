import numpy as np
import pandas as pd
from flask_mysqldb import MySQL
from flask import Flask, render_template, request

app = Flask(__name__)

# app.config['MYSQL_HOST'] = 'localhost'
# app.config['MYSQL_USER'] = 'root'
# app.config['MYSQL_PASSWORD'] = 'hello123'
# app.config['MYSQL_DB'] = 'flightdata'
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '123456'
app.config['MYSQL_DB'] = 'CS526'

db=MySQL(app)


	#01A
	#Airline delays (avg)
def AirLineArrDel(startDate, endDate):
	query = "SELECT IATA_Airline, DATE_FORMAT(FlightDate,'%%Y-%%m') as yearWithMon, AVG(ArrDelay) AS ArrDelay FROM AllFlights_innodb WHERE Cancelled=0 and Diverted=0 and ArrDelay>0 AND `FlightDate` BETWEEN ('%s') AND ('%s') GROUP BY IATA_Airline, yearWithMon" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	# num_fields = len(cur.description)
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
	# num_fields = len(cur.description)
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
	# num_fields = len(cur.description)
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
	# num_fields = len(cur.description)
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
	# num_fields = len(cur.description)
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
	# num_fields = len(cur.description)
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
	# num_fields = len(cur.description)
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
	# num_fields = len(cur.description)
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
	# num_fields = len(cur.description)
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
	# num_fields = len(cur.description)
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
	# num_fields = len(cur.description)
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
	# num_fields = len(cur.description)
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
	# num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./MonthlyCSVs/TailNumberTaxiIn.csv", df, fmt='%s', delimiter=",")
	cur.close()


#09 MonthlyDelayTypeAirline
def MonthlyDelayTypeAirline(startDate, endDate):
	query = "SELECT DATE_FORMAT(FlightDate,'%%Y-%%m') as yearWithMon, IATA_Airline, AVG(CarrierDelay) AS CarrierDelay, AVG(WeatherDelay) AS WeatherDelay, AVG(NASDelay) AS NASDelay, AVG(SecurityDelay) AS SecurityDelay, AVG(LateAircraftDelay) AS LateAircraftDelay FROM AllFlights_innodb WHERE Cancelled=0 and Diverted=0 AND `FlightDate` BETWEEN ('%s') AND ('%s') GROUP BY yearWithMon, IATA_Airline" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	header = [i[0] for i in cur.description]

				

	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	
	ls=[]
	ls.append([])
	ls[0].append("Date")
	ls[0].append("Airline")
	ls[0].append("DelayType")
	ls[0].append("DelayValue")
	
	count=1
	for i in range(1,np.shape(df)[0]):
		ls.append([])
		for j in range(np.shape(df)[1]):
			if j>=2 and df[i][j]>0:
				ls[count].append(df[i][0])
				ls[count].append(df[i][1])
				ls[count].append(header[j])
				ls[count].append(str(round(float(df[i][j]),2)))
				count+=1
				ls.append([])
				#ls=ls+[df[i][:2]+[header[j]]+[str(df[i][j])]]
	ls_new=[",".join(item) for item in ls]
	np.savetxt("./MonthlyCSVs/MonthlyDelayTypeAirline.csv", ls_new, fmt='%s', delimiter=",")
	cur.close()
	


#10 MonthlyDelayTypeAirline
def MonthlyDelayTypeAirlineWoYear(startDate, endDate):
	query = "SELECT DATE_FORMAT(FlightDate,'%%m') as yearWithMon, IATA_Airline, AVG(CarrierDelay) AS CarrierDelay, AVG(WeatherDelay) AS WeatherDelay, AVG(NASDelay) AS NASDelay, AVG(SecurityDelay) AS SecurityDelay, AVG(LateAircraftDelay) AS LateAircraftDelay FROM AllFlights_innodb WHERE Cancelled=0 and Diverted=0 AND `FlightDate` BETWEEN ('%s') AND ('%s') GROUP BY yearWithMon, IATA_Airline" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	header = [i[0] for i in cur.description]
				

	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	
	ls=[]
	ls.append([])
	ls[0].append("Month")
	ls[0].append("Airline")
	ls[0].append("DelayType")
	ls[0].append("DelayValue")
	
	count=1
	for i in range(1,np.shape(df)[0]):
		ls.append([])
		for j in range(np.shape(df)[1]):
			if j>=2 and df[i][j]>0:
				ls[count].append(df[i][0])
				ls[count].append(df[i][1])
				ls[count].append(header[j])
				ls[count].append(str(round(float(df[i][j]),2)))
				count+=1
				ls.append([])
	ls_new=[",".join(item) for item in ls]
	

	np.savetxt("./MonthlyCSVs/MonthlyDelayTypeAirlineWoYear.csv", ls_new, fmt='%s', delimiter=",")
	cur.close()




#11 YearMonthCanncelledAirline
def YearMonthCanncelledAirline(startDate, endDate):
	query = "SELECT DATE_FORMAT(FlightDate,'%%Y') as Year, DATE_FORMAT(FlightDate,'%%m') as Month, IATA_Airline AS Airline, SUM(Cancelled) AS TotalCancelled FROM AllFlights_innodb WHERE Diverted=0 AND `FlightDate` BETWEEN ('%s') AND ('%s') GROUP BY Year, Airline, Month" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	# num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./MonthlyCSVs/YearMonthCanncelledAirline.csv", df, fmt='%s', delimiter=",")
	cur.close()


#12 Airport Count	
#Airport with most delay (avg)
def AirPortCount(startDate, endDate):
	query = "SELECT Origin, DATE_FORMAT(FlightDate,'%%Y-%%m') as yearWithMon, COUNT(Origin) AS Count FROM AllFlights_myisam WHERE Cancelled=0 and Diverted=0 AND `FlightDate` BETWEEN ('%s') AND ('%s') GROUP BY Origin, yearWithMon" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./MonthlyCSVs/AirPortCount.csv", df, fmt='%s', delimiter=",")
	df2=pd.read_csv("./MonthlyCSVs/AirPortCount.csv")
	df3=pd.pivot_table(df2,index=["Origin"],columns=["yearWithMon"], values=["Count"],aggfunc=np.mean)
	df3.columns = df3.columns.droplevel(0)
	df3.to_csv("./MonthlyCSVs/AirPortCount.csv")
	cur.close()


#13 Airline Count	
#Airport with most delay (avg)
def AirLineCount(startDate, endDate):
	query = "SELECT IATA_Airline, DATE_FORMAT(FlightDate,'%%Y-%%m') as yearWithMon, Count(IATA_Airline) AS Count FROM AllFlights_myisam WHERE Cancelled=0 and Diverted=0 AND `FlightDate` BETWEEN ('%s') AND ('%s') GROUP BY IATA_Airline, yearWithMon" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./MonthlyCSVs/AirLineCount.csv", df, fmt='%s', delimiter=",")
	df2=pd.read_csv("./MonthlyCSVs/AirLineCount.csv")
	df3=pd.pivot_table(df2,index=["IATA_Airline"],columns=["yearWithMon"], values=["Count"],aggfunc=np.mean)
	df3.columns = df3.columns.droplevel(0)
	df3.to_csv("./MonthlyCSVs/AirLineCount.csv")
	cur.close()