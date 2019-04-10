
from __future__ import division
import random
import copy
import math
import os
import numpy as np
import pymysql
import sys

gamma = 0.005

def initial_graph():
	results = get_user_friend()
	G = {}
	U = []
	for row in results :
		G.setdefault(row[1],[]).append(row[3])
		G.setdefault(row[3],[]).append(row[1])
	for value in G.keys():
		G[value] = list(set(G[value]))  # G is a dict, operation on keys
		USER_NUM = len(G)
	delta = 1/(USER_NUM**2)
	for i in G.keys():
		U.append(i)
	return G, U



# get user's friends infomation
def get_user_friend():
	db = pymysql.connect(host="localhost",port=3306,user="root",\
		password="123456",db="fanfou_schema",charset='utf8')
	cursor = db.cursor()
	sql = "SELECT * FROM fanfou_schema.user_friend_info"
	try:
		cursor.execute(sql)
		results = cursor.fetchall()
		return results
	except Exception as e:
		print ("Error")
	finally:
		db.close()

def recommendation_for_users(U, G, method, top_k, user_id):
	#slice = random.sample(U, int(len(U)/10))
	path = './result/utility/'
	if os.path.exists(path) == False:
		os.makedirs(path)
	name = path + method + '.txt'
	tag = 0
	for u in U:
		if(str(u) != user_id):
			continue
		tag += 1
		command = 'compute_' + method + '_recommendation(u, U, G)'
		R = eval(command)
		R_E = sorted(R.items(), key=lambda d:d[1], reverse=True) # used for evaluation, order by utility
		content = 'method:' + str(method) + '\t' 'user:' + str(u)
		for i in range(0, top_k):
			# content = content + '\t' + str(R_E[i][0]) + ':' + str(R_E[i][1])
			content = str(R_E[i][0]) + ':' + str(R_E[i][1])
			resu = str(R_E[i][0])
			print (content)

def compute_common_neighbors_recommendation(u, U, G):
	C = {}
	for i in U:
		C[i] = 0
	set_1 = set(G[u])
	set_2 = set()
	for u1 in set_1:
		set_2 = set_2 | set(G[u1])
	try:
		set_2.remove(u)
	except:
		pass
	set_2 = set_2 - set_1
	for u2 in set_2:
		set_3 = set(G[u2])
		similar = len(set_1 & set(G[u2]))
		if C[u2] < similar:
			C[u2] = similar
	return C

def compute_katz_recommendation(u, U, G):
	C = {}
	for i in U:
		C[i] = 0
	set_1 = set(G[u])
	set_2 = set()
	set_3 = set()
	for u1 in set_1:
		set_2 = set_2 | set(G[u1])
	try:
		set_2.remove(u)
	except:
		pass
	set_2 = set_2 - set_1
	for u2 in set_2:
		set_3 = set_3 | set(G[u2])
	try:
		set_3.remove(u)
	except:
		pass
	set_3 = set_3 - set_1
	for u2 in set_2:
		C[u2] += len(set_1 & set(G[u2]))
	for u3 in set_3:
		C[u3] += len(set(G[u3]) & set_2)*gamma
	return C

def compute_graph_distance_recommendation(u, U, G):
	C = {}
	for i in U:
		C[i] = 0
	set_1 = set(G[u])
	set_2 = set()
	set_3 = set()
	for u1 in set_1:
		set_2 = set_2 | set(G[u1])
	try:
		set_2.remove(u)
	except:
		pass
	set_2 = set_2 - set_1
	for u2 in set_2:
		set_3 = set_3 | set(G[u2])
	try:
		set_3.remove(u)
	except:
		pass
	set_3 = set_3 - set_1
	set_3 = set_3 - set_2
	for u2 in set_2:
		C[u2] = 0.5
	for u3 in set_3:
		C[u3] = 1/3
	return C


def test():
	results = get_user_friend()
	for row in results:
		print(row[0],row[1],row[2],row[3],row[4])
		break

if __name__ == '__main__':
	# test()
	G, U = initial_graph()
	top_k = int(sys.argv[1])
	ura = str(sys.argv[2])
	user_id = str(sys.argv[3])
	isUserPrivate = str(sys.argv[4])
	recommendation_methods = ['common_neighbors','graph_distance','katz']
	if(ura == "URA1"):
		recommendation_for_users(U,G,recommendation_methods[0],top_k,user_id)
	elif(ura == "URA2"):
		recommendation_for_users(U,G,recommendation_methods[1],top_k,user_id)
	else:
		recommendation_for_users(U,G,recommendation_methods[2],top_k,user_id)
	# for elem in recommendation_methods:
	# 	recommendation_for_users(U, G, elem, top_k)
