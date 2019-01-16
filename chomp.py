"""
Chompin' it up!
By Joseph Rios
"""
import os
class conf:
    loss={(1,)}
    win={(1,1):(0,1)}
    def __init__(self,l=[]):
        #Each value in the tuple stands
        #for the length of each row in
        #the configuration, so not = 0
        self.data=l

    def winMove(self):
        #First check to see if the configuration has been visited before
        if(tuple(self.data) in conf.loss):
            return None
        elif(tuple(self.data) in conf.win):
            return conf.win.get(tuple(self.data))
        else:
            for y,i in enumerate(self.data):
                for x in range(i):
                    if(x!=0 or y!=0):
                        temp=self.transform(x,y)
                        if(temp.winMove()==None): #Here is the recursive call
                            #Add winning move for this configuration
                            conf.win[tuple(self.data)]=(x,y)
                            return (x,y)
            #If you get to here there are no winning moves
            conf.loss.add(tuple(self.data))
            return None

    def winMoves(self):
        #Basically the same as the above function, except it accounts for
        #the possibility of having more than one winning move for a
        #particular configuration
        #Consider trying to prove that this could never be the case.
        results = []
        if(tuple(self.data) in conf.loss):
            return None
        elif(tuple(self.data) in conf.win):
            return results.append(conf.win.get(tuple(self.data)))
        else:
            for y,i in enumerate(self.data):
                for x in range(i):
                    if(x!=0 or y!=0):
                        temp=self.transform(x,y)
                        if(temp.winMove()==None):
                            conf.win[tuple(self.data)]=(x,y)
                            results.append((x,y))
            if(len(results)==0):
                conf.loss.add(tuple(self.data))
                return None
            else:
                return results

    def transform(self,x,y):
        #Makes a move on the configuration (removes some chocolate)
        #Should remove self, everything below it and everything left of it
        #Output is a new configuration
        temp=[]
        for n,i in enumerate(self.data):
            if(n>=y and i>x):
                temp.append(x)
            else:
                temp.append(i)
        while(0 in temp):
            temp.remove(0)
        return conf(temp)

    def __str__(self):
        #For pretty printing
        result=""
        for i in self.data:
            result+=i*"#"
            result+="\n"
        return result

    def load(self,loss,win):
        #Load our win/loss data from previous iterations to save time
        winf=open(win,'r')
        lossf=open(loss,'r')
        for i in lossf:
            line=tuple(i.split())
            conf.loss.add(line)
        lossf.close()
        for i in winf:
            pos=tuple(i.split()[0:1])
            val=tuple(i.split()[1:])
            conf.win[val]=pos
        winf.close()

    def save(self,loss,win):
        #Save our win/loss data to be used next time
        lossf=open(loss,'w')
        winf=open(win,'w')
        for i in conf.loss:
            temp=""
            for j in i:
                temp+=(str(j)+" ")
            temp+="\n"
            lossf.write(temp)
        lossf.close()
        for i in conf.win:
            temp=""
            for j in conf.win.get(i):
                temp+=(str(j)+" ")
            for j in i:
                temp+=(str(j)+" ")
            temp+="\n"
            winf.write(temp)
        winf.close()
            
def main():
    """
    print("Loading...")
    x=conf([1])
    x.load("loss.txt","win.txt")
    print("Done.")
    while(True):
        k=input("Configuration: ")
        if(k=="quit"):
            print("Saving...")
            x.save("loss.txt","win.txt")
            print("Done.")
            break
        else:
            try:
                lst=list(map(int,k.split()))
                x=conf(lst)
                print(x.winMove())
            except:
                print("Invalid")
    """
    x=conf([9,9,9,9])
    print(x.winMove())
    
main()
