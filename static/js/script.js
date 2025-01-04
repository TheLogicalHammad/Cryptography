


// Getting all the algo options and switching mechanisms
const li_affine = document.getElementById("li-affine");
const li_rsa = document.getElementById("li-rsa");
const li_hashing = document.getElementById("li-hashing");
const li_fence = document.getElementById("li-fence");

const affine = document.querySelector(".main.affine");
const rsa = document.querySelector(".main.rsa");
const hashing = document.querySelector(".main.hashing");
const fence = document.querySelector(".main.fence");

const errorMessageBox = document.createElement("span");
errorMessageBox.classList.add("wrongNumber");

window.onload = function() {
    let spanA = document.getElementById("upperLimitA");
    spanA.innerText = M;
}

li_affine.addEventListener("click", ()=> {
    affine.classList.remove("hidden"); li_affine.classList.add("focus");
    rsa.classList.add("hidden"); li_rsa.classList.remove("focus");
    hashing.classList.add("hidden"); li_hashing.classList.remove("focus");
    fence.classList.add("hidden"); li_fence.classList.remove("focus");
})
li_rsa.addEventListener("click", ()=> {
    affine.classList.add("hidden"); li_affine.classList.remove("focus");
    rsa.classList.remove("hidden"); li_rsa.classList.add("focus");
    hashing.classList.add("hidden"); li_hashing.classList.remove("focus");
    fence.classList.add("hidden"); li_fence.classList.remove("focus");
})
li_hashing.addEventListener("click", ()=> {
    affine.classList.add("hidden"); li_affine.classList.remove("focus");
    rsa.classList.add("hidden"); li_rsa.classList.remove("focus");
    hashing.classList.remove("hidden"); li_hashing.classList.add("focus");
    fence.classList.add("hidden"); li_fence.classList.remove("focus");
})
li_fence.addEventListener("click", ()=> {
    affine.classList.add("hidden"); li_affine.classList.remove("focus");
    rsa.classList.add("hidden"); li_rsa.classList.remove("focus");
    hashing.classList.add("hidden"); li_hashing.classList.remove("focus");
    fence.classList.remove("hidden"); li_fence.classList.add("focus");
})


// //////////////////////////////////////////////////////////////////// //
// ///////////////    Working for affine Cipher    //////////////////// //
// //////////////////////////////////////////////////////////////////// //
const affineMessageBox = document.getElementById("message-affine");
const keyyA = document.getElementById("keyA");
const keyyB = document.getElementById("keyB");
const outputMessage = document.getElementById("outputAffineMessage");
// let M = 95;
function gcd(a, b) {
	if (a < b) {
		let temp = a;
		a = b;
		b = temp;
	}
	while (b != 0) {
		let temp = a % b;
		a = b;
		b = temp;
	}
	return a;
}
// const domClickOnce = (errorA) =>  {

// }

function checkInput(m, a, b, c){

    console.log (m, a, b, M);

    let errorA = document.getElementById("labelM");
    let containsError = false;
    if (m == ""){
        if (c == 'e'){
            errorMessageBox.innerText = `Please enter text to encrypt!`;
        }
        else {
            errorMessageBox.innerText = `Please enter text to decrypt!`;
        }
        containsError = true;
    }
    else if (a <= 1 || a > M) {
        errorA = document.getElementById("labelA");
        errorMessageBox.innerText = `Number out of range!`;
        containsError = true;
    }
    else if (gcd(a, M) != 1) {
        errorA = document.getElementById("labelA");
        errorMessageBox.innerText = `This number is not allowed!`;
        containsError = true;
    }

    else if (b <= 0 || b > 10*M) {
        errorA = document.getElementById("labelB");
        errorMessageBox.innerText = `Number out of range!`;
        containsError = true;
    }

    if (containsError) {
        errorA.appendChild(errorMessageBox);
        setTimeout(() => {
            document.addEventListener("click", domClickOnce = () => {
                if (errorA.contains(errorMessageBox)){
                    errorA.removeChild(errorMessageBox);
                }
                console.log("document clicked lol");
                document.removeEventListener("click", domClickOnce);
            });
        }, 300);
        
        setTimeout(() => {
            if (errorA.contains(errorMessageBox)){
                errorA.removeChild(errorMessageBox);
            }
            document.removeEventListener("click", domClickOnce);
        }, 2000);
    }
    return containsError;
}

