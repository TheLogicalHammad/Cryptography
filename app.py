from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

############################ General ############################



############################ Affine  ############################
M = " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`-=~!@#$%^&*()_+[]\\{};':\",|./<>?"
lenM = len(M)
ascii = []
cipher = []

def stringToInt(ascii,  message):
	for i in range(0, len(message)):
		for j in range(0, lenM):
			if (message[i] == M[j]):
				ascii.append(j)
				
def intToString(ascii, cipher):
	for i in range(0, len(ascii)):
		cipher.append(M[ascii[i]])

def encryptAffine(ascii, a, b):
	for i in range(0, len(ascii)):
		ascii[i] = ((ascii[i] * int(a)) + int(b)) % int(lenM)

def inverse(a, m):
	i = 1
	while (True):
		temp = int((m * i) + 1)
		if ((temp) % a == 0):
			return int(temp / a)
		i += 1

def decryptAffine(ascii, a, b):
	aIn = inverse(int(a), lenM)
	for i in range(0, len(ascii)):
		d = ((ascii[i] - int(b)) * int(aIn))
		while (d < 0):
			d += lenM
		ascii[i] = int(d) % int(lenM)

def cipherToString(cipher):
	encryptedMessage = ""
	for i in range(0, len(cipher)):
		encryptedMessage += cipher[i]
	return encryptedMessage


############################  RSA  ############################

string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789',./?-_!"

# This function takes a message as input, converts it to a number list, adds 10 to each number to get rid of 1 digit numbers. It then combines two numbers to make a single number. 
def toNum(message):
    M = []
    for m in message:
        for i in range(0, len(string)):
            if string[i] == m:
                M.append(str(i+10))
    i = 0
    Mnew = []
    while (i < len(M)):
        if (i < len(M)-1):
            Mnew.append(int(M[i] + M[i+1]))
        else:
            Mnew.append(int(M[i]))
        i += 2
    return Mnew

# This function is used to convert numbers back to alphabets to retrieve the original message. 
def toStr(M):
    message = ""
    for i in M:
        if (i < len(string)):
            message += string[i]
    return message

# This function takes a number and base as input and returns an inverted list of numbers in the target base. It is primarily used for base two only. 
def toBinaryRSA(num, b):
    binary = []
    q = num
    while q != 0:
        q = num//b
        binary.append(num % b)
        num = q
    return binary

# This is the fast modular algorithm/ function
def fastModular(m, a, n):
    x = 1
    p = m % n
    for k in a:
        if k == 1:
            x = (x * p) % n
        p = (p * p) % n
    return x

# User entered values will be comma separated. This function converts this input to a number list.
def refineInput(string):
    msg = string.strip()
    if msg.startswith("["):
        msg = msg[1:]
    if msg.endswith("]"):
        msg = msg[:-1]
    msg = msg.split(",")
    temp = []
    for m in msg:
        temp.append(int(m))
    return temp


############################  HASH  ############################

W = []

def rightRotate(str, n):
    if n < len(str):
        n = n % len(str)
    temp = str[:n]
    str = str[n:]
    str = str + temp
    return str

def leftRotate(str, n):
    if n < len(str):
        n = n % len(str)
    temp = str[len(str) -n:]
    str = str[:len(str) -n]
    str = temp + str
    return str

def XOR(s1, s2):
    result = ""
    for a, b in zip(s1, s2):
        if a != b:
            result += "1"
        else:
            result += "0"
    return result

def binaryAddition(binary1, binary2):
    if len(binary1) != len(binary2):
        return None
    carry = 0
    result = ""

    for i in range(len(binary1) - 1, -1, -1):
        bit1, bit2 = int(binary1[i]), int(binary2[i])

        sum_bits = (bit1 + bit2 + carry) % 2
        carry = (bit1 + bit2 + carry) // 2

        result = str(sum_bits) + result

    return result


def Sigma(str, n):
    if (n == 0):
        r1, r2, l3 = 1, 8, 7
    elif (n == 1):
        r1, r2, l3 = 2, 3, 4
    
    a = rightRotate(str, r1)
    b = rightRotate(str, r2)
    c = leftRotate(str, l3)

    ab = XOR(a, b)

    abc = XOR(ab, c)

    return abc

def getW(t):
    A = Sigma(W[t-2], 1)
    B = W[t-7]
    C = Sigma(W[t-15], 0)
    D = W[t-16]

    AB = binaryAddition(A, B)
    ABC = binaryAddition(AB, C)
    ABCD = binaryAddition(ABC, D)

    return ABCD

def ToBinaryHash(num):
    b = 2
    if (num > 256):
        print("Binary index out of range!")
        return
    binary = ""
    q = num
    while q != 0:
        q = num//b
        binary += str(num % b)
        num = q
    while(len(binary) < 8):
        binary += "0"
    return ''.join(reversed(binary))

def getBinary(string):
    strASCII = []
    for c in string:
        strASCII.append(ord(c))

    binASCII = []
    for s in strASCII:
        binASCII.append(ToBinaryHash(s))
    
    return ''.join(binASCII)

binDictionary = {
    "0000": "0",
    "0001": "1",
    "0010": "2",
    "0011": "3",
    "0100": "4",
    "0101": "5",
    "0110": "6",
    "0111": "7",
    "1000": "8",
    "1001": "9",
    "1010": "A",
    "1011": "B",
    "1100": "C",
    "1101": "D",
    "1110": "E",
    "1111": "F"
}

def binToHex(str):
    if (len(str)) % 4 != 0:
        print("Error. Length of binary string not multiple of 4")
        return
    result = ""
    for i in range(8):
        result += binDictionary[str[(i*4):(i*4)+4]]
    return result




