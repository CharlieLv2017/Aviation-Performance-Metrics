from flask import Flask, render_template, request, jsonify
from flask_mysqldb import MySQL
import datetime
import socket
import dataGatherWhole as dgw
import dataGatherMonthly as dgm
import dataGatherDaily as dgd
import dataFetch as df

app = Flask(__name__)
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
if(socket.gethostname()=="Tathagata-PC"):
	app.config['MYSQL_PASSWORD'] = 'hello123'
	app.config['MYSQL_DB'] = 'flightdata'
else:
	app.config['MYSQL_PASSWORD'] = '123456'
	app.config['MYSQL_DB'] = 'CS526'

db=MySQL(app)

# Dashboard or index
@app.route('/')
@app.route('/index.html', methods=["GET","POST"])
def index():
	return render_template('index.html')

@app.route('/navigation.html', methods=["GET","POST"])
def navigationPage():
	return render_template('navigation.html')

# Time Series
@app.route('/TimeSeries.html', methods=["GET","POST"])
def TimeSeries():
	return render_template('TimeSeries.html')

# Airports
@app.route('/APmap.html', methods=["GET","POST"])
def APmapPage():
	return render_template('APmap.html', data=df.load_all_airports())

@app.route('/APPerf.html', methods=["GET","POST"])
def APPerfPage():
	return render_template('APPerf.html')

# Airlines
@app.route('/ALComp.html', methods=["GET","POST"])
def ALCompPage():
	return render_template('ALComp.html')

@app.route('/ALMonthWise.html', methods=["GET","POST"])
def ALMonthWise():
	return render_template('ALMonthWise.html')

@app.route('/ALCancel.html', methods=["GET","POST"])
def ALCancelPage():
	return render_template('ALCancel.html')

# Misc Plot
@app.route('/MiscPlots.html', methods=["GET","POST"])
def MiscPlotsPage():
	return render_template('MiscPlots.html')

# About
@app.route('/about.html', methods=["GET","POST"])
def aboutPage():
	return render_template("about.html")


if __name__ == '__main__':
	app.run(host='127.0.0.1', port=8080, debug=True)