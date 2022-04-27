import re
import pandas as pd
from flask import Flask, render_template, request
from flask_mysqldb import MySQL
import datetime
import socket
import json
import time

# import findspark
# findspark.init()
# from pyspark import SparkContext, SparkConf
# from pyspark.sql import SparkSession
# conf = SparkConf().setAppName('APM').setMaster('local')
# sc = SparkContext.getOrCreate(conf=conf)
# spark = SparkSession(sc)

# If some query is too slow, use spark
# .config("spark.driver.extraClassPath", "mysql-connector-java-5.1.48.jar") \
# if(socket.gethostname()=="Tathagata-PC"):
# 	url = 'jdbc:mysql://localhost:3306/flightdata'
# 	property = {'user': 'root', 'password': 'hello123'}
# else:
# 	url = 'jdbc:mysql://localhost:3306/CS526'
# 	property = {'user': 'root', 'password': '123456'}
# flight_df=spark.read.jdbc(url=url, table='AllFlighgts_innodb', properties=property)

flights_file_path = "static/files/Result_Data.csv"
airport_file_path = "static/files/Airport_Lookup.csv"
route_file_path="static/files/Origin_Dest_List.csv"

# allflights_df=spark.read.csv(flights_file_path,header=True)  #4.04s
	# airport_df = spark.read.csv(airport_file_path, header=True)  # 0.16s
	# route_df = spark.read.csv(route_file_path, header=True)
# try:
airport_df = pd.read_csv(airport_file_path, header=0)  # 0.16s
route_df = pd.read_csv(route_file_path, header=0)
# airport_df['']df2.groupby(by='Origin', as_index=False).agg({'Dest': pd.Series.nunique})
# topAp=topAp.sort_values(['Dest'], ascending=[False])
    #print("Pyspark Finish Loading")
# except:
    # spark.stop()
    # print("ERROR")
app = Flask(__name__)
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
if(socket.gethostname() == "Tathagata-PC"):
    app.config['MYSQL_PASSWORD'] = 'hello123'
    app.config['MYSQL_DB'] = 'flightdata'
else:
    app.config['MYSQL_PASSWORD'] = '123456'
    app.config['MYSQL_DB'] = 'CS526'

db = MySQL(app)
# class Flights:
# 	def __init__(self, timestamp=0, data=None, metadata=None):
#         self.timestamp = timestamp
#         self.data = list() if data is None else data
#         self.metadata = dict() if metadata is None else metadata

#     @classmethod
#     def from_file(cls, path):
#        _file = cls.get_file(path)
#        timestamp = _file.get_timestamp()
#        data = _file.get_data()
#        metadata = _file.get_metadata()
#        return cls(timestamp, data, metadata)

#     @classmethod
#     def from_metadata(cls, timestamp, data, metadata):
#         return cls(timestamp, data, metadata)

#     @staticmethod
#     def get_file(path):
#         # ...
#         pass

# 	def __init__(self,ID){
# 		self.FlightDate=FlightDate;
# 		self.IATA_Airline=IATA_Airline;
# 		self.FlightNumber=FlightNumber;
# 		self.Origin=Origin;
# 		self.Dest=Dest;
# 		self.CRSDepTime=CRSDepTime;
# 		self.CRSArrTime=CRSArrTime;
# 	}
# 	def __init__(self,FlightDate,IATA_Airline,FlightNumber,Origin,Dest,CRSDepTime,CRSArrTime,){
# 		self.FlightDate=FlightDate;
# 		self.IATA_Airline=IATA_Airline;
# 		self.FlightNumber=FlightNumber;
# 		self.Origin=Origin;
# 		self.Dest=Dest;
# 		self.CRSDepTime=CRSDepTime;
# 		self.CRSArrTime=CRSArrTime;
# 	}
# 	def get

# class Airports:
# 	def __init__(self,IATA_Code,,dest,crs_dep_time,crs_arr_time){
# 		self.date=date;
# 		self.origin=origin;
# 		self.dest=dest;
# 		self.crs_dep_time=crs_dep_time
# 		self.crs_arr_time=crs_arr_time
# 	}
# class Airlines:

# query = "SELECT IATA_Code,ICAO_Code,AirportName,City,State,Latitude,Longitude,Altitude FROM Airport_Lookup"
# cur=db.connection.cursor()
# cur.execute(query)
# row_headers=[i[0].strip("'") for i in cur.description]
# rows=cur.fetchall()
# cur.close()
# json_data=[]
# for result in rows:
# 	json_data.append(dict(zip(row_headers,result)))


def load_all_airports():
    # query = "SELECT IATA_Code,ICAO_Code,AirportName,City,State,Latitude,Longitude,Altitude FROM Airport_Lookup"
    # cur=db.connection.cursor()
    # cur.execute(query)
    # row_headers=[i[0].strip("'") for i in cur.description]
    # rows=cur.fetchall()
    # cur.close()
    # json_data=[]
    # for result in rows:
    # 	json_data.append(dict(zip(row_headers,result)))

    # json_data = [json.loads(i)
    #              for i in airport_df.select("*").toJSON().collect()]
    #print(airport_df.iloc[0])
    #json_data = [json.loads(i) for i in airport_df]
    # print(airport_df['Diverted'])
    json_data = airport_df.to_json(orient='records')
    #print(json_data)
    return json_data
    #return json.dumps(json_data)

def get_route_list(origin):
    json_data=route_df.where(route_df["origin"]==origin).select("dest").to_json(orient='records')
    return json_data

def get_airport_ranking():
    pass


def AirlineArrDelay(IATA_Airline, SM, SY, EM, EY):
    pass
