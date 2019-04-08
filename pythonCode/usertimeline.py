
from __future__ import division
import random
import copy
import math
import os
import numpy as np
import pymysql
import sys

def get_user_timeline():
    db = pymysql.connect(host="localhost",port=3306,user="root",\
        password="123456",db="fanfou_schema",charset='utf8')
    cursor = db.cursor()
    sql = "SELECT * FROM fanfou_schema.user_timeline_not_null"
    try:
        cursor.execute(sql)
        results = cursor.fetchall()
        return results
    except Exception as e:
        print ("Error")
    finally:
        db.close()


def initial_data():
    results = get_user_timeline()
    U = set()
    I = set()
    P = {}
    LU = []
    LI = []
    LT = []
    i=0
    for row in results:
        T = {}
        user = row[13]
        item = row[0]
        P.setdefault(user,[]).append(item)
        U.add(user)
        I.add(item)
        if(row[10] is not None and row[10].strip() !=""):
            item = row[10]
            P.setdefault(user,[]).append(item)
            I.add(item)
        # if(i==5000):
        #     break
        # i+=1
    LU = list(U)
    LI = list(I)
    return P,LU,LI

def actual_count_x1(P, LI, len_item):
    X1 = [0]*len_item
    for u in P:
        for id in P[u]:
            iid = LI.index(id)
            X1[iid] += 1   
    return X1
    
def actual_count_x2(P, LI, len_item):
    X2 = [[0]*len_item for col in range(len_item)]
    for u in P:
        for id in P[u]:
            iid = LI.index(id)
            for jd in P[u]:
                if jd == id:
                    continue
                jid = LI.index(jd)
                X2[iid][jid] += 1
    return X2
    
def compute_similarity(A1, A2, len_item, alpha):
    S = [[0]*len_item for col in range(len_item)]
    for iid in range(len_item):
        for jid in range(len_item):
            if jid == iid:
                continue
            if A1[jid] <= 0:
                continue
            S[iid][jid] = A2[iid][jid]/(A1[iid]*(A1[jid]**alpha))
    return S

def make_recommendation(P, S, LU, LI, len_user, len_item):
    Gt = {}
    for u in P:
        uid = LU.index(u)
        L = range(len_item)
        L1 = []
        L2 = [0]*len_item
        for id in P[u]:
            iid = LI.index(id)
            L1.append(iid)
        for iid in range(len_item):
            for jid in L1:
                L2[iid] += S[iid][jid]
        D = dict(zip(L, L2))
        D1 = sorted(D.items(), key = lambda x:x[1], reverse = True)
        Gt[uid] = D1
    return Gt

if __name__ == '__main__': 
    # 传递过来的参数：
    need_top_k = int(sys.argv[1])
    alpha = float(sys.argv[2])

    print('need_top_k: ',need_top_k)
    print ('initial_data')
    P,LU,LI = initial_data()
    len_user = len(LU)
    len_item = len(LI)
    # print("P",P)
    print ('actual_count_x1')
    A1 = actual_count_x1(P, LI, len_item)
    print ('actual_count_x2')
    A2 = actual_count_x2(P, LI, len_item)
    top_k = 60
    # ground truth
    print (compute_similarity)
    S = compute_similarity(A1, A2, len_item, alpha)
    print ('make_recommendation')
    Gt = make_recommendation(P, S, LU, LI, len_user, len_item)


    re_uid = 0
    for uid in range(len_user):
        if(LU[uid] != "~Z-lo_exzyRQ"):
            continue
        re_uid = uid
        content = 'user:' + str(uid) +"LU[uid]:"+LU[uid] + '\t' + str(Gt[uid][0][0]) + ':' + str(Gt[uid][0][1])+ " item:"+LI[Gt[uid][0][0]]
        for iid in range(1, top_k):
            content = content + '\t' + str(Gt[uid][iid][0]) + ':' + str(Gt[uid][iid][1]) +" item:"+LI[Gt[uid][iid][0]]
        print (content)


    cur_grade = Gt[re_uid][0][1]
    count = 3
    skip = 0;
    dict_top_k_list = [] # 存储所需要的list
    for i in range(0, top_k):
        if(cur_grade == Gt[re_uid][i][1] and count >= 3):
            continue
        elif(cur_grade == Gt[re_uid][i][1]):
            count += 1
            dict_top_k_list.append(LI[Gt[re_uid][i][0]])
            need_top_k -= 1
            if(need_top_k <= 0):
                break
        else:
            if(skip < 1):
                cur_grade = Gt[re_uid][i][1]
                skip += 1
                continue
            count = 1
            cur_grade = Gt[re_uid][i][1]
            dict_top_k_list.append(LI[Gt[re_uid][i][0]])
            need_top_k -= 1
            if(need_top_k <= 0):
                break
    for i in dict_top_k_list:
        print(i)



