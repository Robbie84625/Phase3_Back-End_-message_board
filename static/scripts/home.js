document.getElementById('chooseFileButton').addEventListener('click', function () {
    document.getElementById('fileInput').click();
    });

document.getElementById('fileInput').addEventListener('change', function () {
    const fileInput = document.getElementById('fileInput');
    const fileNameSpan = document.getElementById('fileName');
    const file = fileInput.files[0];


    if (file) {
        fileNameSpan.textContent = file.name;
    } else {
        fileNameSpan.textContent = 'No file chosen';
    }
});

document.getElementById("uploadButton").addEventListener("click", function () {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const messageContent= document.getElementById('messageContent');

    if (!file || messageContent.value.trim() === "") {
        return;
    }

    const formData = new FormData();
    formData.append('messageContent', messageContent.value);
    
    // 如果选择了文件，添加文件到 formData
    if (file) {
        formData.append('file', file);
    }

    fetch("/upload", {
        method: "POST",
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("上傳失敗");
        }
        return response.json();
    })
    .then(data => {
        console.log("文件上傳成功", data);
    })
    .catch(error => {
        console.error("上傳錯誤", error);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('fileInput');
    const fileNameSpan = document.getElementById('fileName');

    fileInput.addEventListener('change', function () {
        const file = fileInput.files[0];

        if (file) {
            fileNameSpan.textContent = file.name;
        } else {
            fileNameSpan.textContent = 'No file chosen';
        }
    });
});

async function loginUserAndFetchData() {
try {
    const response = await fetch("/upload");
    if (!response.ok) {
        throw new Error("网络响应错误");
    }

    // 解析JSON数据
    const data = await response.json();
    console.log(data[0])
    for(let information of data){

        // 创建外层的 <div class="messageBoard__content">
        const messageBoardContent = document.createElement("div");
        messageBoardContent.classList.add("messageBoard__content");

        // 判断 image_url 是否为空
        if (information['image_url']!== null) {
        // 创建内部的 <div class="messageBoard__content__image">
        const image = document.createElement("img");
        image.classList.add("messageBoard__content__image");
        image.src = information['image_url'];
        
        // 将图片元素添加到外层的 <div> 中
        messageBoardContent.appendChild(image);
        }

        // 判断 content 是否为空
        if (information['content']!=="") {
        // 创建内部的 <div class="messageBoard__content__text">
        const textDiv = document.createElement("div");
        textDiv.classList.add("messageBoard__content__text");
        textDiv.textContent = information['content'];
        
        // 将文本元素添加到外层的 <div> 中
        messageBoardContent.appendChild(textDiv);
        }

        // 创建 <hr>
        const hrElement = document.createElement("hr");

        // 将内部的 <hr> 元素添加到外层的 <div> 中
        messageBoardContent.appendChild(hrElement);

        // 获取要添加到的父元素 <div class="messageBoard">
        const parentDiv = document.querySelector(".messageBoard");

        // 将外层的 <div> 添加到父元素中
        parentDiv.appendChild(messageBoardContent);
    }


    } catch (error) {
        // 处理错误情况
        console.error("發生錯誤:", error);
    }
}

loginUserAndFetchData()