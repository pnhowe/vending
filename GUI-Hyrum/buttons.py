import tkinter as tk
import random

from api import API

itemString = ''
numberTurple = ('1','2','3','4','5','6','7','8','9','0')



def makeItem(put):
    global itemString
    global numberTurple

    if (put in numberTurple and itemString in numberTurple) or (put not in numberTurple and itemString not in numberTurple):
        # happens either if both are numbers or letters
        itemString = put

    elif (put in numberTurple and itemString not in numberTurple) or (put not in numberTurple and itemString in numberTurple):

    
        # happens if both are different
        if put in numberTurple:
            itemString += put
        elif put not in numberTurple:
            itemString = put + itemString

    if len(itemString) == 2:
        print(itemString + ' fell')
        itemString = ''

def summonButtons():

    buttons = []
    buttonRef = (('A', '50', '50'), ('B', '100', '50'), ('C', '150', '50'), ('D', '200', '50'), ('E', '50', '100'), ('F', '100', '100'), ('1', '150', '100'), ('2', '200', '100'), ('3', '50', '150'), ('4', '100', '150'), ('5', '150', '150'), ('6', '200', '150'), ('7', '50', '200'), ('8', '100', '200'), ('9', '150', '200'), ('0', '200', '200'))

    for i in buttonRef:
        buttons.append((tk.Button(root, text = i[0], bd = 2, command = lambda: makeItem(i[0])), i[1], i[2]))

    for i in buttons:
        i[0].pack()
        i[0].place(x=i[1], y=i[2])


def scanSuccess():
    api.scan()
    customer = api.getCustomer()

    print(customer)


    print('scan successful. Hello {0}, you have ${1} to spend'.format( customer['name'], customer['balance'] ) )

    for product in api.getProducts():
        print( product )

    scanbtn.pack_forget()
    summonButtons()

api = API()

root = tk.Tk()
root.geometry('300x300')
frame = tk.Frame(root)
frame.pack()

instruction_label = tk.Label(root, bg='white', text="Select what you want!")
instruction_label.pack()

scanbtn = tk.Button(root, text = "Scan Face.", bd = 4, command = scanSuccess)
scanbtn.pack(side = 'top')




root.mainloop()
