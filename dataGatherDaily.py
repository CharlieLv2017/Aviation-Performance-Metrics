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
def DepArrCanDaily(startDate, endDate):
	#query = "SELECT FlightDate AS `Date`, IF(ArrDelay>0 AND Cancelled=0,COUNT(ArrDelay)*100.0/COUNT(*),0) AS Arr, IF(DepDelay>0 AND Cancelled=0,COUNT(DepDelay)*100.0/COUNT(*),0) AS Dep, COUNT(Cancelled)*100.0/COUNT(*) AS Cancel FROM AllFlights_innodb WHERE `FlightDate` BETWEEN ('%s') AND ('%s') GROUP BY FlightDate" % (startDate, endDate)
	query = "SELECT FlightDate AS `Date`, IF(ArrDelay>0 AND Cancelled=0,COUNT(ArrDelay))*100.0/COUNT(*) AS Arr, IF(DepDelay>0 AND Cancelled=0,COUNT(DepDelay)*100.0/COUNT(*),0) AS Dep, COUNT(Cancelled)*100.0/COUNT(*) AS Cancel FROM AllFlights_innodb WHERE `FlightDate` BETWEEN ('%s') AND ('%s') GROUP BY FlightDate" % (startDate, endDate)
	cur=db.connection.cursor()
	cur.execute(query)
	rows=cur.fetchall()
	# num_fields = len(cur.description)
	header = [i[0] for i in cur.description]
	header=np.asarray(header)
	rows=np.asarray(rows)
	df=np.vstack((header,rows))
	np.savetxt("./DailyCSVs/DepArrCanDaily.csv", df, fmt='%s', delimiter=",")
	cur.close()