function sendAffine(c) {
    let message = affineMessageBox.value;
    let KeyA = parseInt(keyyA.value);  // Convert KeyA to integer
    let KeyB = parseInt(keyyB.value);  // Convert KeyB to integer

    // Make sure the values are valid integers
    if (checkInput(message, KeyA, KeyB, c)) {
        return;
    }


    // Prepare the data to send to the backend
    let formData = new FormData();
    formData.append('message', message);
    formData.append('KeyA', KeyA);
    formData.append('KeyB', KeyB);

    if (c == 'e'){
    // Make an AJAX request to the backend
        fetch('/encryptAffine', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Handle the response from the server
            if (data) {
                // Display the encrypted message
                console.log(data);
                outputMessage.innerText = data.message;
                encORdec.innerText = "Encrypted";
            } else {
                alert("Encryption failed. Please try again.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("An error occurred. Please try again.");
        });
    }
    if (c == 'd'){
        fetch('/decryptAffine', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Handle the response from the server
            if (data) {
                // Display the encrypted message
                console.log(data);
                outputMessage.innerText = data.message;
                encORdec.innerText = "Decrypted";
            } else {
                alert("Encryption failed. Please try again.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("An error occurred. Please try again.");
        });
    }
}




// //////////////////////////////////////////////////////////////////// //
// /////////////////    Working for RSA Cipher    ///////////////////// //
// //////////////////////////////////////////////////////////////////// //
const AlgoButton = document.getElementById("button-rsaAlgo");
const KeysButton = document.getElementById("button-rsaKeys");

const AlgoSection = document.querySelector(".rsa-algo");
const KeysSection = document.querySelector(".rsa-keys");

const PrimeEnterBtn = document.getElementById("rsa-enter");
const ECheckBtn = document.getElementById("rsa-check");
const primeP = document.getElementById("p");
const primeQ = document.getElementById("q");
const keyE = document.getElementById("e");

const RSAMessageBox = document.getElementById("RSAmessage");
const keyFinalN = document.getElementById("keyFinalN");
const keyFinalED = document.getElementById("keyFinalED");
const outputRSAmessage = document.getElementById("outputRSAMessage");

let n;
let phi;

AlgoButton.addEventListener("click", ()=> {
    AlgoSection.classList.remove("hidden");
    KeysSection.classList.add("hidden");
    let horizontal_line = document.querySelector(".horizontal");
    horizontal_line.style.left = "0";
    horizontal_line.style.right = "auto";
})
KeysButton.addEventListener("click", ()=> {
    AlgoSection.classList.add("hidden");
    KeysSection.classList.remove("hidden");
    let horizontal_line = document.querySelector(".horizontal");
    horizontal_line.style.left = "auto";
    horizontal_line.style.right = "0";
})

// This function checks if a given number is prime (true) or not (false). 
function isPrime(n) {
    if (n <= 1) {
        return false;
    } else if (n <= 3) {
        return true;
    } else if (n % 2 === 0 || n % 3 === 0) {
        return false;
    }
    let i = 5;
    while (i * i <= n) {
        if (n % i === 0 || n % (i + 2) === 0) {
            return false;
        }
        i += 6;
    }
    return true;
}

// This is the extended euclidean function. It uses recursion to calculate
// gcd and bezout's coefficients of two numbers. 
function extendedEuclidean(a, b) {
    if (b === 0) {
        return [a, 1, 0];
    } else {
        const [gcd, x1, y1] = extendedEuclidean(b, a % b);
        const x = y1;
        const y = x1 - Math.floor(a / b) * y1;
        return [gcd, x, y];
    }
}

// This function gets GCD of two numbers. It also ensures that the first
// number is always bigger than the second
function GCD(a, b) {
    if (a < b) {
        [a, b] = [b, a];
    }
    const [gcd] = extendedEuclidean(a, b);
    return gcd;
}

// This function uses extended euclidean algorithm to get modular inverse of a number
function modInv(a, m) {
    let [gcd, x] = extendedEuclidean(a, m);
    if (gcd === 1) {
        // This while loop ensures that d is always positive
        while (x < 0) {
            x += m;
        }
        return x % m;
    } else {
        return null;
    }
}

function checkInputPrimes(p, q) {
    let containsError = false;

    if (!isPrime(p)) {
        alert(`${p} is not a prime number!`);
        containsError = true;
    }
    else if (p < 200) {
        alert(`${p} is less than 200!`);
        containsError = true;
    }
    else if (!isPrime(q)) {
        alert(`${q} is not a prime number!`);
        containsError = true;
    }
    else if (q < 200) {
        alert(`${q} is less than 200!`);
        containsError = true;
    }
    return containsError;
}

// PrimeEnterBtn.addEventListener("click", ()=> {
//     if (primeP.value == "") {
//         alert("Please enter p");
//         return;
//     }
//     else if (primeQ.value == "") {
//         alert("Please enter q");
//         return;
//     }
//     let p = parseFloat(primeP.value);
//     let q = parseFloat(primeQ.value);
//     if (checkInputPrimes(p, q)) {
//         return;
//     }

//     n = p * q;
//     phi = (p-1)*(q-1);
//     document.querySelector(".keyN").innerText = `${n}`;
// });

ECheckBtn.addEventListener("click", ()=> {
    if (primeP.value == "" || primeQ.value == "") {
        alert("Please Enter prime numbers first!"); return;
    }
    let p = parseFloat(primeP.value);
    let q = parseFloat(primeQ.value);
    if (checkInputPrimes(p, q)) {
        return;
    }
    n = p*q;
    phi = (p-1) * (q-1);
    if (keyE.value == "") {
        alert("Please enter e");
        return;
    }
    let e = parseFloat(keyE.value);
    if (GCD(e, phi) != 1 || e >= phi || e < 100) {
        if (e < 100) {
            alert("e cannot be less than 100!");
        }
        else {
            alert("That value of e is not allowed. Please chose another!");
        }
        return;
    }
    document.querySelector(".keyN").innerText = `${n}`;
    document.querySelector(".keyE").innerText = `${e}`;
    document.querySelector(".keyD").innerText = `${modInv(e, phi)}`;
})

function sendRSA(c) {
    if (RSAMessageBox.value == "" || keyFinalN.value == "" || keyFinalED.value == "") {
        alert("Please ensure to enter all values!");
        return;
    }
    let message = RSAMessageBox.value;
    let KeyN = parseInt(keyFinalN.value);  // Convert KeyA to integer
    let KeyED = parseInt(keyFinalED.value);  // Convert KeyB to integer

    // Make sure the values are valid integers


    // Prepare the data to send to the backend
    let formData = new FormData();
    formData.append('message', message);
    formData.append('n', KeyN);
    
    if (c == 'e'){
        formData.append('e', KeyED);
        // Make an AJAX request to the backend
        fetch('/encryptRSA', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Handle the response from the server
            if (data) {
                // Display the encrypted message
                console.log(data.message);
                outputRSAmessage.innerText = data.message;
                encORdec.innerText = "Encrypted";
            } else {
                alert("Encryption failed. Please try again.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("An error occurred. Please try again.");
        });
    }
    if (c == 'd'){
        formData.append('d', KeyED);
        fetch('/decryptRSA', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Handle the response from the server
            if (data) {
                // Display the encrypted message
                console.log(data);
                outputRSAmessage.innerText = data.message;
                encORdec.innerText = "Decrypted";
            } else {
                alert("Encryption failed. Please try again.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("An error occurred. Please try again.");
        });
    }
}




// //////////////////////////////////////////////////////////////////// //
// //////////////////     Working for Hashing     ///////////////////// //
// //////////////////////////////////////////////////////////////////// //

const HashMessage = document.getElementById("Hashmessage");
const outputHashMessage = document.getElementById("outputHashMessage");

HashMessage.addEventListener("input",  ()=> {
    if (HashMessage.value.length > 4) {
        HashMessage.value = HashMessage.value.slice(0, 4);
    }
});

function sendHash() {
    if (HashMessage.value == "") {
        alert("Please Enter a value to hash");
        return;
    }
    let message = HashMessage.value;

    let formData = new FormData();
    formData.append('message', message);

    fetch('/generateHash', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response from the server
        if (data) {
            // Display the encrypted message
            console.log(data.message);
            outputHashMessage.innerText = data.message;
            encORdec.innerText = "Encrypted";
        } else {
            alert("Encryption failed. Please try again.");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("An error occurred. Please try again.");
    });
       
}





// //////////////////////////////////////////////////////////////////// //
// //////////////////    Working for Fence Rail    //////////////////// //
// //////////////////////////////////////////////////////////////////// //

const fenceMessage = document.getElementById("FenceMessage");
const numRows = document.getElementById("num_rows");
const times = document.getElementById("times");
const outputFenceMessage = document.getElementById("outputFenceMessage");

function sendFence(c) {
    if (fenceMessage.value == "" || numRows.value == "" || times.value == "") {
        alert("Please ensure to enter all values!");
        return;
    }
    let message = fenceMessage.value;
    let num_rows = parseInt(numRows.value);  // Convert KeyA to integer
    let num_times = parseInt(times.value);  // Convert KeyB to integer

    if (num_rows < 2 || num_times < 1) {
        alert("Invalid Keys!")
        return;
    }

    // Prepare the data to send to the backend
    let formData = new FormData();
    formData.append('message', message);
    formData.append('num_rails', num_rows);
    formData.append('times', num_times);
    
    if (c == 'e'){
        // Make an AJAX request to the backend
        fetch('/encryptFence', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Handle the response from the server
            if (data) {
                // Display the encrypted message
                console.log(data.message);
                outputFenceMessage.innerText = data.message;
                encORdec.innerText = "Encrypted";
            } else {
                alert("Encryption failed. Please try again.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("An error occurred. Please try again.");
        });
    }
    if (c == 'd'){
        fetch('/decryptFence', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Handle the response from the server
            if (data) {
                // Display the encrypted message
                console.log(data);
                outputFenceMessage.innerText = data.message;
                encORdec.innerText = "Decrypted";
            } else {
                alert("Encryption failed. Please try again.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("An error occurred. Please try again.");
        });
    }
}

function copyToClipBoard(outputId){
    let textBox = document.getElementById(outputId);
    let copyButton = document.getElementById(`C${outputId}`);
    if (textBox.innerText != "") {
        let copySpan = document.createElement("span");
        copySpan.classList.add("copiedMessage");
        copySpan.innerText = "Copied";
        copyButton.appendChild(copySpan);
        navigator.clipboard.writeText(textBox.innerText);
        setTimeout(() => {
            if (copyButton.contains(copySpan)){
                copyButton.removeChild(copySpan);
            }
        }, 1000);
    }
}