############################  FENCE  ############################




def remove_spaces(message):
    return message.replace(' ', '_')

def add_spaces(message):
    return message.replace('_', ' ')

def encrypt(message, num_rails):
    fence = [[' ' for _ in range(len(message))] for _ in range(num_rails)]
    
    j = 0
    increment = 1
    for i in range(len(message)):
        fence[j][i] = message[i]
        if j >= num_rails - 1:
            increment = -1
        if j <= 0:
            increment = 1
        j += increment

    final = ''.join(fence[row][col] for row in range(num_rails) for col in range(len(message)) if fence[row][col] != ' ')
    
    return final

def decrypt(message, num_rails):
    starting_point = (num_rails * 2) - 3
    spaces = []
    while starting_point > 0:
        spaces.append(starting_point)
        starting_point -= 2

    fence = [[' ' for _ in range(len(message))] for _ in range(num_rails)]
    
    c = 0
    for i in range(num_rails):
        j = i
        fence[i][j] = message[c]
        c += 1
        if i == 0 or i == num_rails - 1:
            while j < len(message):
                j += spaces[0] + 1
                if j < len(message):
                    fence[i][j] = message[c]
                    c += 1
        else:
            switch = False
            while j < len(message):
                if switch:
                    j += spaces[num_rails - i - 1] + 1
                    if j < len(message):
                        fence[i][j] = message[c]
                        c += 1
                    switch = False
                else:
                    j += spaces[i] + 1
                    if j < len(message):
                        fence[i][j] = message[c]
                        c += 1
                    switch = True

    final = ''
    j = 0
    increment = 1
    for i in range(len(message)):
        final += fence[j][i]
        if j >= num_rails - 1:
            increment = -1
        if j <= 0:
            increment = 1
        j += increment
    
    return final

@app.route('/encryptFence', methods = ['POST'])
def encryptFence():
    message = request.form.get('message')
    num_rails = int(request.form.get('num_rails'))
    times = int(request.form.get('times'))
    message = remove_spaces(message)
    for i in range(times):
        message = encrypt(message, num_rails)
    message = add_spaces(message)
    return jsonify({'message': message})

@app.route('/decryptFence', methods = ['POST'])
def decryptFence():
    message = request.form.get('message')
    num_rails = int(request.form.get('num_rails'))
    times = int(request.form.get('times'))
    message = remove_spaces(message)
    for i in range(times):
        message = decrypt(message, num_rails)
    message = add_spaces(message)
    return jsonify({'message': message})













@app.route('/generateHash', methods = ['POST'])
def generateHash():
    W.clear()
    message = request.form.get('message')
    str33 = getBinary(message)
    lenStr33 = len(str33)
    while (len(str33) < 32):
        str33 += "0"
    str33 += '1'
    str64 = ToBinaryHash(lenStr33) # toBinary always returns a block of 8 bits
    str64 = "00000000000000000000000000000000000000000000000000000000" + str64 # 56 0s plus block of 8 bits
    str415 = "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000" # redundance bits (total 415)
    sha512 = str33 + str415 + str64
    # Getting First 16 Ws
    while (len(sha512) > 0):
        temp = sha512[:32]
        sha512 = sha512[32:]
        W.append(temp)

    # Getting remaining Ws
    for i in range(16, 64):
        temp = getW(i)
        W.append(temp)
    hexW = []
    for w in W:
        hexW.append(binToHex(w))
    resultHash = ''.join(hexW)
    return jsonify({'message': resultHash})







@app.route('/encryptRSA', methods = ['POST'])
def encryptRSA():
    message = request.form.get('message')
    n = int(request.form.get('n'))
    e = int(request.form.get('e'))
    cipher = []
    M = toNum(message)
    binary = toBinaryRSA(e, 2)
    for num in M:
        cipher.append(fastModular(num, binary, n))
    
    return jsonify({'message': cipher})

@app.route('/decryptRSA', methods = ['POST'])
def decryptRSA():
    message = request.form.get('message')
    cipher = refineInput(message)
    n = int(request.form.get('n'))
    d = int(request.form.get('d'))
    binary = toBinaryRSA(d, 2)
    temp = []
    for c in cipher:
        temp.append(fastModular(c, binary, n))
    Original = []
    for c in temp:
        if (c >= 100):
            Original.append((c//100) -10)
        Original.append((c % 100) -10)
    sendthis = toStr(Original)
    return jsonify({'message': sendthis})















@app.route('/encryptAffine', methods = ['POST'])
def encryptAffineMessage():
    message = request.form.get('message')
    keyA = request.form.get('KeyA')
    keyB = request.form.get('KeyB')

    ascii.clear()
    cipher.clear()
	
    stringToInt(ascii, message)
    encryptAffine(ascii, keyA, keyB)
    intToString(ascii, cipher)
	
    encryptedMessage = cipherToString(cipher)
    return jsonify({'message': encryptedMessage})

@app.route('/decryptAffine', methods = ['POST'])
def decryptAffineMessage():
    message = request.form.get('message')
    keyA = request.form.get('KeyA')
    keyB = request.form.get('KeyB')

    ascii.clear()
    cipher.clear()
	
    stringToInt(ascii, message)
    decryptAffine(ascii, keyA, keyB)
    intToString(ascii, cipher)
	
    encryptedMessage = cipherToString(cipher)
    return jsonify({'message': encryptedMessage})

@app.route('/')
def hello():
    return render_template("index.html", lenM = lenM) 


if __name__ == "__main__":
    app.run(debug=True)

