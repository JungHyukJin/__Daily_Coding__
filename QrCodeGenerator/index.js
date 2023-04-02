const download = document.querySelector(".download");
const qrContainer = document.querySelector("#qr-code");

const defaultUrl = "Front-end Developer";
let colorDark = "#000",
  colorLight = "#fff",
  text = defaultUrl,
  size = 300;

const dark = document.querySelector(".dark");
const handleDarkColor = (e) => {
    colorDark = e.target.value;
    generateQRCode();
}
dark.addEventListener("input", handleDarkColor);

const light = document.querySelector(".light");
const handleLightColor = (e) => {
    colorLight = e.target.value;
    generateQRCode();
}
light.addEventListener("input", handleLightColor);

const qrText = document.querySelector(".qr-text");
const handleQrText = (e) => {
    const value = e.target.value;
    text = value;
    if(!value){
        text = defaultUrl;
    }
    generateQRCode();
}
qrText.addEventListener("input", handleQrText);

const generateQRCode = async () => {
    qrContainer.innerHTML = "";
    new QRCode("qr-code", {
        text,
        height: size,
        width: size,
        colorDark,
        colorLight
    });
    download.href = await resolveDataUrl();
}

const shareBtn = document.querySelector(".share-btn");
const handleShare = async () => {
    console.log('s')
    setTimeout(async () => {
        try{
            const base64url = await resolveDataUrl();
            const blob = await(await fetch(base64url)).blob();
            const file = new File([blob], "QRCode.png", {
                type: blob.type,
            })
            await navigator.share({
                files: [file],
                title: text,
            });
        } catch (error){
            alert("Your browser doesn't support share.")
        }
    },100);    
}
shareBtn.addEventListener("click", handleShare);

const sizes = document.querySelector(".sizes");
const handlesizes = (e) => {
    size = e.target.value;
    generateQRCode();
}
sizes.addEventListener("change", handlesizes);

const resolveDataUrl = () => {
    return new Promise((resolve, reject) => {
        setTimeout(()=>{
            const img = document.querySelector("#qr-code img");
            if(img.currentSrc){
                resolve(img.currentSrc);
                return;
            }
            const canvas = document.querySelector("canvas");
            resolve(canvas.toDataURL());
        }, 50);
    })
}

generateQRCode();