from flask import Flask, render_template, request
from flask_mysqldb import MySQL
import datetime

import dataGatherWhole as dgw
import dataGatherMonthly as dgm
import dataFetch as df

app = Flask(__name__)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'hello123'
app.config['MYSQL_DB'] = 'flightdata'

db=MySQL(app)


@app.route('/')
def index():
	#data fetch
	df.AirlineArrDelay('AA','08','2015','02','2016')

	

	return render_template('index.html')


#=======================================================

#Airports
@app.route('/APcomp')
def APcompPage():
	return render_template('APcomp.html')

@app.route('/APperf')
def APperfPage():
	return render_template('APperf.html')

@app.route('/APusage')
def APusagePage():
	return render_template('APusage.html')

#hello test
#Airlines
@app.route('/ALcomp')
def ALcompPage():
	return render_template('ALcomp.html')

@app.route('/ALperf')
def ALperfPage():
	return render_template('ALperf.html')

@app.route('/ALusage')
def ALusagePage():
	return render_template('ALusage.html')



@app.route('/pred')
def predPage():
	return render_template('pred.html')


@app.route('/admin')
def AdminPage():
	t1=datetime.datetime.now()

#WHOLE DATA

	#01A
	#Airline delays (avg)
	#dgw.AirLineDepDel("2015-01-01","2019-12-31")
	#dgw.AirLineArrDel("2015-01-01","2019-12-31")
	#AirLineDel2("2015-01-01","2019-12-31")

	#01B
	#Airport with most delay (avg)
	#dgw.AirPortDepDelay("2015-01-01","2019-12-31")
	#dgw.AirPortArrDelay("2015-01-01","2019-12-31")

	#02
	#Year Month MonthName Day DayName
	#dgw.YearlyDepDelay("2015-01-01","2019-12-31")
	#dgw.YearlyArrDelay("2015-01-01","2019-12-31")
	#dgw.MonthlyDepDelay("2015-01-01","2019-12-31")
	#dgw.MonthlyArrDelay("2015-01-01","2019-12-31")
	#dgw.MonthNameDepDelay("2015-01-01","2019-12-31")
	#dgw.MonthNameArrDelay("2015-01-01","2019-12-31")
	#dgw.DailyDepDelay("2015-01-01","2019-12-31")
	#dgw.DailyArrDelay("2015-01-01","2019-12-31")
	#dgw.WeekdayDepDelay("2015-01-01","2019-12-31")
	#dgw.WeekdayArrDelay("2015-01-01","2019-12-31")

	#03
	#dgw.StateDepOrigin, StateArrDest, CityDepOrigin, CityArrDest
	#dgw.StateDepOrigin("2015-01-01","2019-12-31")
	#dgw.StateArrDest("2015-01-01","2019-12-31")
	#dgw.CityDepOrigin("2015-01-01","2019-12-31")
	#dgw.CityArrDest("2015-01-01","2019-12-31")

	#04
	#Factors behind delayed departures/arrivals
	#dgw.AirlineDelayType("2015-01-01","2019-12-31")
	#dgw.AirportOriginDelayType("2015-01-01","2019-12-31")
	#dgw.AirportDestDelayType("2015-01-01","2019-12-31")

	#05
	#dgw.Airline and Airport(Origin) Cancellations
	#dgw.AirlineCancellations("2015-01-01","2019-12-31")
	#dgw.AirportCancellations("2015-01-01","2019-12-31")

	#06
	#dgw.AirlineCancelDist("2015-01-01","2019-12-31")
	#dgw.AirportOriginCancelDist("2015-01-01","2019-12-31")
	#dgw.AirportDestCancelDist("2015-01-01","2019-12-31")

	#07
	#Routes with most delay
	#dgw.RouteDelay("2015-01-01","2019-12-31")

	#08
	#dgw.Tail Number Taxi Out/In
	#dgw.TailNumberTaxiOut("2015-01-01","2019-12-31")
	#dgw.TailNumberTaxiIn("2015-01-01","2019-12-31")
	

#MONTHLY DATA

	#01A
	#Airline delays (avg)
	#dgm.AirLineDepDel("2015-01-01","2019-12-31")
	#dgm.AirLineArrDel("2015-01-01","2019-12-31")

	#01B
	#Airport with most delay (avg)
	#dgm.AirPortDepDelay("2015-01-01","2019-12-31")
	#dgm.AirPortArrDelay("2015-01-01","2019-12-31")


	#03
	#StateDepOrigin, StateArrDest, CityDepOrigin, CityArrDest
	#dgm.StateDepOrigin("2015-01-01","2019-12-31")
	#dgm.StateArrDest("2015-01-01","2019-12-31")
	#dgm.CityDepOrigin("2015-01-01","2019-12-31")
	#dgm.CityArrDest("2015-01-01","2019-12-31")



	#05
	#Airline and Airport(Origin) Cancellations
	#dgm.AirlineCancellations("2015-01-01","2019-12-31")
	#dgm.AirportCancellations("2015-01-01","2019-12-31")


	#07
	#Routes with most delay
	#dgm.RouteDelay("2015-01-01","2019-12-31")
	
#=========================================================================================
	



#=========================================================================================

	t2=datetime.datetime.now()
	tDiff=t2-t1
	time=tDiff.total_seconds()
	time="Time to execute query: "+str(time)+" seconds"


	return render_template("admin.html", time=time)



if __name__ == '__main__':
	app.run(host='127.0.0.1', port=8080, debug=True)