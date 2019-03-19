


def initial_data():
    name = './u.data'
    U = set()
    I = set()
    P = {}
    LU = []
    LI = []
    fr = open(name, 'r')
    i=0
    for line in fr:
        line = line.strip('\r\n')
        cols = line.split('\t')
        T = {}
        user = int(cols[0])
        item = int(cols[1])
        P.setdefault(user,[]).append(item)
        U.add(user)
        I.add(item)
        if(i==50):
            break
        i+=1
    fr.close()
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
    print ('initial_data')
    P,LU,LI = initial_data()
    len_user = len(LU)
    len_item = len(LI)
    print(P,"------\n",LU,"----------\n",LI)
    print ('actual_count_x1')
    A1 = actual_count_x1(P, LI, len_item)
    print ('actual_count_x2')
    A2 = actual_count_x2(P, LI, len_item)
    
    alpha = 0.5
    top_k = 10

    # ground truth
    print (compute_similarity)
    S = compute_similarity(A1, A2, len_item, alpha)
    print ('make_recommendation')
    Gt = make_recommendation(P, S, LU, LI, len_user, len_item)

    # for uid in range(len_user):
    #     content = 'user:' + str(uid) + '\t' + str(Gt[uid][0][0]) + ':' + str(Gt[uid][0][1])
    #     for iid in range(1, top_k):
    #         content = content + '\t' + str(Gt[uid][iid][0]) + ':' + str(Gt[uid][iid][1])
    #     print content